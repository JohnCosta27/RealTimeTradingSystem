package utils

import (
	"fmt"
	"io"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggerMiddleware(writer io.Writer) gin.HandlerFunc {
  return func (c *gin.Context) {
    timeBefore := time.Now()

    c.Next()

    timeTaken := time.Now().Sub(timeBefore)
    io.WriteString(writer, fmt.Sprintf("%s - %d\n", c.Request.URL.Path, timeTaken.Nanoseconds()))
  }
}
