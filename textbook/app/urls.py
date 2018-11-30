
from django.contrib.auth import views as auth_views
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.login_form, name='login_form'),
    url('login', views.login, name='login'),
    url('logout', auth_views.logout, {'next_page': '/'}, name='logout'),
    url('index', views.index, name='index'),
    url('getUsername', views.getUsername),
    url('getGroupID/(?P<act_id>\d+)', views.getGroupID),
    url('getUserList',views.getUserList),
    url('createUser',views.createUser),
    url('createThirtyUser',views.createThirtyUser),
    url('registerUser',views.registerUser),
    url('groupAdd', views.groupAdd),
    url('uploadImage', views.uploadImage, name='uploadImage'),
    url('getImage/(?P<view_id>\d+)/(?P<gallery_id>\d+)/(?P<group_id>\d+)/', views.getImage, name='getImg'),
    url('getImageID/(?P<img_filename>[\w+._^%$#!~@,-]+)/', views.getImageID), #regular expression checker: https://regex101.com/r/iQ8gG4/1
    url(r'^ajax/imageComment/$', views.broadcastImageComment),
    url('updateImageFeed/(?P<img_id>\d+)', views.updateImageFeed),
    url('gallery/del/(?P<img_id>\d+)', views.imageDelete),
    #url('brainstorm/save/',views.brainstormSave),
    url('brainstorm/save/',views.broadcastBrainstormNote),
    url('brainstorm/get/(?P<brainstorm_id>\d+)',views.brainstormGet),
    url('brainstorm/update/(?P<note_id>\d+)/', views.brainstormUpdate),
    url('brainstorm/del/(?P<note_id>\d+)', views.brainstormDelete),
    url(r'^ajax/chat/$', views.broadcast),
    url('updateFeed', views.updateFeed),
    url('tableData/save/',views.tableEntriesSave),
    url('submitAnswer',views.submitAnswer),
    url('parser',views.pageParser),
    url('camera',views.camera),
    url('userlog', views.userlog),
    url(r'^extensionlog/$', views.userLogFromExtenstion),
    url('delete', views.deleteAllItems, name='activities')

]