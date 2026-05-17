from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TravelSearchHistory(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='travel_searches')
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.CharField(max_length=100)
    travel_type = models.CharField(max_length=100)
    interests =  models.JSONField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField(null=True,blank=True)

    class Meta:
        ordering = ["-created_at"]


    
    def __str__(self):
        return f"{self.user.username} → {self.destination}"



