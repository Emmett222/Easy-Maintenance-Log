from django.conf import settings
from django.db import models

class Car(models.Model):
    name = models.CharField(max_length=100)
    milage = models.IntegerField()
    color = models.CharField(max_length=7, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class Service(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='service')

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    milage = models.IntegerField(blank=True)
    date = models.DateField(auto_now_add=True, blank=True)
    cost = models.FloatField(blank=True)

    next_milage = models.IntegerField(blank=True)
    next_time = models.IntegerField(blank=True)
    milage_dependant = models.BooleanField(default=False) 
    time_dependant = models.BooleanField(default=False) 