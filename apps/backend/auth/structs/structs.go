package structs

type RequestBody interface {
	*RegisterBody | *LoginBody
}

type RegisterBody struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstname"`
	Surname   string `json:"surname"`
}

type LoginBody struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func GetRegisterBody() *RegisterBody {
	return &RegisterBody{
		Email:    "name@email.com",
		Password: "password",
    Firstname: "firstname",
    Surname: "surname",
	}
}

func GetLoginBody() *LoginBody {
  return &LoginBody{
    Email: "name@email.com",
    Password: "password",
  }
}
