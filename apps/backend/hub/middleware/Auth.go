package middleware

import (
	"net/http"
	"utils"

	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
  return func (c *gin.Context) {
    accessToken := c.GetHeader("access")
    claims, err := utils.DecodeJwt(accessToken, "access")

    if err != nil {
      c.JSON(http.StatusUnauthorized, gin.H{
        "error": "unauthorized",
      })
      c.Abort()
      return
    }

    c.Set("claims", claims)
  }
}
