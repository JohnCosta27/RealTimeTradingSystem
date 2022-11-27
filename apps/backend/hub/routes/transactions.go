package routes

import (
	"fmt"
	"hub/middleware"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

func PostTrade(r *gin.Engine) {
	r.POST(TRADE_ROUTE, middleware.ParsePostMiddleware(sharedtypes.GetTransactionBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		body := b.(*sharedtypes.CreateTransaction)
    fmt.Println(body)
    

		c.JSON(http.StatusOK, gin.H{
			"hello": "world",
		})
	})
}
