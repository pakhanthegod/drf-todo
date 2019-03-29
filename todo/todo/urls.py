from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    re_path('^.*$', include('frontend.urls')),
]
