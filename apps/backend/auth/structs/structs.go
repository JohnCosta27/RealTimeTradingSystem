package structs

//TODO: Migrate to common lib package.

type RequestBody interface {
	*RegisterBody | *LoginBody | *RefreshBody
}

type RegisterBody struct {
  Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Firstname string `json:"firstname" binding:"required"`
	Surname   string `json:"surname" binding:"required"`
}

type LoginBody struct {
  Email    string `json:"email" binding:"required"`
  Password string `json:"password" binding:"required"`
}

type RefreshBody struct {
  Refresh string `json:"refresh" binding:"required"`
}

func GetRegisterBody() *RegisterBody {
	return &RegisterBody{}
}

func GetLoginBody() *LoginBody {
	return &LoginBody{}
}

func GetRefreshBody() *RefreshBody {
  return &RefreshBody{}
}
