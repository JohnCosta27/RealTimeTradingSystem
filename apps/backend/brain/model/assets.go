package model

import (
  "sharedTypes"
	"brain/database"
)

func GetAllAssets() []sharedtypes.Asset {
  var assets []sharedtypes.Asset
  database.Db.Find(&assets)
  return assets
}
