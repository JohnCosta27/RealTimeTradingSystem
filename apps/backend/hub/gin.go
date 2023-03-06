package main

import (
	"fmt"
	"hub/middleware"
	"hub/routes"
	"io"
	"net/http"
	"os"
	"time"
	"utils"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var Router *gin.Engine

type WsHub map[*websocket.Conn]bool
var WsConnections WsHub

var upgrader = websocket.Upgrader{
	// CORS, for now just allow all origins
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func InitGin() {
  myFile, _ := os.Create(fmt.Sprintf("./logs/%s.hub.txt", time.Now().String()))

	Router = gin.Default()
	WsConnections = make(WsHub)

  Router.Use(utils.LoggerMiddleware(myFile))
  Router.Use(middleware.AllowCors())

	// Inititalize the routes in the application
	routes.HealthRoute(Router)
  routes.GetAssets(Router)
  routes.TradeRoutes(Router, WsConnections)
  routes.UserRoutes(Router)

  // Websockets are used to send trade information BACK to the user,
  // So they are a read-only type thing.
	Router.GET("/ws", func(c *gin.Context) {
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Websocket unable to connect",
			})
			return
		}

    WsConnections[ws] = true
	})

	// Run router and websockets in seperate threads
	go Router.Run("0.0.0.0:4545")
}
