package routes

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func PostTrade() gin.HandlerFunc {
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
			Url:    "create-trade",
			Body:   bodyReqBody,
			Access: uuid.MustParse(claims.Uuid),
		}

		msg := rabbitmq.SendRPC(bodyReq)

		buf := bytes.NewBuffer(msg)
		dec := gob.NewDecoder(buf)

		var newTrade sharedtypes.Transaction

		dec.Decode(&newTrade)

		c.JSON(http.StatusOK, gin.H{
			"trade": newTrade,
		})
  }
}

func PostCompleteTrade() gin.HandlerFunc {
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
			Url:    "complete-trade",
			Body:   bodyReqBody,
			Access: uuid.MustParse(claims.Uuid),
		}

		msg := rabbitmq.SendRPC(bodyReq)

		buf := bytes.NewBuffer(msg)
		dec := gob.NewDecoder(buf)

		var newTrade sharedtypes.Transaction

		dec.Decode(&newTrade)

		c.JSON(http.StatusOK, gin.H{
			"trade": newTrade,
		})
  }
}

func GetAllTrades() gin.HandlerFunc {
  return func(c *gin.Context) {
    bodyReq := sharedtypes.BrainReq {
      Url: "get-trades",
    } 
    msg := rabbitmq.SendRPC(bodyReq)

    var trades []sharedtypes.Transaction

		buf := bytes.NewBuffer(msg)
		dec := gob.NewDecoder(buf)
    dec.Decode(&trades)

    c.JSON(http.StatusOK, gin.H{
      "trades": trades,
    })
  }
}

func TradeRoutes(r *gin.Engine) {
  tradeGroup := r.Group(TRADE_ROUTE)
  tradeGroup.Use(middleware.Auth())
  tradeGroup.POST(CREATE_TRADE_ROUTE, middleware.ParsePostMiddleware(sharedtypes.GetTransactionBody), PostTrade())
  tradeGroup.POST(COMPLETE_TRADE_ROUTE, middleware.ParsePostMiddleware(sharedtypes.GetCompleteTransaction), PostCompleteTrade())
  tradeGroup.GET("/", GetAllTrades())
}
