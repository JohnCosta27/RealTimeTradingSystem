package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDatabase() {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5443 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
  Db = db

  if err != nil {
    panic(err)
  }

  log.Println("Successfully connected to database")
}
