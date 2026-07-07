import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

_initialized = False


def get_firebase_app():
    global _initialized
    if not _initialized:
        service_account_path = getattr(settings, 'FIREBASE_SERVICE_ACCOUNT_PATH', None)
        if service_account_path:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
        _initialized = True


class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Firebase '):
            return None

        id_token = auth_header.removeprefix('Firebase ').strip()
        if not id_token:
            return None

        try:
            get_firebase_app()
            decoded = firebase_auth.verify_id_token(id_token)
            uid = decoded['uid']
            email = decoded.get('email', '')
            name = decoded.get('name', '')

            User = get_user_model()
            user, _ = User.objects.get_or_create(
                username=uid,
                defaults={
                    'email': email,
                    'first_name': name,
                }
            )
            return (user, None)

        except Exception as e:
            raise AuthenticationFailed(f'Firebase token inválido: {e}')
