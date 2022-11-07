package routes

import (
	"auth/database"
	"auth/middleware"
	"auth/structs"
	"auth/util"
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

    salt := util.GenSalt()
		hashBytes := sha512.Sum512([]byte(registerBody.Password + salt))
    hashedPassword := hex.EncodeToString(hashBytes[:])

		user := &database.User{
      Email: registerBody.Email,
      Firstname: registerBody.Firstname,
      Surname: registerBody.Surname,
      Password: hashedPassword,
      Password_salt: salt,
    }
    database.Db.Create(user)

		c.JSON(http.StatusOK, gin.H{
			"status": "registered successfully",
		})
	})
}

/*
 * Login Route handles checking passwords and login users
 * Type: POST
 * Route: /login
 * Body: GetLoginBody functions returns a struct of the required information
 */
func LoginRoute(r *gin.Engine) {
	r.POST(LOGIN, middleware.ParsePostMiddleware(structs.GetLoginBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		loginBody := b.(*structs.LoginBody)

    user := &database.User{}
    db := database.Db.Where("email = ?", loginBody.Email).Find(user)

    if (db.RowsAffected == 0) {
      c.JSON(http.StatusBadRequest, gin.H{
        "error": "this account doesn't exist",
      })
      return
    } 

		hashBytes := sha512.Sum512([]byte(loginBody.Password + user.Password_salt))
    hashedPassword := hex.EncodeToString(hashBytes[:])

    if (user.Password != hashedPassword) {
      c.JSON(http.StatusBadRequest, gin.H{
        "error": "wrong password",
      })
      return
    }

		c.JSON(http.StatusOK, gin.H{
			"success": "good egg",
		})
	})
}
