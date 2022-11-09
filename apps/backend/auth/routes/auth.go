package routes

import (
	"auth/database"
	"auth/middleware"
	"auth/structs"
	"auth/util"
	"crypto/sha512"
	"encoding/hex"
	"log"
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
			Email:         registerBody.Email,
			Firstname:     registerBody.Firstname,
			Surname:       registerBody.Surname,
			Password:      hashedPassword,
			Password_salt: salt,
		}
		database.Db.Create(user)

		refresh, rErr := util.GenRefreshToken()
		access, aErr := util.GenAccessToken()
		if rErr != nil || aErr != nil {
			log.Println(rErr, aErr)
			c.JSON(http.StatusOK, gin.H{
				"error": "server error",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "registered successfully",
			"access":  access,
			"refresh": refresh,
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

		if db.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "this account doesn't exist",
			})
			return
		}

		hashBytes := sha512.Sum512([]byte(loginBody.Password + user.Password_salt))
		hashedPassword := hex.EncodeToString(hashBytes[:])

		if user.Password != hashedPassword {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "wrong password",
			})
			return
		}

		refresh, rErr := util.GenRefreshToken()
		access, aErr := util.GenAccessToken()
		if rErr != nil || aErr != nil {
			log.Println(rErr, aErr)
			c.JSON(http.StatusOK, gin.H{
				"error": "server error",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": "good egg",
			"access":  access,
			"refresh": refresh,
		})
	})
}

/*
 * Refresh route is used to refresh a JWT
 * Type: POST
 * Route: /refresh
 * Body: GetRefreshBody functions returns a struct of the required information
 */
func RefreshRoute(r *gin.Engine) {
	r.POST(REFRESH, middleware.ParsePostMiddleware(structs.GetRefreshBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		refreshBody := b.(*structs.RefreshBody)

		if util.IsValidJwt(refreshBody.Refresh, "refresh") {
			access, aErr := util.GenAccessToken()
			if aErr != nil {
				log.Println(aErr)
				c.JSON(http.StatusOK, gin.H{
					"error": "server error",
				})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"access": access,
			})
			return
		}
	})
}
