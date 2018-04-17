

from django.conf.urls import url
from . import views

urlpatterns = [
    url('uploadImage', views.uploadImage, name='uploadImage'),
    url('getImage', views.getImage, name='getImg')
]