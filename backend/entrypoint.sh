#!/bin/bash
set -e

echo "Rodando migrations..."
python manage.py migrate --noinput

echo "Coletando static files..."
python manage.py collectstatic --noinput

echo "Iniciando servidor..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:"${PORT:-8000}" --workers 4
