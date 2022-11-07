package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDatabase() {
	dsn := "host=localhost user=johnc password=meh dbname=local_project_auth port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
  Db = db

  if err != nil {
    panic(err)
  }
}
