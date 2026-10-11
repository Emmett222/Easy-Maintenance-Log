from django.contrib import admin
from .models import Car, Service

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'milage', 'color')
    search_fields = ('make', 'model', 'descriptor')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('car', 'title', 'milage', 'date', 'next_milage', 'next_time', 'milage_dependant', 'time_dependant')
    search_fields = ('title', 'description')
    list_filter = ('milage_dependant', 'time_dependant')