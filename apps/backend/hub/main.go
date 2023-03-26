package main

import (
	"hub/cache"
	"hub/rabbitmq"

	"sync"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(1)

	cache.InitRedisCache()
	rabbitmq.InitRabbit()

	Router := InitGin()
	go Router.Run("0.0.0.0:4545")

	wg.Wait()
	rabbitmq.CloseRabbit()
}
