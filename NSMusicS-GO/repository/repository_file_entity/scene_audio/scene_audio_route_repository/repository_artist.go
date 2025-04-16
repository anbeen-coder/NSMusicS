package scene_audio_route_repository

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
)

type artistRepository struct {
	db         mongo.Database
	collection string
}

func NewArtistRepository(db mongo.Database, collection string) scene_audio_db_interface.ArtistRepository {
	return &artistRepository{
		db:         db,
		collection: collection,
	}
}
