package cache

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v9"
)

// Constant to determine if we have cache fetching enabled.
const isCacheEnabled = false

// Global variables for redis cluster
var Redis *redis.Client
var RedisContext = context.Background()

// Enum to be used by routes to define some cache.
const CACHE = "cache"

// Initialises cluster and sets global variable to correct pointer.
func InitRedisCache() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "",
		DB:       0,
	})
	Redis = rdb
}

// Get a key from cache (1st return value)
// 2nd return value is true if the key exists in redis.
// Otherwise it will be false and therefore not exist
// It is also possible that it is false due to an error.
func Get(key string) (string, bool) {
	val, err := Redis.Get(RedisContext, key).Result()

	if err == redis.Nil || err != nil {
		log.Println("An error with redis has occured")
		log.Println(err)
		return "", false
	}
	return val, true
}

// Sets a certain key-value pair, returns an error object.
// Which will be null if there is no error.
func Set(key string, val string) *redis.StatusCmd {
	err := Redis.Set(RedisContext, key, val, 5*time.Minute)
	return err
}

// Deletes a certain key from Redis.
func Invalidate(key string) {
	Redis.Del(RedisContext, key)
}
