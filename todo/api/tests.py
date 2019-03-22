from django.test import TestCase
from django.urls import resolve, reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.renderers import JSONRenderer

from .models import Item
from .serializers import ItemSerializer, UserSerializer


class ItemTest(TestCase):
    def setUp(self):
        self.api_client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test',
            'test@test.com',
            'test1234'
        )
        self.default_text = 'Some default text'
    
    def create_whatever(self):
        owner = self.user
        text = self.default_text
        
        return Item.objects.create(owner=owner, text=text)

    def test_whatever_creation(self):
        whatever = self.create_whatever()

        self.assertEqual(self.default_text, whatever.text)
        self.assertEqual(self.user, whatever.owner)
        self.assertTrue(isinstance(whatever, Item))


class ApiTest(TestCase):
    def setUp(self):
        self.api_client = APIClient()
        self.username = 'test'
        self.email = 'test@test.com'
        self.password = 'test1234'
        self.user = get_user_model().objects.create_user(
            self.username,
            self.email,
            self.password
        )
        self.default_text = 'Some default text'

        Item.objects.create(owner=self.user, text=self.default_text)

    def get_access_token(self):
        url = reverse('token_obtain_pair')
        response = self.api_client.post(url, {'username': self.username, 'password': self.password}, format='json')
        return response.data['access'] if response.status_code == status.HTTP_200_OK else None

    def setup_token(self):
        token = 'Bearer ' + self.get_access_token()
        self.api_client.credentials(HTTP_AUTHORIZATION=token)

    def test_api_jwt(self):
        url = reverse('token_obtain_pair')
        user = self.user

        user.is_active = False
        user.save()
        response = self.api_client.post(url, {'username': self.username, 'password': self.password}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        response = self.api_client.post(url, {'username': self.username, 'password': self.password}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_get_all_items(self):
        self.setup_token()
        url = reverse('item-list')
        response = self.api_client.get(url, format='json')
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_item(self):
        self.setup_token()
        url = reverse('item-detail', kwargs={'pk': 1})
        response = self.api_client.get(url, format='json')
        item = Item.objects.get(pk=1)
        serializer = ItemSerializer(item)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_create_item(self):
        self.setup_token()
        url = reverse('item-list')
        payload = {
            'text': self.default_text
        }

        response = self.api_client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'id': 2, 'owner': self.user.username, 'text': self.default_text})
