package util

import (
	"errors"
	"fmt"
	"time"

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
}

func (c Claims) Valid() error {
	if c.Exp == "" || c.Type == "" {
		return errors.New("Bad claims")
	}
	return nil
}

func GenJwt() *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS512)
	return token
}

func GenRefreshToken() (string, error) {
	token := GenJwt()
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(REFRESH_TIME)
	claims["type"] = "refresh"
	return token.SignedString(jwtKey)
}

func GenAccessToken() (string, error) {
	token := GenJwt()
	claims := token.Claims.(jwt.MapClaims)
	claims["Exp"] = time.Now().Add(ACCESS_TIME)
	claims["Type"] = "access"
	return token.SignedString(jwtKey)
}

func IsValidJwt(tokenString string, tokenType string) bool {
	c := Claims{}
	_, err := jwt.ParseWithClaims(tokenString, &c, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}

		return jwtKey, nil
	})

	if err != nil {
		fmt.Println(err)
		return false
	}

	return c.Type == tokenType
}
