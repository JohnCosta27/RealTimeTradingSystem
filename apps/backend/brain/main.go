package main

import (
	"brain/rabbitmq"
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	rabbitmq.InitRabbit()

	msgs, err := rabbitmq.GlobalChannel.Consume(
		"TestQueue",
    "",
    true,
    false,
    false,
    false,
    nil,
	)

  if err != nil {
    panic(err)
  }

  go func() {
      for d := range msgs {
        fmt.Printf("Message: %s\n", d.Body)
      }
  }()

	wg.Wait()

	rabbitmq.CloseRabbit()
}
