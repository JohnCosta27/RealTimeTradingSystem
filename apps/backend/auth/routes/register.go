package routes

import (
	"auth/database"
	"auth/middleware"
	"auth/structs"
	"crypto/sha512"
	"encoding/hex"
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
		b, _ := c.Get("body")
		registerBody := b.(*structs.RegisterBody)

		hashBytes := sha512.Sum512([]byte(registerBody.Password))
    hashedPassword := hex.EncodeToString(hashBytes[:])

		user := &database.User{
      Firstname: registerBody.Firstname,
      Surname: registerBody.Surname,
      Password: hashedPassword,
      Password_salt: "123123",
    }
    database.Db.Create(user)

		c.JSON(http.StatusOK, gin.H{
			"hello": "world",
		})
	})
}
