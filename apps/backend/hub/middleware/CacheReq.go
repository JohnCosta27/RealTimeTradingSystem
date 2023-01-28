package middleware

import (
	"encoding/json"
	"fmt"
	"hub/cache"
	"log"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

func CacheReq[T sharedtypes.ReturnTypes](isUserIdNeeded bool, key string, returnStruct T, getBody func(data T) any) gin.HandlerFunc {
	return func(c *gin.Context) {
    keyUrl := key
		if isUserIdNeeded {
      keyUrl += "/userId=" + c.GetHeader(USER_ID_HEADER)
		}

		val, exists := cache.Get(keyUrl)
		if exists {
			err := json.Unmarshal([]byte(val), &returnStruct)
			// If there is an error, we just processed with the request as normal
			// Otherwise serve the cached value
			if err == nil {
				fmt.Println("------------------------------------")
        fmt.Println("SERVING CACHE: ", keyUrl)
				fmt.Println("------------------------------------")
				c.JSON(http.StatusOK, getBody(returnStruct))
				c.Abort()
				return
			}
		}

		// Allows the request to processed, and when it's finished
		// We come back here, pull the return value from context,
		// and then store it in our cache.
		c.Next()

		retValue, exists := c.Get(cache.CACHE)
		if exists {
      log.Println("Setting cache: ", keyUrl)
			cache.Set(keyUrl, retValue.(string))
		}

	}
}
