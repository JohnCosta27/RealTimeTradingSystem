package connections

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"johncosta.tech/connections/routes"
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
	Router.GET("/ws", func(c *gin.Context) {
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
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
