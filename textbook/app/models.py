from django.db import models

# Create your models here.


class ImageModel(models.Model):
    image = models.ImageField(upload_to='images')

class ActivityIndex(models.Model):
    page_number = models.IntegerField()
    activity_type = models.CharField(max_length=40)