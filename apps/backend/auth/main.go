package main

import (
	"auth/database"
	"auth/middleware"
	"auth/rabbitmq"
	"auth/routes"
	"fmt"
	"sync"

	"github.com/gin-gonic/gin"
)

func main() {
  var wg sync.WaitGroup
  wg.Add(1)

  rabbitmq.InitRabbit()
  database.InitDatabase()


	msgs, err := rabbitmq.GlobalChannel.Consume(
		"TestQueue",
		"",
		false, //Auto-Ack
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		panic(err)
	}

  go func() {
    for d := range msgs {
      fmt.Println(d.CorrelationId)
      to := d.CorrelationId[len(d.CorrelationId) - 4:]
      // Not meant for the Brain service
      if (to != "0003") {
        d.Ack(false)
        continue 
      }
      d.Ack(true)
    }
  }()

  Router := gin.Default()
  Router.Use(middleware.AllowCors())
  Router.Use(middleware.SetJson())
  routes.RegisterRoute(Router)
  routes.LoginRoute(Router)
  routes.RefreshRoute(Router)

	go Router.Run("0.0.0.0:4546")

  wg.Wait()
}
