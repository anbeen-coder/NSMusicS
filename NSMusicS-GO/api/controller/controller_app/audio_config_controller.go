package controller_app

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AppAudioConfigController struct {
	usecase domain_app.AppAudioConfigUsecase
}

func NewAppAudioConfigController(uc domain_app.AppAudioConfigUsecase) *AppAudioConfigController {
	return &AppAudioConfigController{usecase: uc}
}

func (ctrl *AppAudioConfigController) ReplaceAll(c *gin.Context) {
	var req []*domain_app.AppAudioConfig
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	if err := ctrl.usecase.ReplaceAll(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (ctrl *AppAudioConfigController) GetAll(c *gin.Context) {
	configs, err := ctrl.usecase.GetAll(c.Request.Context())
	if err != nil {
		if errors.Is(err, domain.ErrEmptyCollection) {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, configs)
}
