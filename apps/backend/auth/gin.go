package main

import (
	"auth/middleware"
	"auth/routes"
	"fmt"
	"os"
	"time"
	"utils"

	"github.com/gin-gonic/gin"
)

/**
  * Initializes an instance of the gin router and returns its pointer.
  * This instance has all the routes and also the logging middleware
  * Its running is not concerned here, its the job of the caller
  */
func InitGin() *gin.Engine {
  myFile, _ := os.Create(fmt.Sprintf("./logs/%s.auth.txt", time.Now().String()))

  Router := gin.Default()

  Router.Use(utils.LoggerMiddleware(myFile))
	Router.Use(middleware.AllowCors())
	Router.Use(middleware.SetJson())
	routes.RegisterRoute(Router)
	routes.LoginRoute(Router)
	routes.RefreshRoute(Router)

  return Router
}
