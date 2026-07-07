from django.urls import path
from . import views

urlpatterns = [
    path('webhook/', views.AsaasWebhookView.as_view(), name='asaas-webhook'),
]
