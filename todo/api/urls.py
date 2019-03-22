from django.urls import path

from rest_framework import routers

from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.SimpleRouter()
router.register(r'users', views.UserViewSet)
router.register(r'items', views.ItemViewSet)

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls