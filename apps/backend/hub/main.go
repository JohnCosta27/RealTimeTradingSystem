package main

import (
	"hub/rabbitmq"

	"sync"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(1)

  InitRedisCache()
	rabbitmq.InitRabbit()
	InitGin()

	wg.Wait()
}
