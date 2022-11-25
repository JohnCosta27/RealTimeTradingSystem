package rabbitmq

import (
	"log"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection
var GlobalChannel *amqp.Channel

// Channel that recieves event when a new message is recieved.
// Useful for making blocking operations.
var newMessage chan bool

// Map from CorrelationId and actual message
var rpcMessages map[string][]byte

func InitRabbit() {
	localConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println("Successfully connected to RabbitMQ using AMQP")
	conn = localConn

	localCh, err := conn.Channel()
	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println("Successfully created a RabbitMQ channel")
	GlobalChannel = localCh

	_, err = GlobalChannel.QueueDeclare(
		"TestQueue",
		false,
		false,
		false,
		false,
		nil,
	)

  GlobalChannel.QueueDeclare(
		"CallbackQueue",
		false,
		false,
		false,
		false,
		nil,
  )

	if err != nil {
		log.Println(err)
		panic(err)
	}

  // Listen to incoming messages
  msgs, err := GlobalChannel.Consume(
    "CallbackQueue",
		"",
		true, //Auto-Ack
		false,
		false,
		false,
		nil,
  )

  rpcMessages = make(map[string][]byte)
  newMessage = make(chan bool)

  go func() {
    for m := range msgs {
      rpcMessages[m.CorrelationId] = m.Body
      newMessage <- true
    }
  }()
  

}

func SendRPC(msg string) []byte {
  messageId := uuid.New().String()

	GlobalChannel.Publish("", "TestQueue", false, false,
		amqp.Publishing{ContentType: "text/plain", Body: []byte(msg), CorrelationId: messageId})

  // Iteration goes on until channel is closed (should be never),
  // only returns when we find the correct message
  for range newMessage {
    for id, msg := range rpcMessages {
      if id == messageId {
        // Free up the memory not needed anymore
        delete(rpcMessages, id)
        return msg
      }
    } 
  }
  return []byte("")
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
