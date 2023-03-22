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
	InitGin()

	wg.Wait()
	rabbitmq.CloseRabbit()
}
