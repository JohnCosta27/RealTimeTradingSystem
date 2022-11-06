package structs

type RequestBody interface {
  *RegisterBody
}

type RegisterBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func GetRegisterBody() *RegisterBody {
  return &RegisterBody{
    Email: "name@email.com",
    Password: "password",
  }
}
