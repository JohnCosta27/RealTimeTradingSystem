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
    writer.Write([]byte(fmt.Sprintf("%s - %d", c.Request.URL.Path, timeTaken.Milliseconds())))
  }
}
