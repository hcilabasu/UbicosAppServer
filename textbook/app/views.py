
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render
from .models import ImageModel, ActivityIndex
import os
from django.contrib.auth import authenticate
from django.http.response import JsonResponse
from django.contrib.auth import login as auth_login



#in the browser: http://127.0.0.1:8000/app/

def index(request):
    return render(request, 'app/index.html',{'activities': "None"})

def pageChange(request):
    return render(request, 'app/page2.html', {})

def activityList(request):
    activities = ActivityIndex.objects.all();
    return render(request, 'app/index.html',  {'activities': activities})

def login_form(request):
    return render(request, 'app/login.html',{})

def login(request):

    if request.method == 'POST':
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
        # We use request.POST.get('<variable>') as opposed to request.POST['<variable>'],
        # because the request.POST.get('<variable>') returns None, if the value does not exist,
        # while the request.POST['<variable>'] will raise key error exception
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(username=username, password=password)
        print(user)

        if user:
            auth_login(request, user)
            return HttpResponseRedirect('/index/')
        else:
            msg = 'Enter Correct Information';
            return render(request, 'app/login.html', {})


def uploadImage(request):
    #get image from html and save it in the database
    if request.method == "POST":
        # print (request.Files) #gives the name of the <input type='file' name...>

        #print('id :: ', request.POST.get('id'))

        gallery_id = request.POST.get('id')

        username = ''
        if request.user.is_authenticated():
            print('username :: ',request.user.get_username())
            username = request.user.get_username();
        else:
            print('user not signed in') #add in log

        #TODO: restrict insertion if user is not signed in
        img = ImageModel(gallery_id=gallery_id, posted_by = username, image=request.FILES['gallery_img'])
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