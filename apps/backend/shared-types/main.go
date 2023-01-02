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
	Name         string        `json:"Name"`
}

// Transaction State:
// "in-market": Still in market, other users can buy it
// "cancelled": Cancelled
// "completed": Another user has bought or sold it

// Transaction buy/sell is determined by whether the
// buyer or seller id is null.
// If the trade is in market and the buyer id is not null
// that means it is a BUY transaction.

// The Price here is the TOTAL PRICE for the amount of assets.
// So to get the price per 1 asset = total price / amount.
type Transaction struct {
	Base
	AssetId  string  `json:"AssetId"`
	BuyerId  string  `json:"BuyerId"`
	SellerId string  `json:"SellerId"`
	State    string  `json:"State"`
	Price    float64 `json:"Price"`
	Amount   float64 `json:"Amount"`
}

type User struct {
	Base
	Balance          float64       `json:"Balance"`
	UserAssets       []UserAsset   `json:"UserAssets"`
	BuyTransactions  []Transaction `json:"BuyTransactions" gorm:"foreignKey:BuyerId"`
	SellTransactions []Transaction `json:"SellTransactions" gorm:"foreignKey:SellerId"`
}

type UserAsset struct {
	Base
	UserId  string  `json:"UserId"`
	AssetId string  `json:"AssetId"`
	Amount  float64 `json:"Amount"`
	Asset   Asset   `json:"Asset" gorm:"embedded"`
}
