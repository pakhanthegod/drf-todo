from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Item
        fields = ('id', 'owner', 'text')


class UserSerializer(serializers.ModelSerializer):
    items = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='item-detail'
    )

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'items')
