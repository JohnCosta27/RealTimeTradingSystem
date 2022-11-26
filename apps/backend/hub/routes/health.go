package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthRoute(r *gin.Engine) {
  r.GET(HEALTH_ROUTE, func (c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "health": "alive",
    })
  })
}
