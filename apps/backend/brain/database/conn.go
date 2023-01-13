package database

import (
	"fmt"
	"log"
	"os"
	sharedtypes "sharedTypes"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Db *gorm.DB

func InitDatabase(BrainConfig *sharedtypes.DbConf) {
	DatabaseCon := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: false,
			Colorful:                  true,
		},
	)

	brainDb := fmt.Sprintf(DatabaseCon, BrainConfig.Host, BrainConfig.User, BrainConfig.Password, BrainConfig.DbName, BrainConfig.Port)
	BrainDb, err := gorm.Open(postgres.Open(brainDb), &gorm.Config{
		Logger: newLogger,
	})
	Db = BrainDb

	if err != nil {
		panic(err)
	}

	log.Println("Successfully connected to database")
}
