from django.http import HttpResponse, Http404
from django.shortcuts import render
from .models import ImageModel, ActivityIndex
import os
import urllib
from django.http.response import JsonResponse



#in the browser: http://127.0.0.1:8000/app/
def index(request):
    return render(request, 'app/index.html',{'activities': "None"})

def pageChange(request):
    return render(request, 'app/page2.html', {})

def activityList(request):
    activities = ActivityIndex.objects.all();
    return render(request, 'app/index.html',  {'activities': activities})


def uploadImage(request):
    #get image from html and save it in the database
    if request.method == "POST":
        # print (request.Files) #gives the name of the <input type='file' name...>

        img = ImageModel(image=request.FILES['gallery_img'])
        img.save()

        #uploads in the server but not in the db
        #handle_uploaded_file(request.FILES['gallery_img'], str(request.FILES['gallery_img']))
        return HttpResponse('success')


def handle_uploaded_file(file, filename):
    if not os.path.exists('media/'):
        os.mkdir('media/')

    with open('media/' + filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)


def getImage(request):
    image = ImageModel.objects.all();
    return JsonResponse({'success': image[0].image.url, 'errorMsg': True})