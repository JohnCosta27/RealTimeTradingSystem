package rabbitmq

import (
	"encoding/json"
	"hub/cache"
	sharedtypes "sharedTypes"
	"utils"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection
var GlobalChannel *amqp.Channel

// Channel that recieves event when a new message is recieved.
// Useful for making blocking operations.
var newMessage chan bool

// Map from CorrelationId and actual message
var rpcMessages map[string][]byte

var RabbitClient *utils.EventStreamClient

func InitRabbit() {
	RabbitClient = utils.CreateEventClient("0001", func(msg []byte) []byte {
		return []byte("")
	},
		func(msg []byte) {
			var info sharedtypes.BrainReq
			json.Unmarshal(msg, &info)
			cache.Invalidate(info.Url)
		})
}

func SendRPC(msg sharedtypes.BrainReq) []byte {
	msg.To = "0002"
	return RabbitClient.Send(msg)
}

func CloseRabbit() {
	utils.Close()
}
