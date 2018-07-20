from django.db import models
from django.conf import settings

# Create your models here.


class ImageModel(models.Model):
    gallery_id = models.IntegerField()
    group_id = models.IntegerField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    posted_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images')

class ActivityIndex(models.Model):
    page_number = models.IntegerField()
    activity_type = models.CharField(max_length=40)

class Message(models.Model):
    content = models.CharField(max_length=400)
    posted_by = models.CharField(max_length=20)
    posted_at = models.DateTimeField(auto_now_add=True)


class brainstormNote(models.Model):
    ideaText = models.CharField(max_length=400)
    color = models.CharField(max_length=20)
    position_top = models.CharField(max_length=20)
    position_left = models.CharField(max_length=20)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class userLogTable(models.Model):
    username = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=20)
    type = models.CharField(max_length=200)
    input = models.CharField(max_length=200)
    pagenumber = models.IntegerField(null=True)
    posted_at = models.DateTimeField(auto_now_add=True)
