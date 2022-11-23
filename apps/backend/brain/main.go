package main

import (
	"brain/database"
	"brain/model"
	"brain/rabbitmq"
	"bytes"
	"encoding/gob"
	"fmt"
	"sync"

	"github.com/rabbitmq/amqp091-go"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	rabbitmq.InitRabbit()

  database.InitDatabase()

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

  var buf bytes.Buffer
  enc := gob.NewEncoder(&buf)

	go func() {
		for d := range msgs {
			fmt.Printf("Recieved message: %s\n", string(d.Body))

      assets := model.GetAllAssets()
      enc.Encode(&assets)

			rabbitmq.GlobalChannel.Publish("", "CallbackQueue", false, false,
				amqp091.Publishing{ContentType: "text/plain", Body: buf.Bytes(), CorrelationId: d.CorrelationId})
		}
	}()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
