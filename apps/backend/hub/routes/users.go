package routes

import (
	"bytes"
	"encoding/gob"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserAssets() gin.HandlerFunc {
  return func (c *gin.Context) {

    // We can ignore the error because we have a check auth middleware.
    userId, _ := c.Get("userId")

    req := sharedtypes.BrainReq{
      Url: "get-user-assets",
      // Safe casting because in the middleware we create a uuid object.
      Access: userId.(uuid.UUID),
    }

    msg := rabbitmq.SendRPC(req)
    
    buf := bytes.NewBuffer(msg)
    dec := gob.NewDecoder(buf)

    assets := []sharedtypes.UserAsset{}
    dec.Decode(&assets)

    c.JSON(http.StatusOK, gin.H{
      "assets": assets,
    }) 
  }
}

func UserRoutes(r *gin.Engine) {
  userGroup := r.Group(USER_ROUTE)
  userGroup.Use(middleware.Auth())
  userGroup.GET(ASSET_ROUTE, GetUserAssets())
}
