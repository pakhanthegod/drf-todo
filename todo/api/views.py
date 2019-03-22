from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response

from .models import Item
from .permissions import IsOwner
from .serializers import ItemSerializer, UserSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer