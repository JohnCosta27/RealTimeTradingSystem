package middleware

import (
	"log"
	"net/http"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const USER_ID_HEADER = "userId"

func Auth() gin.HandlerFunc {
  return func (c *gin.Context) {
    accessToken := c.GetHeader("access")
    claims, err := utils.DecodeJwt(accessToken, "access")

    if err != nil {
      log.Println(err)
      c.JSON(http.StatusUnauthorized, gin.H{
        "error": "unauthorized",
      })
      c.Abort()
      return
    }

    userId, err := uuid.Parse(claims.Uuid)
    if err != nil {
      log.Println(err)
      c.JSON(http.StatusUnauthorized, gin.H{
        "error": "unauthorized",
      })
      c.Abort()
      return
    }

    c.Set("claims", claims)
    c.Set(USER_ID_HEADER, userId)
  }
}
