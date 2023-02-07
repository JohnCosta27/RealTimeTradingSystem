package main

import (
	"fmt"
	"hub/middleware"
	"hub/routes"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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

  Router.Use(middleware.AllowCors())

	// Inititalize the routes in the application
	routes.HealthRoute(Router)
  routes.GetAssets(Router)
  routes.TradeRoutes(Router)
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

		WsConnections = append(WsConnections, ws)
	})

	// Run router and websockets in seperate threads
	go Router.Run("0.0.0.0:4545")
}
