package utils

import (
	"encoding/json"
	"log"
	sharedtypes "sharedTypes"

	"github.com/google/uuid"
	"github.com/rabbitmq/amqp091-go"
	amqp "github.com/rabbitmq/amqp091-go"
)

var Conn *amqp.Connection
var Channel *amqp.Channel
var Queue amqp.Queue

var StreamMessages map[string][]byte
var NewMessages chan bool

/*
 * Client for my event stream.
 * Send events to the stream to be handled elsewhere.
 * Listen to in-coming events.
 */
type EventStreamClient struct {
	Id string
}

type ByteFunc func(msg []byte) []byte
type ByteFuncNoRet func(msg []byte)

func CreateEventClient(id string, listen ByteFunc, action ByteFuncNoRet) *EventStreamClient {
  // TODO: Make this logic come from some variables above
	localConn, err := amqp.Dial("amqp://guest:guest@rabbitmq:5672/")
	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println("Successfully connected to RabbitMQ using AMQP")
	Conn = localConn

	localCh, err := Conn.Channel()
	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println("Successfully created a RabbitMQ channel")
	Channel = localCh

	// Creates a special queue for this service
	localQueue, err := Channel.QueueDeclare(
		id,
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
	Queue = localQueue

	// Listen to incoming messages
	InboundMessages, err := Channel.Consume(
		id,
		"",
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

	StreamMessages = make(map[string][]byte)
	NewMessages = make(chan bool)

  client := &EventStreamClient{
    Id: id,
  }

	// Listen to incoming messages on a loop in a seperate thread.
	// This will stop when the main function exists.
	// Send a notification through the `NewMessages` channel so we can
	// Deal with this new message
	go func() {
		for message := range InboundMessages {
			// Message is a response from an RPC call
			if message.Type == sharedtypes.RESPONSE {
				message.Ack(true)
				StreamMessages[message.CorrelationId] = message.Body
				NewMessages <- true
				continue
			}

			// Message is RPC waiting for response
			if message.Type == sharedtypes.REQUEST {
				message.Ack(true)
				response := listen(message.Body)
				to := message.CorrelationId[0:4]
				Channel.Publish("", to, false, false,
					amqp091.Publishing{ContentType: "text/plain", Type: sharedtypes.RESPONSE, Body: response, CorrelationId: message.CorrelationId})
				continue
			}

      // Info does not need to be responded to, but we call a callback function
      // And let the service handle it
      if message.Type == sharedtypes.INFO {
        message.Ack(true)
        action(message.Body)
        continue
      }

		}
	}()

	return client
}

func (client *EventStreamClient) Send(msg sharedtypes.BrainReq) []byte {
	msg.From = client.Id
	messageId := client.Id + uuid.New().String() + msg.To

	data, _ := json.Marshal(msg)

	Channel.Publish("", msg.To, false, false,
		amqp.Publishing{ContentType: "text/plain", Type: sharedtypes.REQUEST, Body: data, CorrelationId: messageId})

	// Iteration goes on until channel is closed (should be never),
	// only returns when we find the correct message
	for range NewMessages {
		for id, msg := range StreamMessages {
			if id == messageId {
				// Free up the memory, not needed anymore
				delete(StreamMessages, id)
				return msg
			}
		}
	}
	return []byte("")
}

func (client *EventStreamClient) SendNoRes(msg sharedtypes.BrainReq) {
  msg.From = client.Id
	messageId := client.Id + uuid.New().String() + msg.To
  data, _ := json.Marshal(msg)

	Channel.Publish("", msg.To, false, false,
		amqp.Publishing{ContentType: "text/plain", Type: sharedtypes.INFO, Body: data, CorrelationId: messageId})
}

func Close() {
	err := Channel.Close()
	if err != nil {
		log.Println(err)
	}

	err = Conn.Close()
	if err != nil {
		log.Println(err)
	}
}
