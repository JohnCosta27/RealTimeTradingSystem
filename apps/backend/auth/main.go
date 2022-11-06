package main

import (
	"auth/routes"
	"sync"

	"github.com/gin-gonic/gin"
)

func main() {
  var wg sync.WaitGroup
  wg.Add(1)

  Router := gin.Default()
  routes.RegisterRoute(Router)

	go Router.Run("0.0.0.0:4546")

  wg.Wait()
}
