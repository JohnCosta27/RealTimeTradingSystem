package routes

import (
	"hub/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthRoute(r *gin.Engine) {
  r.GET(HEALTH_ROUTE, func (c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "health": "alive",
    })
  })

  r.GET(HEALTH_AUTH_ROUTE, middleware.Auth(), func (c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "health": "alive and authenticated",
    })
  })
}
