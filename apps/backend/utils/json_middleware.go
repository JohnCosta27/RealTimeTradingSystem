package utils

import "github.com/gin-gonic/gin"

func SetJson() gin.HandlerFunc {
  return func (c *gin.Context) {
    c.Header("Content-Type", "application/json")
		c.Next()
  }
}
