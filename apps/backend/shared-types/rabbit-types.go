package sharedtypes

import "github.com/google/uuid"

// TODO: Use enums for route selection
type BrainReq struct {
	Url    string
  Access uuid.UUID
	Params map[string]string
	Body   map[string]string  //TODO: Add body request types here
}

type CreateTransaction struct {
  AssetId string  `json:"assetId" binding:"required"`
  Type    string  `json:"type" binding:"required"`
}

type HubPosts interface {
	*CreateTransaction
}

func GetTransactionBody() *CreateTransaction {
	return &CreateTransaction{}
}
