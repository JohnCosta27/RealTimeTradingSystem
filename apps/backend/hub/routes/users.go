package routes

import (
	"encoding/json"
	"hub/cache"
	"hub/middleware"
	"hub/rabbitmq"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserAssetsBody(data []sharedtypes.UserAsset) any {
	return gin.H{
		"assets": data,
	}
}

func GetUserAssets() gin.HandlerFunc {
	return func(c *gin.Context) {

		// We can ignore the error because we have a check auth middleware.
		userId, _ := c.Get("userId")

		req := sharedtypes.BrainReq{
			Url: sharedtypes.GET_USER_ASSETS,
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

		c.Set(cache.CACHE, string(msg))
		c.JSON(http.StatusOK, GetUserAssetsBody(assets))
	}
}

func GetUserBody(data sharedtypes.User) any {
	return gin.H{
		"user": data,
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
			Url:    sharedtypes.GET_USER,
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

		c.Set(cache.CACHE, string(msg))
		c.JSON(http.StatusOK, GetUserBody(user))
	}
}

func UserRoutes(r *gin.Engine) {
	userGroup := r.Group(USER_ROUTE)
	userGroup.Use(middleware.Auth())
	userGroup.GET(ASSET_ROUTE, middleware.CacheReq(true, []sharedtypes.UserAsset{}, GetUserAssetsBody), GetUserAssets())
	userGroup.GET("/", middleware.CacheReq(true, sharedtypes.User{}, GetUserBody), GetUser())
}
