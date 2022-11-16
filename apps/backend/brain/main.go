package main

import (
	"brain/rabbitmq"
	"fmt"
	"sync"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	rabbitmq.InitRabbit()

	msgs, err := rabbitmq.GlobalChannel.Consume(
		"TestQueue",
		"",
		true, //Auto-Ack
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
			fmt.Println("Waiting to reply...")
      time.Sleep(time.Millisecond *  1000) // TODO: Remove this, here just for testing
			fmt.Printf("Recieved message: %s\n", string(d.Body))
			rabbitmq.GlobalChannel.Publish("", "CallbackQueue", false, false,
				amqp091.Publishing{ContentType: "text/plain", Body: []byte("Hello World"), CorrelationId: d.CorrelationId})
		}
	}()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
