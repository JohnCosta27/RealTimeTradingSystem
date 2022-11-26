package sharedtypes

// TODO: Use enums for route selection
type BrainReq struct {
  Url string;
  Params map[string]string;
  Body string //TODO: Add body request types here
}
