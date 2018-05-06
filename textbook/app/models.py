from django.db import models

# Create your models here.


class ImageModel(models.Model):
    gallery_id = models.IntegerField()
    posted_by = models.CharField(max_length=20)
    posted_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images')

class ActivityIndex(models.Model):
    page_number = models.IntegerField()
    activity_type = models.CharField(max_length=40)