from django.urls import path
from . import views

urlpatterns = [
    path('webhook/', views.AbacatePayWebhookView.as_view(), name='abacatepay-webhook'),
    path('checkout/', views.CriarCheckoutView.as_view(), name='criar-checkout'),
]
