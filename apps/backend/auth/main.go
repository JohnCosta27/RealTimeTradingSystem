package main

import (
	"auth/database"
	"auth/middleware"
	"auth/routes"
	"sync"

	"github.com/gin-gonic/gin"
)

func main() {
  var wg sync.WaitGroup
  wg.Add(1)

  database.InitDatabase()

  Router := gin.Default()
  Router.Use(middleware.AllowCors())
  routes.RegisterRoute(Router)
  routes.LoginRoute(Router)
  routes.RefreshRoute(Router)

	go Router.Run("0.0.0.0:4546")

  wg.Wait()
}
