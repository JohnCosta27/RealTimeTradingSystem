package main

import (
	"auth/database"
	sharedtypes "sharedTypes"
	"sync"

	"github.com/caarlos0/env/v6"
)

/**
 * Entry point for the Auth application.
 * It tries to parse various environment variables first, otherwise errors.
 *
 * The function also initializes
 * - Database connection
 * - Gin HTTP Server
 *
 * It then runs the router in a go routine (Another thread), and halts until user
 * manually stops the process.
 */
func main() {
	var wg sync.WaitGroup
	wg.Add(1)

	EnvConf := sharedtypes.EnvConf{}
	if err := env.Parse(&EnvConf); err != nil {
		panic("Cannot get environment variables, check your env file")
	}

	database.InitDatabase(&sharedtypes.DbConf{
		Host:     EnvConf.AuthDbHost,
		Port:     EnvConf.AuthDbPort,
		DbName:   EnvConf.AuthDbName,
		User:     EnvConf.AuthDbUser,
		Password: EnvConf.AuthDbPassword,
	}, &sharedtypes.DbConf{
		Host:     EnvConf.BrainDbHost,
		Port:     EnvConf.BrainDbPort,
		DbName:   EnvConf.BrainDbName,
		User:     EnvConf.BrainDbUser,
		Password: EnvConf.BrainDbPassword,
	})

	Router := InitGin()
	go Router.Run("0.0.0.0:4546")

	// Blocking call, the program will never exit unless it panics
	// or the user closes it.
	wg.Wait()
}
