# users/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_profile_image = models.ImageField(
        upload_to='user_profile_image/%Y/%m/', 
        default='images/user_profile_image/user_profile_image.png', 
        blank=True
    )
    def __str__(self):
        return self.username
    