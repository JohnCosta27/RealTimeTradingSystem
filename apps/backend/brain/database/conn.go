package database

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Db *gorm.DB

func InitDatabase() {

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), 
		logger.Config{
			SlowThreshold:             time.Second,   
			LogLevel:                  logger.Info, 
			IgnoreRecordNotFoundError: false,         
			Colorful:                  true,       
		},
	)

	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5443 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
    Logger: newLogger,
  })
	Db = db

	if err != nil {
		panic(err)
	}

	log.Println("Successfully connected to database")
}
