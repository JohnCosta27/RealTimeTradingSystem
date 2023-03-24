package routes

import (
	"auth/database"
	"auth/rabbitmq"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
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

		userBase := database.Base{
			ID: id,
		}

		user := database.User{
			Base:          userBase,
			Email:         registerBody.Email,
			Firstname:     registerBody.Firstname,
			Surname:       registerBody.Surname,
			Password:      hashedPassword,
			Password_salt: salt,
		}

    paramMap := make(map[string]string)
    paramMap["uuid"] = id.String()

    brainReq := sharedtypes.BrainReq{
      Url: sharedtypes.SYNC_REGISTER,
      Params: paramMap,
      To: ServiceIds.BRAIN,
    }

    // To create a user we must sync the IDs across databases,
    // to facilitate lookups, throughout the system without the need
    // of constant communication across system.
		res := database.Db.Create(&user)

    brainResponse := rabbitmq.AuthEventClient.Send(brainReq)

    var isUserCreated bool
    err := json.Unmarshal(brainResponse, &isUserCreated)

    if err != nil || !isUserCreated {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"Error": "There has been a server error creating user",
			})

      // The user was created on the auth database.
      // But not on the brain, therefore we need to rollback
      if res.Error == nil {
        // TODO: Implement the user creation as a transaction
        // database.Db.Rollback()
      }

			return
    }

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
