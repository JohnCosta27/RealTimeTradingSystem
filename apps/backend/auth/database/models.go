package database

import (
	"time"

	"github.com/gofrs/uuid"
)

type Base struct {
   ID        uuid.UUID  `gorm:"type:uuid;primary_key;"`
   CreatedAt time.Time
   UpdatedAt time.Time
   DeletedAt *time.Time `sql:"index"`
}

type User struct {
  Base
  Firstname string
  Surname string
  Email string
  Password string
  Password_salt string
}
