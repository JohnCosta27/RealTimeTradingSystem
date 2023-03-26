package rabbitmq

import (
	ServicesIds "sharedTypes/services"
	"utils"
)

var AuthEventClient *utils.EventStreamClient

func InitRabbit() {
  AuthEventClient = utils.CreateEventClient(ServicesIds.AUTH, 
    func(msg []byte) []byte { return []byte("") /* Do nothing */},
    func(msg []byte) { /* Do nothing */})
}
