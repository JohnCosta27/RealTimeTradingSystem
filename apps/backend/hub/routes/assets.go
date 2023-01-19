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
				Url: "get-assets",
			}

			msg := rabbitmq.SendRPC(req)
			cache.Set(c.Request.URL.Path, string(msg))

			assets := []sharedtypes.Asset{}
			err := json.Unmarshal(msg, &assets)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "This service has encountered an issue",
				})
				return
			}

			c.JSON(http.StatusOK, GetAssetBody(assets))
		})
}
