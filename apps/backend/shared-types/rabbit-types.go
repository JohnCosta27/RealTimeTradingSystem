package sharedtypes

// TODO: Use enums for route selection
type BrainReq struct {
	Url    string
	Params map[string]string
	Body   string //TODO: Add body request types here
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
