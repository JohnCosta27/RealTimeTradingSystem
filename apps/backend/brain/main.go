package main

import (
	"brain/database"
	"brain/model"
	"brain/rabbitmq"
	"bytes"
	"encoding/gob"
	"log"
	sharedtypes "sharedTypes"
	"strconv"
	"sync"

	"github.com/google/uuid"
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

			switch req.Url {
			case "get-assets":
				assets := model.GetAllAssets()
				enc.Encode(&assets)
			case "get-user-assets":
				assets := model.GetUserAssets(req.Access)
				enc.Encode(&assets)
			case "create-trade":
				var transaction sharedtypes.Transaction
				price, errPrice := strconv.ParseFloat(req.Body["Price"], 64)
				amount, errAmount := strconv.ParseFloat(req.Body["Amount"], 64)
				if errPrice == nil && errAmount == nil {
					transaction, err = model.StartTradeAsset(req.Body["Type"], price, amount, req.Access, uuid.MustParse(req.Body["AssetId"]))
					log.Println(err)
				}
				enc.Encode(&transaction)
			case "complete-trade":
				transaction, err := model.CompleteTradeAsset(uuid.MustParse(req.Body["TransactionId"]), req.Access)
				if err != nil {
					log.Println(err)
				}

				enc.Encode(&transaction)
      case "get-trades":
        transactions := model.GetAllTransactions()
        enc.Encode(&transactions)
			}

			rabbitmq.GlobalChannel.Publish("", "CallbackQueue", false, false,
				amqp091.Publishing{ContentType: "text/plain", Body: buf.Bytes(), CorrelationId: d.CorrelationId})
		}
	}()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
