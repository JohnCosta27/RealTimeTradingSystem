package main

import "github.com/go-redis/redis/v9"

var Redis *redis.Client

func InitRedisCache() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	Redis = rdb
}
