package sharedtypes

import (
	"time"

	"github.com/google/uuid"
)

type Base struct {
	ID        uuid.UUID  `gorm:"type:uuid;primary_key;" json:"Id"`
	CreatedAt time.Time  `json:"CreatedAt"`
	UpdatedAt time.Time  `json:"UpdatedAt"`
	DeletedAt *time.Time `sql:"index" json:"DeletedAt"`
}

type Asset struct {
	Base
	Name string `json:"Name"`
}
