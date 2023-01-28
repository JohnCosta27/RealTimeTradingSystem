package database

import (
	"fmt"
	"log"
	sharedtypes "sharedTypes"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDatabase(BrainConfig *sharedtypes.DbConf) {
	DatabaseCon := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"

	brainDb := fmt.Sprintf(DatabaseCon, BrainConfig.Host, BrainConfig.User, BrainConfig.Password, BrainConfig.DbName, BrainConfig.Port)
	BrainDb, err := gorm.Open(postgres.Open(brainDb))
	Db = BrainDb

	if err != nil {
		panic(err)
	}

	log.Println("Successfully connected to database")
}
