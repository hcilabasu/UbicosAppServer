
from django.contrib.auth import views as auth_views
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.login_form, name='login_form'),
    url('login', views.login, name='login'),
    url('logout', auth_views.logout, {'next_page': '/'}, name='logout'),
    url('index', views.index, name='index'),
    url('uploadImage', views.uploadImage, name='uploadImage'),
    url('getImage/(?P<gallery_id>\d+)/(?P<group_id>\d+)/', views.getImage, name='getImg'),
    url('getImageID/(?P<img_filename>[\w-]+\.[\w]+)/', views.getImageID), #regular expression checker: https://regex101.com/r/iQ8gG4/1
    url('brainstorm/save/',views.brainstormSave),
    url('brainstorm/get/(?P<brainstorm_id>\d+)',views.brainstormGet),
    url('brainstorm/update/(?P<note_id>\d+)/', views.brainstormUpdate),
    url('delete',views.deleteAllItems, name='activities'),
    url(r'^ajax/chat/$', views.broadcast),
    url(r'^ajax/imageComment/$', views.broadcastImageComment),
    url('updateFeed', views.updateFeed),
    url('updateImageFeed/(?P<img_id>\d+)', views.updateImageFeed),
    url('getUsername', views.getUsername),
    url('userlog',views.userlog),
    url('brainstorm/del/(?P<note_id>\d+)',views.brainstormDelete),
    url('gallery/del/(?P<img_id>\d+)',views.imageDelete),
    url('parser',views.pageParser),
    url('tableData/save/',views.tableEntriesSave),
    url('submitAnswer',views.submitAnswer),
    url('getUserList',views.getUserList),
    url('createUser',views.createUser),
    url('camera',views.camera)

]