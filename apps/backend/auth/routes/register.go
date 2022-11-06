package routes

import (
	"auth/middleware"
	"auth/structs"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
 * Register Route handles registering users in the entire application.
 * Type: POST
 * Route: /register
 * Body: GetRegisterBody functions returns a struct of the required information
 */
func RegisterRoute(r *gin.Engine) {
	r.POST(REGISTER, middleware.ParsePostMiddleware(structs.GetRegisterBody), func(c *gin.Context) {
		fmt.Println(c.Get("body"))
		c.JSON(http.StatusOK, gin.H{
			"hello": "world",
		})
	})
}
