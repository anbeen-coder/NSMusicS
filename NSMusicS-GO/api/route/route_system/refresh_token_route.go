package route_system

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewRefreshTokenRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository_system.NewUserRepository(db, domain_system.CollectionUser)
	rtc := &controller_system.RefreshTokenController{
		RefreshTokenUsecase: usecase_system.NewRefreshTokenUsecase(ur, timeout),
		Env:                 env,
	}
	group.POST("/refresh", rtc.RefreshToken)
}
