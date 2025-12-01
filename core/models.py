import secrets
import string
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

BRANCH_CODE_MAP = {
    "BCE": "B.Tech in Computer Science and Engineering (Core)",
    "BAI": "B.Tech in Computer Science and Engineering (AI/ML)",
    "BCY": "B.Tech in Computer Science and Engineering (Cyber Security)",
    "BHI": "B.Tech in Computer Science and Engineering (Health Informatics)",
}


def extract_branch_from_username(username: str):
    """
    Expected username format: 00ABC00000
    where ABC is one of BCE, BAI, BCY, BHI.
    """
    if not username or len(username) < 5:
        return "", ""

    code = username[2:5].upper()
    name = BRANCH_CODE_MAP.get(code, "")
    return code if name else "", name


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
    # Branch information derived from username pattern (e.g. 00BCE00000)
    branch_code = models.CharField(max_length=3, blank=True)
    branch_name = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.user.username} Credentials"
def generate_wifi_password(length=12):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(chars) for _ in range(length))
@receiver(post_save, sender=User)
def create_credentials(sender, instance, created, **kwargs):
    if created:
        branch_code, branch_name = extract_branch_from_username(instance.username)
        StudentCredentials.objects.create(
            user=instance,
            wifi_username=instance.username,  
            wifi_password=generate_wifi_password(),  
            library_id=f"LIB{instance.id:05d}",  # Example auto ID
            branch_code=branch_code,
            branch_name=branch_name,
        )