package main

import (
	"brain/database"
	"brain/model"
	"brain/rabbitmq"
	"bytes"
	"encoding/gob"
	"fmt"
	sharedtypes "sharedTypes"
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

	go func() {
		for d := range msgs {
			msgBuffered := bytes.NewBuffer(d.Body)
			dec := gob.NewDecoder(msgBuffered)

			var req sharedtypes.BrainReq
			dec.Decode(&req)

			var buf bytes.Buffer
			enc := gob.NewEncoder(&buf)

			assets := model.GetAllAssets()
			fmt.Println(len(assets))
			enc.Encode(&assets)

			rabbitmq.GlobalChannel.Publish("", "CallbackQueue", false, false,
				amqp091.Publishing{ContentType: "text/plain", Body: buf.Bytes(), CorrelationId: d.CorrelationId})
		}
	}()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
