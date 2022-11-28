package routes

import (
	"bytes"
	"encoding/gob"
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
    
    buf := bytes.NewBuffer(msg)
    dec := gob.NewDecoder(buf)

    var assets []sharedtypes.Asset

    dec.Decode(&assets)

    c.JSON(http.StatusOK, gin.H{
      "assets": assets,
    }) 
  })
}
