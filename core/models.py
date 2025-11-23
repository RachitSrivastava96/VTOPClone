import secrets
import string
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class ToDo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
class StudentCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    wifi_username = models.CharField(max_length=100, blank=True)
    wifi_password = models.CharField(max_length=100, blank=True)
    library_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} Credentials"
def generate_wifi_password(length=12):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(chars) for _ in range(length))
@receiver(post_save, sender=User)
def create_credentials(sender, instance, created, **kwargs):
    if created:
        StudentCredentials.objects.create(
            user=instance,
            wifi_username=instance.username,  
            wifi_password=generate_wifi_password(),  
            library_id=f"LIB{instance.id:05d}"  # Example auto ID  
        )