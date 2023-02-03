package cache

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v9"
)

var Redis *redis.Client
var RedisContext = context.Background()

const CACHE = "cache"

func InitRedisCache() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	Redis = rdb
}

// Returns false if it doesn't exist
func Get(key string) (string, bool) {
  val, err := Redis.Get(RedisContext, key).Result()
  if err == redis.Nil {
    return "", false
  } else if err != nil {
    log.Println("An error with redis has occured")
    log.Println(err)
    return "", false
  }
  return val, true
}

func Set(key string, val string) *redis.StatusCmd {
  err := Redis.Set(RedisContext, key, val, 5 * time.Minute)
  return err
}

func Invalidate(key string) {
  log.Println("INVALIDATING CACHE")
  Redis.Del(RedisContext, key)
  log.Println("DONE INVALIDATING CACHE")
}
