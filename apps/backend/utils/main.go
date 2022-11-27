package utils

import (
	"errors"
	"fmt"
	"time"
  "math/rand"

	"github.com/golang-jwt/jwt"
)

var jwtKey = []byte("my_secret_key")

// Refresh token lasts 2 weeks
var REFRESH_TIME = 14 * 24 * time.Hour

// Access token only lasts 1 hour
var ACCESS_TIME = 1 * time.Hour

type Claims struct {
	Exp  string
	Type string
  Uuid string // The users UUID
}

func (c Claims) Valid() error {
	if c.Type == "" || c.Uuid == "" {
		return errors.New("Bad claims")
	}
  return nil
}

func GenJwt() *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS512)
	return token
}

func GenRefreshToken(userId string) (string, error) {
	token := GenJwt()
	claims := token.Claims.(jwt.MapClaims)
	claims["Exp"] = time.Now().Add(REFRESH_TIME)
	claims["Type"] = "refresh"
  claims["Uuid"] = userId
	return token.SignedString(jwtKey)
}

func GenAccessToken(userId string) (string, error) {
	token := GenJwt()
	claims := token.Claims.(jwt.MapClaims)
	claims["Exp"] = time.Now().Add(ACCESS_TIME)
	claims["Type"] = "access"
  claims["Uuid"] = userId
	return token.SignedString(jwtKey)
}

// Returns the claims from the token, or an error if it is not valid
func DecodeJwt(tokenString string, tokenType string) (Claims, error) {
	c := Claims{}
	_, err := jwt.ParseWithClaims(tokenString, &c, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}

		return jwtKey, nil
	})
  return c, err;
}

func IsValidJwt(tokenString string, tokenType string) bool {
  claims, err := DecodeJwt(tokenString, tokenType)
  if err != nil {
    return false
  }

	return claims.Type == tokenType
}

var SALT_SIZE = 64
var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.><,?/'@#][{}=+-_!£$%^&*]")

func GenSalt() string {
	b := make([]rune, SALT_SIZE)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
