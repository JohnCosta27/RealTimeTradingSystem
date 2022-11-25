package main

import (
	"hub/rabbitmq"
	"sync"

	"hub/connections"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(1)

	localCh, err := conn.Channel()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println("Successfully created a RabbitMQ channel")
  GlobalChannel = localCh

	_, err = GlobalChannel.QueueDeclare(
		"TestQueue",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

  InitGin()

  wg.Wait()
}
