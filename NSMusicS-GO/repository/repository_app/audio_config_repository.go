package repository_app

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type AppAudioConfigRepository interface {
	ReplaceAll(ctx context.Context, configs []*domain_app.AppAudioConfig) error
	GetAll(ctx context.Context) ([]*domain_app.AppAudioConfig, error)
}

type AppAudioConfigRepo struct {
	db         mongo.Database
	collection string
}

func NewAppAudioConfigRepository(db mongo.Database, collection string) AppAudioConfigRepository {
	return &AppAudioConfigRepo{db: db, collection: collection}
}

func (r *AppAudioConfigRepo) ReplaceAll(ctx context.Context, configs []*domain_app.AppAudioConfig) error {
	coll := r.db.Collection(r.collection)

	if _, err := coll.DeleteMany(ctx, bson.M{}); err != nil {
		return fmt.Errorf("replaceAll failed to delete: %w", err)
	}

	if len(configs) == 0 {
		return nil
	}

	if _, err := coll.InsertMany(ctx, convertToInterfaceSliceAppAudioConfig(configs)); err != nil {
		return fmt.Errorf("replaceAll failed to insert: %w", err)
	}
	return nil
}
func convertToInterfaceSliceAppAudioConfig(configs []*domain_app.AppAudioConfig) []interface{} {
	docs := make([]interface{}, len(configs))
	for i, c := range configs {
		docs[i] = c
	}
	return docs
}

func (r *AppAudioConfigRepo) GetAll(ctx context.Context) ([]*domain_app.AppAudioConfig, error) {
	coll := r.db.Collection(r.collection)

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("find failed: %w", err)
	}
	defer cursor.Close(ctx)

	var configs []*domain_app.AppAudioConfig
	if err := cursor.All(ctx, &configs); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	if len(configs) == 0 {
		return nil, domain.ErrEmptyCollection
	}
	return configs, nil
}
