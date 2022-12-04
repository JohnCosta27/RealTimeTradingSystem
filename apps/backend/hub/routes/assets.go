package routes

import (
	"encoding/json"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

// Get all assets route
func GetAssets(r *gin.Engine) {
  r.GET(ASSET_ROUTE, func(c *gin.Context) {
    req := sharedtypes.BrainReq{
      Url: "get-assets",
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

    c.JSON(http.StatusOK, gin.H{
      "assets": assets,
    }) 
  })
}
