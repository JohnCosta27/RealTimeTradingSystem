package model

import (
	"brain/database"
	"sharedTypes"

	"github.com/google/uuid"
)

/**
  * This file is the model file for working with assets in the system.
  */

func GetAllAssets() []sharedtypes.Asset {
  var assets []sharedtypes.Asset
  database.Db.Find(&assets)
  return assets
}

func GetUserAssets(userId uuid.UUID) []sharedtypes.UserAsset {
  var userAssets []sharedtypes.UserAsset
  database.Db.Table("user_assets").Select("*").Joins("JOIN assets ON assets.id = user_assets.asset_id").Where("user_assets.user_id = ?", userId.String()).Find(&userAssets)
  return userAssets;
}
