package sharedtypes

import (
	"github.com/google/uuid"
)

// The following is the best way I found to do immutable, namespaced enums in go.
// To have getters that never change value and then comparing them later

const (
	REQUEST  string = "request"
	RESPONSE string = "response"
	INFO     string = "info"
)

const (
	GET_USER         string = "get-user"
	GET_ASSETS       string = "get-assets"
	GET_USER_ASSETS  string = "get-user-assets"
	GET_TRADES       string = "get-trades"
	GET_ASSET_TRADES string = "get-asset-trades"
	CREATE_TRADE     string = "create-trade"
	COMPLETE_TRADE   string = "complete-trade"
  SYNC_REGISTER    string = "sync-register"
)

type BrainReq struct {
	Url    string            `json:"url"`
	Access uuid.UUID         `json:"access"`
	Params map[string]string `json:"params"`
	Body   map[string]string `json:"body"`
	To     string            `json:"to"`
	From   string            `json:"from"`
	Type   string            `json:"type"`
}

type BrainResError struct {
	ErrorCode any `json:"ErrorCode"`
}

type BrainRes struct {
	ErrorCode int
	Response  any
}

type ReqBody interface {
	StartTrade | EmptyBody
}

type EmptyBody bool

type StartTrade struct {
	Type    string
	price   float64
	amount  float64
	userId  uuid.UUID
	assetId uuid.UUID
}

type CreateTransaction struct {
	AssetId string  `json:"assetId" binding:"required"`
	Type    string  `json:"type" binding:"required"`
	Amount  float64 `json:"Amount" binding:"required"`
	Price   float64 `json:"Price" binding:"required"`
}

type CompleteTransaction struct {
	TransactionId string `json:"TransactionId" binding:"required"`
}

type HubPosts interface {
	*CreateTransaction | *CompleteTransaction
}

func GetTransactionBody() *CreateTransaction {
	return &CreateTransaction{}
}

func GetCompleteTransaction() *CompleteTransaction {
	return &CompleteTransaction{}
}
