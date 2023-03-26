package database

import (
	"time"

	"github.com/google/uuid"
)

// Struct that every object will contain.
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"`
}

// User object, for the auth this contains basic information.
type User struct {
	Base
	Firstname     string
	Surname       string
	Email         string
	Password      string
	Password_salt string
}
