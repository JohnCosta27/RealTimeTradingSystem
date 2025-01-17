package routes

import (
	"encoding/json"
	"fmt"
	"hub/cache"
	"hub/middleware"
	"hub/rabbitmq"
	"log"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

func BroadcastTrade(wsMap map[*websocket.Conn]bool, trade sharedtypes.Transaction) {
	for ws := range wsMap {
		ws.WriteJSON(trade)
	}
}

func PostTrade(ws map[*websocket.Conn]bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		b, _ := c.Get("body")
		body := b.(*sharedtypes.CreateTransaction)

		accessToken := c.GetHeader("access")
		claims, err := utils.DecodeJwt(accessToken, "access")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorised access token",
			})
			return
		}

		bodyReqBody := make(map[string]string)
		bodyReqBody["Type"] = body.Type
		bodyReqBody["AssetId"] = body.AssetId
		bodyReqBody["Price"] = fmt.Sprintf("%f", body.Price)
		bodyReqBody["Amount"] = fmt.Sprintf("%f", body.Amount)

		bodyReq := sharedtypes.BrainReq{
			Url:    sharedtypes.CREATE_TRADE,
			Body:   bodyReqBody,
			Access: uuid.MustParse(claims.Uuid),
		}

		msg := rabbitmq.SendRPC(bodyReq)
		var newTrade sharedtypes.Transaction
		err = json.Unmarshal(msg, &newTrade)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "This service has encountered an issue",
			})
			return
		}

		BroadcastTrade(ws, newTrade)

		c.JSON(http.StatusOK, gin.H{
			"trade": newTrade,
		})
	}
}

func PostCompleteTrade(ws map[*websocket.Conn]bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		b, _ := c.Get("body")
		body := b.(*sharedtypes.CompleteTransaction)

		accessToken := c.GetHeader("access")
		claims, err := utils.DecodeJwt(accessToken, "access")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorised access token",
			})
			return
		}

		bodyReqBody := make(map[string]string)
		bodyReqBody["TransactionId"] = body.TransactionId

		bodyReq := sharedtypes.BrainReq{
			Url:    sharedtypes.COMPLETE_TRADE,
			Body:   bodyReqBody,
			Access: uuid.MustParse(claims.Uuid),
		}

		msg := rabbitmq.SendRPC(bodyReq)

		var newTrade sharedtypes.Transaction
		err = json.Unmarshal(msg, &newTrade)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "This service has encountered an issue",
			})
			return
		}

		BroadcastTrade(ws, newTrade)

		c.JSON(http.StatusOK, gin.H{
			"trade": newTrade,
		})
	}
}

func GetAllTradesBody(data []sharedtypes.Transaction) any {
	return gin.H{
		"trades": data,
	}
}

func GetAllTrades() gin.HandlerFunc {
	return func(c *gin.Context) {
		bodyReq := sharedtypes.BrainReq{
			Url: sharedtypes.GET_TRADES,
		}
		msg := rabbitmq.SendRPC(bodyReq)

		var trades []sharedtypes.Transaction
		err := json.Unmarshal(msg, &trades)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "This service has encountered an issue",
			})
			return
		}

		c.Set(cache.CACHE, string(msg))
		c.JSON(http.StatusOK, GetAllTradesBody(trades))
	}
}

func GetAllTradesAssetsBody(data []sharedtypes.Transaction) any {
	return gin.H{
		"trades": data,
	}
}

func GetAllTradesAssets() gin.HandlerFunc {
	return func(c *gin.Context) {
		AssetId, exists := c.GetQuery("AssetId")

		if !exists {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "This asset could not be found",
			})
			return
		}

		bodyReqBody := make(map[string]string)
		bodyReqBody["AssetId"] = AssetId
		bodyReq := sharedtypes.BrainReq{
			Url:  sharedtypes.GET_ASSET_TRADES,
			Body: bodyReqBody,
		}

		msg := rabbitmq.SendRPC(bodyReq)
		var res []sharedtypes.Transaction

		err := json.Unmarshal(msg, &res)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "This service has encountered an issue",
			})
			return
		}

		c.JSON(http.StatusOK, GetAllTradesAssetsBody(res))
	}
}

func TradeRoutes(r *gin.Engine, ws map[*websocket.Conn]bool) {
	tradeGroup := r.Group(TRADE_ROUTE)
	tradeGroup.Use(middleware.Auth())

	tradeGroup.POST(CREATE_TRADE_ROUTE,
		utils.ParsePostMiddleware(sharedtypes.GetTransactionBody),
		PostTrade(ws),
	)

	tradeGroup.POST(COMPLETE_TRADE_ROUTE,
		utils.ParsePostMiddleware(sharedtypes.GetCompleteTransaction),
		PostCompleteTrade(ws),
	)

	tradeGroup.GET(ASSET_TRADES_ROUTE, GetAllTradesAssets())

	tradeGroup.GET("/",
		middleware.CacheReq(false, false, sharedtypes.GET_TRADES, []sharedtypes.Transaction{}, GetAllTradesBody),
		GetAllTrades(),
	)
}
