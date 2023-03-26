package utils

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ParsePostMiddleware[T any](GetStruct func() T) gin.HandlerFunc {
  return func (c *gin.Context) {
    BodyStruct := GetStruct()
    err := c.ShouldBindJSON(BodyStruct)

    if err != nil {
      log.Println(err)

      c.JSON(http.StatusBadRequest, gin.H{
        "error": "Incorrect body",
        "expected": BodyStruct,
      })
      c.Abort()
      return
    }
    c.Set("body", BodyStruct)
  }
}
