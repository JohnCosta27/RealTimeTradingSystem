package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AllowCors() gin.HandlerFunc {
  return func (c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
      c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
  }
}
