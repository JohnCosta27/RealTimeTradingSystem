package rabbitmq

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection
var GlobalChannel *amqp.Channel

func InitRabbit() {
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
}

func CloseRabbit() {
  err := GlobalChannel.Close()
  if err != nil {
    log.Println(err)
  }

  err = conn.Close()
  if err != nil {
    log.Println(err)
  }
}
