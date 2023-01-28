package routes

import (
	"encoding/json"
	"hub/cache"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

func GetAssetBody(data []sharedtypes.Asset) any {
	return gin.H{
		"assets": data,
	}
}

// Get all assets route
func GetAssets(r *gin.Engine) {
	r.GET(ASSET_ROUTE, middleware.CacheReq(false, []sharedtypes.Asset{}, GetAssetBody),
		func(c *gin.Context) {
			req := sharedtypes.BrainReq{
				Url: sharedtypes.GET_ASSETS,
			}

			msg := rabbitmq.SendRPC(req)

			assets := []sharedtypes.Asset{}
			err := json.Unmarshal(msg, &assets)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "This service has encountered an issue",
				})
				return
			}
      c.Set(cache.CACHE, string(msg))
			c.JSON(http.StatusOK, GetAssetBody(assets))
		})
}
