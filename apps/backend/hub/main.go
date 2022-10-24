package main

import (
	"sync"

	"hub/connections"
)

func main() {
  var wg sync.WaitGroup

  wg.Add(1)
  connections.InitGin()

  wg.Wait()
}
