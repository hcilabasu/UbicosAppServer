

from django.conf.urls import url
from . import views

urlpatterns = [
    url('index', views.index, name='index'),
    url('uploadImage', views.uploadImage, name='uploadImage'),
    url('getImage', views.getImage, name='getImg'),
    url('next',views.pageChange, name='nextpage')
]