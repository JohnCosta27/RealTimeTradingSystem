package main

import (
	"brain/database"
	"brain/model"
	"encoding/json"
	"log"
	sharedtypes "sharedTypes"
	ServicesIds "sharedTypes/services"
	"strconv"
	"sync"

	"utils"

	"github.com/caarlos0/env/v6"
	"github.com/google/uuid"
)

var EventClient *utils.EventStreamClient

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	actions := make(chan sharedtypes.BrainReq)

	EventClient = utils.CreateEventClient("0002", func(msg []byte) []byte {
		var req sharedtypes.BrainReq
		err := json.Unmarshal(msg, &req)

		var returnValue []byte

		switch req.Url {
		case sharedtypes.GET_USER:
			user := model.GetUser(req.Access)
			returnValue, _ = json.Marshal(&user)

		case sharedtypes.GET_ASSETS:
			assets := model.GetAllAssets()
			returnValue, _ = json.Marshal(&assets)

		case sharedtypes.GET_USER_ASSETS:
			assets := model.GetUserAssets(req.Access)
			returnValue, _ = json.Marshal(&assets)

			// Create trade and complete trades need to let hub know to invalidate certain cache
		case sharedtypes.CREATE_TRADE:
			var transaction sharedtypes.Transaction
			price, errPrice := strconv.ParseFloat(req.Body["Price"], 64)
			amount, errAmount := strconv.ParseFloat(req.Body["Amount"], 64)

			if errPrice == nil && errAmount == nil {
				transaction, err = model.StartTradeAsset(req.Body["Type"], price, amount, req.Access, uuid.MustParse(req.Body["AssetId"]))
				log.Println(err)
			}
			returnValue, _ = json.Marshal(&transaction)
			req := sharedtypes.BrainReq{
				Url:  sharedtypes.GET_TRADES,
				From: ServicesIds.BRAIN,
				To:   ServicesIds.HUB,
				Type: sharedtypes.INFO,
			}
			actions <- req

		case sharedtypes.COMPLETE_TRADE:
			transaction, err := model.CompleteTradeAsset(uuid.MustParse(req.Body["TransactionId"]), req.Access)
			if err != nil {
				log.Println(err)
			}
			returnValue, _ = json.Marshal(&transaction)
			req := sharedtypes.BrainReq{
				Url:  sharedtypes.GET_TRADES,
				From: ServicesIds.BRAIN,
				To:   ServicesIds.HUB,
				Type: sharedtypes.INFO,
			}
			actions <- req
			req.Url = sharedtypes.GET_ASSET_TRADES
			actions <- req

		case sharedtypes.GET_TRADES:
			transactions := model.GetAllTransactions()
			returnValue, _ = json.Marshal(&transactions)

		case sharedtypes.GET_ASSET_TRADES:
			transactions := model.GetAllAssetTrades(req.Body["AssetId"])
			returnValue, _ = json.Marshal(transactions)
		}
		return returnValue
	}, func(msg []byte) {
		// No need
	})

	go func() {
		for a := range actions {
			EventClient.SendNoRes(a)
		}
	}()

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

	wg.Wait()
	utils.Close()
}
