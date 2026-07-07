from django.urls import path
from . import views

urlpatterns = [
    path('', views.DownloadListView.as_view(), name='download-list'),
    path('novo/', views.DownloadCreateView.as_view(), name='download-create'),
    path(
        'presigned-url/<uuid:projeto_id>/',
        views.GerarPresignedUrlView.as_view(),
        name='presigned-url'
    ),
]
