package middleware

import (
	"log"
	"net/http"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const USER_ID_HEADER = "userId"

/** Middleware to check the authentication of the user.
 * If the user is not authenticated, their request will be returned,
 * with an unauthorized message, and will not processed.
 *
 * If the JWT is safe, then the request will processed as normal.
 */
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {

		// Fetches the access token from the header of the request
		accessToken := c.GetHeader("access")

		// Calls the util function to decode the token
		claims, err := utils.DecodeJwt(accessToken, "access")

		// Reject the request, it is unauthorized.
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "unauthorized",
			})
			c.Abort()
			return
		}

		// Parse the UUID stored in the JWT, if it isn't valid,
		// Return an unauthorized error.
		userId, err := uuid.Parse(claims.Uuid)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "unauthorized",
			})
			c.Abort()
			return
		}

		// Set claims to the context of the request, so following handlers
		// can access this common information.
		c.Set("claims", claims)
		c.Set(USER_ID_HEADER, userId)
	}
}
