package main

import (
	"brain/database"
	"brain/model"
	"brain/rabbitmq"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	sharedtypes "sharedTypes"
	"strconv"
	"sync"

	"github.com/caarlos0/env/v6"
	"github.com/google/uuid"
	"github.com/rabbitmq/amqp091-go"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	rabbitmq.InitRabbit()

	EnvConf := sharedtypes.EnvConf{}
	if err := env.Parse(&EnvConf); err != nil {
		panic("Cannot get environment variables, check your .env file")
	}

	database.InitDatabase(&sharedtypes.DbConf{
		Host:     EnvConf.BrainDbHost,
		Port:     EnvConf.BrainDbPort,
		DbName:   EnvConf.BrainDbName,
		User:     EnvConf.BrainDbUser,
		Password: EnvConf.BrainDbPassword,
	})

	msgs, err := rabbitmq.GlobalChannel.Consume(
		"TestQueue",
		"",
		false, //Auto-Ack
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

			fmt.Println(d.CorrelationId)
			to := d.CorrelationId[len(d.CorrelationId)-4:]
			// Not meant for the Brain service
			if to != "0002" {
				d.Ack(false)
				continue
			}

			d.Ack(true)

			var req sharedtypes.BrainReq
			err := json.Unmarshal(d.Body, &req)

			var returnValue []byte

			switch req.Url {
			case "get-user":
				user := model.GetUser(req.Access)
				returnValue, _ = json.Marshal(&user)

			case "get-assets":
				assets := model.GetAllAssets()
				returnValue, _ = json.Marshal(&assets)

			case "get-user-assets":
				assets := model.GetUserAssets(req.Access)
				returnValue, _ = json.Marshal(&assets)

			case "create-trade":
				var transaction sharedtypes.Transaction
				price, errPrice := strconv.ParseFloat(req.Body["Price"], 64)
				amount, errAmount := strconv.ParseFloat(req.Body["Amount"], 64)
				if errPrice == nil && errAmount == nil {
					transaction, err = model.StartTradeAsset(req.Body["Type"], price, amount, req.Access, uuid.MustParse(req.Body["AssetId"]))
					log.Println(err)
				}
				returnValue, _ = json.Marshal(&transaction)

			case "complete-trade":
				transaction, err := model.CompleteTradeAsset(uuid.MustParse(req.Body["TransactionId"]), req.Access)
				if err != nil {
					log.Println(err)
				}
				returnValue, _ = json.Marshal(&transaction)

			case "get-trades":
				transactions := model.GetAllTransactions()
				returnValue, _ = json.Marshal(&transactions)

			case "get-asset-trades":
				transactions, err := model.GetAllAssetTrades(req.Body["AssetId"])
				if err != nil {
					returnValue, _ = json.Marshal(&sharedtypes.BrainRes{
						ErrorCode: http.StatusNotFound,
					})
				} else {
					returnValue, _ = json.Marshal(&sharedtypes.BrainRes{
						Response: transactions,
					})
				}
			}

			rabbitmq.GlobalChannel.Publish("", "CallbackQueue", false, false,
				amqp091.Publishing{ContentType: "text/plain", Body: returnValue, CorrelationId: d.CorrelationId})
		}
	}()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
