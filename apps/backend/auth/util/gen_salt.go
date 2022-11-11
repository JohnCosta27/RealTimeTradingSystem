package util

import "math/rand"

var SALT_SIZE = 64
var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.><,?/'@#][{}=+-_!£$%^&*]")

func GenSalt() string {
	b := make([]rune, SALT_SIZE)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
