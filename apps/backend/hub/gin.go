package main

import (
	"fmt"
	"hub/routes"
	"net/http"
	"strings"

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

	// Inititalize the routes in the application
	routes.HealthRoute(Router)
  routes.GetAssets(Router)
  routes.TradeRoutes(Router)
  routes.UserRoutes(Router)

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

		wsConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
		if err != nil {
			fmt.Println(err)
			panic(err)
		}
		defer wsConn.Close()

		wsCh, err := wsConn.Channel()
		if err != nil {
			fmt.Println(err)
			panic(err)
		}
		fmt.Println("Opening new channel for new WS connection")

		WsConnections = append(WsConnections, ws)
		for {
			//Read Message from client
			mt, message, err := ws.ReadMessage()
      fmt.Println("New WS connection")

			if err != nil {
				fmt.Println(err)
				break
			}
			fmt.Println(string(message))

			//If client message is ping will return pong
			if string(message) == "ping" {
				message = []byte("pong")
			} else if strings.Contains(string(message), "rabbit") {
				// Performing rabbitmq test
				err = wsCh.Publish("", "TestQueue", false, false,
					amqp.Publishing{ContentType: "text/plain", Body: message})
				message = []byte("sent to rabbitmq!")

				// Close connection here
				if err != nil {
					fmt.Println(err)
					panic(err)
				}

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
