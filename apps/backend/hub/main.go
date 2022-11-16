package main

import (
	"fmt"
	"sync"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection
var GlobalChannel *amqp.Channel

func main() {
  var wg sync.WaitGroup

  wg.Add(1)
  
	localConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println("Successfully connected to RabbitMQ using AMQP")
  conn = localConn

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
