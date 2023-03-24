package model

import (
	"brain/database"
	sharedtypes "sharedTypes"

	"github.com/google/uuid"
	"gorm.io/gorm/clause"
)

// Creates a user in the Brain database, used to sync between
// the auth database and the brain database.
func CreateUser(id string, balance float64) bool {
  var newUser sharedtypes.User
  newUserId, err := uuid.Parse(id)

  if err != nil {
    return false
  }

  newUser.ID = newUserId
  newUser.Balance = balance

  database.Db.Create(&newUser)

  // If no rows were affected, this means the user could not be created
  return database.Db.RowsAffected > 0
}

func FindAsset(assets []sharedtypes.Asset, assetId string) *sharedtypes.Asset {
	for _, asset := range assets {
		if asset.Base.ID.String() == assetId {
			return &asset
		}
	}
	return &sharedtypes.Asset{}
}

func GetUser(userId uuid.UUID) sharedtypes.User {
	var user sharedtypes.User
	var assets []sharedtypes.Asset

	database.Db.Table("users").Select("*").Preload(clause.Associations).Where("users.id = ?", userId.String()).Find(&user)
	database.Db.Find(&assets)

	for i, userAsset := range user.UserAssets {
		user.UserAssets[i].Asset = *FindAsset(assets, userAsset.AssetId)
	}

	return user
}

func GetUserAssets(userId uuid.UUID) []sharedtypes.UserAsset {
	var userAssets []sharedtypes.UserAsset
	database.Db.Table("user_assets").Select("*").Joins("JOIN assets ON assets.id = user_assets.asset_id").Where("user_assets.user_id = ?", userId.String()).Find(&userAssets)
	return userAssets
}
