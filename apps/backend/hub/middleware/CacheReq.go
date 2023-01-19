package middleware

import (
	"fmt"
	"hub/cache"

	"github.com/gin-gonic/gin"
)

func CacheReq(isUserIdNeeded bool) gin.HandlerFunc {
  return func (c *gin.Context) {
    keyUrl := c.Request.URL.Path
    if (isUserIdNeeded) {
      keyUrl += "/userId=" + c.GetHeader(USER_ID_HEADER)
    }

    fmt.Println(cache.Get(keyUrl))
  }
}
