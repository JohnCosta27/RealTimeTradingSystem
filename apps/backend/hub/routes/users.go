package routes

import (
	"encoding/json"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserAssets() gin.HandlerFunc {
	return func(c *gin.Context) {

		// We can ignore the error because we have a check auth middleware.
		userId, _ := c.Get("userId")

		req := sharedtypes.BrainReq{
			Url: "get-user-assets",
			// Safe casting because in the middleware we create a uuid object.
			Access: userId.(uuid.UUID),
		}

		msg := rabbitmq.SendRPC(req)

		assets := []sharedtypes.UserAsset{}
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
	}
}

func GetUser() gin.HandlerFunc {
  return func(c *gin.Context) {
		accessToken := c.GetHeader("access")
		claims, err := utils.DecodeJwt(accessToken, "access")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorised access token",
			})
			return
		}

    bodyReq := sharedtypes.BrainReq{
      Url: "get-user",
      Access: uuid.MustParse(claims.Uuid),
    }

    msg := rabbitmq.SendRPC(bodyReq)

    var user sharedtypes.User
		err = json.Unmarshal(msg, &user)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "This service has encountered an issue",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})

  }
}

func UserRoutes(r *gin.Engine) {
	userGroup := r.Group(USER_ROUTE)
	userGroup.Use(middleware.Auth())
	userGroup.GET(ASSET_ROUTE, GetUserAssets())
  userGroup.GET("/", GetUser())
}
