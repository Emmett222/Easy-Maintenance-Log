from django.contrib import admin
from .models import Car, Service

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'mileage', 'color')
    search_fields = ('make', 'model', 'descriptor')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('car', 'title', 'mileage', 'date', 'next_mileage', 'next_time', 'mileage_dependant', 'time_dependant', 'is_maintenance', 'is_repair')
    search_fields = ('title', 'description')
    list_filter = ('mileage_dependant', 'time_dependant')