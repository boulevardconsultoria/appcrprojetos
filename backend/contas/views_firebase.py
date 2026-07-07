from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import get_firebase_app
from firebase_admin import auth as firebase_auth
from django.contrib.auth import get_user_model


@api_view(['POST'])
@permission_classes([AllowAny])
def firebase_login(request):
    id_token = request.data.get('id_token')
    if not id_token:
        return Response(
            {'error': 'id_token é obrigatório'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        get_firebase_app()
        decoded = firebase_auth.verify_id_token(id_token)
        uid = decoded['uid']
        email = decoded.get('email', '')
        name = decoded.get('name', '')

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=uid,
            defaults={
                'email': email,
                'first_name': name,
            }
        )

        if not created:
            if email and user.email != email:
                user.email = email
            if name and user.first_name != name:
                user.first_name = name
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })

    except Exception as e:
        return Response(
            {'error': f'Token inválido: {str(e)}'},
            status=status.HTTP_401_UNAUTHORIZED
        )
