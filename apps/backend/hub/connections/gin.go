package connections

import (
	"fmt"
	"net/http"

	"hub/connections/routes"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	amqp "github.com/rabbitmq/amqp091-go"
)

var Router *gin.Engine
var WsConnections []*websocket.Conn

var upgrader = websocket.Upgrader{
	// CORS, for now just allow all origins
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func InitGin() {
	Router = gin.Default()
	WsConnections = make([]*websocket.Conn, 0)

  conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
  if err != nil {
    fmt.Println(err)
    panic(err)
  }
  defer conn.Close()

  fmt.Println("Successfully connected to RabbitMQ using AMQP")

  ch, err := conn.Channel()
  if err != nil {
    fmt.Println(err)
    panic(err)
  }
  defer ch.Close()

  q, err := ch.QueueDeclare(
    "TestQueue",
    false,
    false,
    false,
    false,
    nil,
  )
  if err != nil {
    fmt.Println(err)
    panic(err)
  }
  fmt.Println(q)

  err = ch.Publish("", "TestQueue", false, false, 
    amqp.Publishing{ContentType: "text/plain", Body: []byte("Hello World")})
  if err != nil {
    fmt.Println(err)
    panic(err)
  }

	// Inititalize the routes in the application
	routes.HealthRoute(Router)
  
	Router.GET("/ws", func(c *gin.Context) {
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Websocket unable to connect",
			})
			return
		}
		defer ws.Close()

		WsConnections = append(WsConnections, ws)
		for {
			//Read Message from client
			mt, message, err := ws.ReadMessage()
			if err != nil {
				fmt.Println(err)
				break
			}
			//If client message is ping will return pong
			if string(message) == "ping" {
				message = []byte("pong")
			} else if string(message) == "rabbit" {
        // Performing rabbitmq test
        
      }


			//Response message to client
			err = ws.WriteMessage(mt, message)
			if err != nil {
				fmt.Println(err)
				break
			}
		}
	})

	// Run router and websockets in seperate threads
	go Router.Run("0.0.0.0:4545")
}
