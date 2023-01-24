module johncosta.tech/utils

go 1.19

require (
	github.com/golang-jwt/jwt v3.2.2+incompatible
	github.com/rabbitmq/amqp091-go v1.5.0
	sharedTypes v1.0.0
)

require github.com/google/uuid v1.3.0 // indirect

replace sharedTypes v1.0.0 => ../shared-types
