package model

import (
	"brain/database"
	"sharedTypes"
)

/**
 * This file is the model file for working with assets in the system.
 */

func GetAllAssets() []sharedtypes.Asset {
	var assets []sharedtypes.Asset
	database.Db.Find(&assets)
	return assets
}
