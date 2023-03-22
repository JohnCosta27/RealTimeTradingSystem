package routes

import (
	"auth/database"
	"crypto/sha512"
	"encoding/hex"
	"log"
	"net/http"
	sharedtypes "sharedTypes"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
 * Register Route handles registering users in the entire application.
 * Type: POST
 * Route: /register
 * Body: GetRegisterBody functions returns a struct of the required information
 */
func RegisterRoute(r *gin.Engine) {
	r.POST(REGISTER, utils.ParsePostMiddleware(sharedtypes.GetRegisterBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		registerBody := b.(*sharedtypes.RegisterBody)

		salt := utils.GenSalt()
		hashBytes := sha512.Sum512([]byte(registerBody.Password + salt))
		hashedPassword := hex.EncodeToString(hashBytes[:])

    id := uuid.New()

    userBase := database.Base {
      ID: id,
    }

		user := database.User{
      Base: userBase,
			Email:         registerBody.Email,
			Firstname:     registerBody.Firstname,
			Surname:       registerBody.Surname,
			Password:      hashedPassword,
			Password_salt: salt,
		}
    res := database.Db.Create(&user)

    // TODO: Make this transaction safe. Across databases...
    database.BrainDb.Exec("INSERT INTO users (id, balance) VALUES (?, 0)", id.String())

    if res.Error != nil {
      log.Println(res.Error)
      c.JSON(http.StatusBadRequest, gin.H{
        "Error": "Duplicate email found",
      })
      return
    } 

		refresh, rErr := utils.GenRefreshToken(user.ID.String())
		access, aErr := utils.GenAccessToken(user.ID.String())
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
	r.POST(LOGIN, utils.ParsePostMiddleware(sharedtypes.GetLoginBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		loginBody := b.(*sharedtypes.LoginBody)

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

		refresh, rErr := utils.GenRefreshToken(user.ID.String())
		access, aErr := utils.GenAccessToken(user.ID.String())
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
	r.POST(REFRESH, utils.ParsePostMiddleware(sharedtypes.GetRefreshBody), func(c *gin.Context) {
		b, _ := c.Get("body")
		refreshBody := b.(*sharedtypes.RefreshBody)

		claims, err := utils.DecodeJwt(refreshBody.Refresh, "refresh")
		if err != nil || claims.Type != "refresh" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Bad refresh token given",
			})
			return
		}

		access, aErr := utils.GenAccessToken(claims.Uuid)
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
	})
}
