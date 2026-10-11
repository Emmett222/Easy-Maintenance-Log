from django.shortcuts import render
from django.contrib.auth import logout
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import Car, Service
from .serializers import CarSerializer, ServiceSerializer, UserSerializer, UserRegistrationSerializer

class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Car.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
            serializer.save(owner=self.request.user)

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        serializer = UserSerializer(instance=request.user)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
     queryset = User.objects.all()
     serializer_class = UserRegistrationSerializer
     permission_classes = [AllowAny]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Makes sure malformed requests dont crash server.
        try:
            refresh_token = RefreshToken(request.data.get('refresh'))
            refresh_token.blacklist()
            return Response({"message": "Successfully logged out"}, status=200)
        except TokenError as e:
            return Response({"detail": str(e)}, status=400)
