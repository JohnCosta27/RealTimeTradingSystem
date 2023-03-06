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

    timeTaken := timeBefore.Sub(time.Now())
    io.WriteString(writer, fmt.Sprintf("%s - %d\n", c.Request.URL.Path, timeTaken.Milliseconds()))
  }
}
