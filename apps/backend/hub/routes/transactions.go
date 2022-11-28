package routes

import (
	"bytes"
	"encoding/gob"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
)

func PostTrade(r *gin.Engine) {
	r.POST(TRADE_ROUTE, middleware.ParsePostMiddleware(sharedtypes.GetTransactionBody), func(c *gin.Context) {
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
    bodyReqBody["UserId"] = claims.Uuid

    bodyReq := sharedtypes.BrainReq{
      Url: "create-trade",
      Body: bodyReqBody,
    }

    msg := rabbitmq.SendRPC(bodyReq)

    buf := bytes.NewBuffer(msg)
    dec := gob.NewDecoder(buf)

    var newTrade sharedtypes.Transaction

    dec.Decode(&newTrade)

		c.JSON(http.StatusOK, gin.H{
			"trade": newTrade,
		})
	})
}
