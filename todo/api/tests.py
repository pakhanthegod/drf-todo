from django.test import TestCase
from django.urls import resolve, reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APIClient, APITestCase
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


class UserTest(APITestCase):
    def setUp(self):
        self.test_user = get_user_model().objects.create_user(
            'test', 'test@test.ru', 'test1234')
        self.create_url = reverse('user-list')

    def test_create_user(self):
        data = {
            'username': 'foobar',
            'email': 'foo@bar.com',
            'password': 'somepassword',
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(get_user_model().objects.count(), 2)
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])
        self.assertFalse('password' in response.data)

    def test_create_user_with_short_password(self):
        data = {
            'username': 'foobar',
            'email': 'foo@bar.com',
            'password': 'q'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['password']), 1)

    def test_create_user_with_no_password(self):
        data = {
            'username': 'foobar',
            'email': 'foo@bar.com',
            'password': ''
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['password']), 1)

    def test_create_user_with_too_long_username(self):
        data = {
            'username': 'foobar'*30,
            'email': 'foo@bar.com',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)

    def test_create_user_with_no_username(self):
        data = {
            'username': '',
            'email': 'foo@bar.com',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)

    def test_create_user_with_preexisted_username(self):
        data = {
            'username': 'test',
            'email': 'foo@bar.com',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)

    def test_create_user_with_invalid_email(self):
        data = {
            'username': 'foobar',
            'email': 'foobar.com',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)

    def test_create_user_with_no_email(self):
        data = {
            'username': 'foobar',
            'email': '',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)

    def test_create_user_with_preexisted_email(self):
        data = {
            'username': 'foobar',
            'email': 'test@test.ru',
            'password': 'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)


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
        response = self.api_client.post(
            url, {'username': self.username, 'password': self.password}, format='json')
        return response.data['access'] if response.status_code == status.HTTP_200_OK else None

    def setup_token(self):
        token = 'Bearer ' + self.get_access_token()
        self.api_client.credentials(HTTP_AUTHORIZATION=token)

    def test_api_jwt(self):
        url = reverse('token_obtain_pair')
        user = self.user

        user.is_active = False
        user.save()
        response = self.api_client.post(
            url, {'username': self.username, 'password': self.password}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        response = self.api_client.post(
            url, {'username': self.username, 'password': self.password}, format='json')

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
        self.assertEqual(response.data, {
                         'id': 2, 'owner': self.user.username, 'text': self.default_text})

    def test_delete_item(self):
        self.setup_token()

        item = Item.objects.create(owner=self.user, text=self.default_text)
        url = reverse('item-detail', kwargs={'pk': item.pk})
        self.assertEqual(Item.objects.all().count(), 2)

        response = self.api_client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Item.DoesNotExist, Item.objects.get, id=2)
        self.assertEqual(Item.objects.all().count(), 1)

    def test_update_item(self):
        self.setup_token()

        item = Item.objects.get(pk=1)
        self.assertEqual(item.text, self.default_text)

        url = reverse('item-detail', kwargs={'pk': item.pk})
        new_text = 'new text'
        response = self.api_client.put(
            url, {'id': item.pk, 'owner': item.owner.username, 'text': new_text})
        item = Item.objects.get(pk=1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(item.text, new_text)
