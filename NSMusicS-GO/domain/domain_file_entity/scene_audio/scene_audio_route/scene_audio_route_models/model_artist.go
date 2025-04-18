package scene_audio_route_models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ArtistMetadata struct {
	PlayCount int       `bson:"play_count"`
	PlayDate  time.Time `bson:"play_date"`
	Rating    int       `bson:"rating"`
	Starred   bool      `bson:"starred"`
	StarredAt time.Time `bson:"starred_at"`

	ID         primitive.ObjectID `bson:"_id"`
	Name       string             `bson:"name"`
	AlbumCount int                `bson:"album_count"`
	SongCount  int                `bson:"song_count"`
	Size       int                `bson:"size"`

	ImageFiles string `bson:"image_files"` // 为空则不存在cover封面，从媒体文件中提取
}
