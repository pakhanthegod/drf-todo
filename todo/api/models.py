from django.db import models
from django.contrib.auth import get_user_model


class Item(models.Model):
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='items')
    text = models.TextField(max_length=255)
