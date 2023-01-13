package database

import (
	"fmt"
	sharedtypes "sharedTypes"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB
var BrainDb *gorm.DB


func InitDatabase(AuthConfig *sharedtypes.DbConf, BrainConfig *sharedtypes.DbConf) {
	DatabaseCon := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"
  authDb := fmt.Sprintf(DatabaseCon, AuthConfig.Host, AuthConfig.User, AuthConfig.Password, AuthConfig.DbName, AuthConfig.Port)
	db, err := gorm.Open(postgres.Open(authDb), &gorm.Config{})
  Db = db

  if err != nil {
    panic(err)
  }

  brainDb := fmt.Sprintf(DatabaseCon, BrainConfig.Host, BrainConfig.User, BrainConfig.Password, BrainConfig.DbName, BrainConfig.Port)
  BrainDb, err = gorm.Open(postgres.Open(brainDb), &gorm.Config{})

  if err != nil {
    panic(err)
  }
}
