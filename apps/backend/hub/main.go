package main

import (
	"sync"

	"johncosta.tech/connections"
)

func main() {
  var wg sync.WaitGroup

  wg.Add(1)
  connections.InitGin()

  wg.Wait()
}
