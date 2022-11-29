package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB
var BrainDb *gorm.DB

func InitDatabase() {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5442 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
  Db = db

  if err != nil {
    panic(err)
  }

  brainDbString := "host=localhost user=postgres password=postgres dbname=postgres port=5443 sslmode=disable" 
  BrainDb, err = gorm.Open(postgres.Open(brainDbString), &gorm.Config{})

  if err != nil {
    panic(err)
  }
}
