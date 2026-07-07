from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views, views_firebase

urlpatterns = [
    path('cadastro/', views.CadastroView.as_view(), name='cadastro'),
    path('perfil/', views.PerfilView.as_view(), name='perfil'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('firebase-login/', views_firebase.firebase_login, name='firebase-login'),
]
