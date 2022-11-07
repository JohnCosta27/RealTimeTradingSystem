package structs

type RequestBody interface {
	*RegisterBody
}

type RegisterBody struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstname"`
	Surname   string `json:"surname"`
}

func GetRegisterBody() *RegisterBody {
	return &RegisterBody{
		Email:    "name@email.com",
		Password: "password",
    Firstname: "firstname",
    Surname: "surname",
	}
}
