package database

import (
	"fmt"
	sharedtypes "sharedTypes"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB
var BrainDb *gorm.DB

/**
 * Takes in database connection settings and connects
 * using gorm (Go database ORM library).
 *
 * Starts off with a template string and formats it to contain all the
 * correct environment variables, then the connection is opened.
 *
 * If database cannot be reached the program will panic.
 */
func InitDatabase(AuthConfig *sharedtypes.DbConf, BrainConfig *sharedtypes.DbConf) {
	DatabaseCon := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"
	BruhDatabaseCon := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"

	authDb := fmt.Sprintf(DatabaseCon, AuthConfig.Host, AuthConfig.User, AuthConfig.Password, AuthConfig.DbName, AuthConfig.Port)
	db, err := gorm.Open(postgres.Open(authDb), &gorm.Config{})

	Db = db
	if err != nil {
		panic(err)
	}

	brainDb := fmt.Sprintf(BruhDatabaseCon, BrainConfig.Host, BrainConfig.User, BrainConfig.Password, BrainConfig.DbName, BrainConfig.Port)
	BrainDb, err = gorm.Open(postgres.Open(brainDb), &gorm.Config{})

	if err != nil {
		panic(err)
	}
}
