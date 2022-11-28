package sharedtypes

import (
	"time"

	"github.com/google/uuid"
)

type Base struct {
	ID        uuid.UUID  `gorm:"type:uuid;primary_key;" json:"Id"`
	CreatedAt time.Time  `json:"CreatedAt"`
	UpdatedAt time.Time  `json:"UpdatedAt"`
	DeletedAt *time.Time `sql:"index" json:"DeletedAt"`
}

type Asset struct {
	Base
	Name       string      `json:"Name"`
	UserAssets []UserAsset `json:"UserAssets"`
}

type Transaction struct {
	Base
	AssetId  string  `json:"AssetId"`
	BuyerId  string  `json:"BuyerId"`
	SellerId string  `json:"SellerId"`
	State    string  `json:"State"`
	Price    float64 `json:"Price"`
}

type User struct {
	Base
	Balance    float64     `json:"Balance"`
	UserAssets []UserAsset `json:"UserAssets"`
}

type UserAsset struct {
	Base
	UserId  string  `json:"UserId"`
	AssetId string  `json:"AssetId"`
	Amount  float64 `json:"Amount"`
  Asset   Asset   `json:"Asset" gorm:"embedded"`
  User    User    `json:"User" gorm:"embedded"`
}
