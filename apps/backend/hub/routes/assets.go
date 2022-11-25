package routes

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
)

// Get all assets route
func GetAssets(r *gin.Engine) {
  r.GET(ASSET_ROUTE, func(c *gin.Context) {
    msg := rabbitmq.SendRPC("hello World!!!")
    
    buf := bytes.NewBuffer(msg)
    dec := gob.NewDecoder(buf)

    var assets []sharedtypes.Asset

    dec.Decode(&assets)

    fmt.Println(assets)

    c.JSON(http.StatusOK, gin.H{
      "assets": "World",
    }) 
  })
}
