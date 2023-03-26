package middleware

import (
	"encoding/json"
	"fmt"
	"hub/cache"
	"log"
	"net/http"
	"os"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

// Environment variable to disable caching mechanism.
// Used for testing
var isCachingDisabled = os.Getenv("IS_CACHE_DISABLED")

/** CacheReq is a middleware that takes some configuration and allows a requests response to be cached.
 * @param isUserIdNeeded -> Does the cache depend on the user that is making the request?
 * @param isParamsNeeded -> Do the HTTP parameters matter for aching?
 * @param key -> The key that will be used to set and retrieve the data from the Redis DB.
 * @param returnStrct -> The shape of the data to return to the user IF cache is available
 *                       This is a generic type that can be any of the requests response.
 * @param getBody -> Callback function to get the an empty struct for the body of the data.
 */
func CacheReq[T sharedtypes.ReturnTypes](isUserIdNeeded bool, isParamsNeeed bool, key string, returnStruct T, getBody func(data T) any) gin.HandlerFunc {
	return func(c *gin.Context) {

		// Disable Caching.
		if len(isCachingDisabled) > 0 {
			c.Next()
			return
		}

		// Both statements build a key in case userID or params are needed.
		keyUrl := key
		if isUserIdNeeded {
			keyUrl += "/userId=" + c.GetHeader(USER_ID_HEADER)
		}

		if isParamsNeeed {
			paramPairs := c.Request.URL.Query()
			for key, value := range paramPairs {
				for _, v := range value {
					keyUrl += "/" + key + "-" + v
				}
			}
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

		// Takes CACHE from the context and sets it on the Redis DB.
		// Meaning the request doesnt need to handle this part,
		retValue, exists := c.Get(cache.CACHE)
		if exists {
			log.Println("Setting cache: ", keyUrl)
			cache.Set(keyUrl, retValue.(string))
		}

	}
}
