package middleware

import (
	"encoding/json"
	"fmt"
	"hub/cache"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

func CacheReq[T sharedtypes.ReturnTypes](isUserIdNeeded bool, returnStruct T, getBody func(data T) any) gin.HandlerFunc {
  return func (c *gin.Context) {
    keyUrl := c.Request.URL.Path
    if (isUserIdNeeded) {
      keyUrl += "/userId=" + c.GetHeader(USER_ID_HEADER)
    }

    val, exists := cache.Get(keyUrl)
    if (exists) {
      err := json.Unmarshal([]byte(val), &returnStruct)
      // If there is an error, we just processed with the request as normal
      // Otherwise serve the cached value
      if err == nil {
        fmt.Println("------------------------------------")
        fmt.Println("SERVING CACHE")
        fmt.Println("------------------------------------")
        c.JSON(http.StatusOK, getBody(returnStruct))
        c.Abort()
        return
      }
    }
  } 
}
