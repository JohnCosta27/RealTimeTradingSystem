package main

import (
	"auth/database"
	"auth/middleware"
	"auth/rabbitmq"
	"auth/routes"
	"fmt"
	"os"
	sharedtypes "sharedTypes"
	"sync"
	"time"
	"utils"

	"github.com/caarlos0/env/v6"
	"github.com/gin-gonic/gin"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	EnvConf := sharedtypes.EnvConf{}
	if err := env.Parse(&EnvConf); err != nil {
		panic("Cannot get environment variables, check your env file")
	}
  
	rabbitmq.InitRabbit()

	database.InitDatabase(&sharedtypes.DbConf{
		Host:     EnvConf.AuthDbHost,
		Port:     EnvConf.AuthDbPort,
		DbName:   EnvConf.AuthDbName,
		User:     EnvConf.AuthDbUser,
		Password: EnvConf.AuthDbPassword,
	}, &sharedtypes.DbConf{
		Host:     EnvConf.BrainDbHost,
		Port:     EnvConf.BrainDbPort,
		DbName:   EnvConf.BrainDbName,
		User:     EnvConf.BrainDbUser,
		Password: EnvConf.BrainDbPassword,
	})

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
			to := d.CorrelationId[len(d.CorrelationId)-4:]
			// Not meant for the Brain service
			if to != "0003" {
				d.Ack(false)
				continue
			}
			d.Ack(true)
		}
	}()

  myFile, _ := os.Create(fmt.Sprintf("./logs/%s.auth.txt", time.Now().String()))

  Router := gin.Default()

  Router.Use(utils.LoggerMiddleware(myFile))
	Router.Use(middleware.AllowCors())
	Router.Use(middleware.SetJson())
	routes.RegisterRoute(Router)
	routes.LoginRoute(Router)
	routes.RefreshRoute(Router)

	go Router.Run("0.0.0.0:4546")

	wg.Wait()
}
