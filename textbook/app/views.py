
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .models import ImageModel, Message
from django.contrib.auth import authenticate
from django.http.response import JsonResponse
from django.contrib.auth import login as auth_login
from django.core import serializers
import json

# activity feed code -- start
from pusher import Pusher
from django.views.decorators.csrf import csrf_exempt

# instantiate the pusher class
pusher = Pusher(app_id=u'525110', key=u'ea517de8755ddb1edd03', secret=u'be2bf8ae15037bde9d94', cluster=u'us2')

@csrf_exempt
def broadcast(request):

    print(request.user.get_username())
    print(request.POST['username'])
    pusher.trigger(u'a_channel', u'an_event', {u'name': request.POST['username'], u'message': request.POST['message'] })

    #insert into database
    msg = Message(content=request.POST['message'], posted_by=request.POST['username']);
    msg.save();
    return HttpResponse("done");

# activity feed code -- end

#in the browser: http://127.0.0.1:8000/app/

def index(request):

    return render(request, 'app/index.html',{'activities': "None"})

def pageChange(request):
    return render(request, 'app/page2.html', {})

# def activityList(request):
#     activities = ActivityIndex.objects.all();
#     return render(request, 'app/index.html',  {'activities': activities})

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

        #get the gallery ID
        gallery_id = request.POST.get('act-id')

        # print(type(request.FILES['gallery_img'].name))
        # django.core.files.uploadedfile.InMemoryUploadedFile

        #get the logged in username
        username = ''
        if request.user.is_authenticated:
            print('username :: ', request.user.get_username())
            username = request.user.get_username();
        else:
            print('user not signed in') #add in log


        #insert values in the database
        #TODO: restrict insertion if user is not signed in
        img = ImageModel(gallery_id=gallery_id, posted_by = username, image=request.FILES['gallery_img'])
        # TODO: check whether the insertion was successful or not, else wrong image will be shown using the last() query
        img.save()

        # using data NOT from database
        # data = {}
        # data['gallery_id'] = gallery_id
        # data['posted_by'] = username
        # # data['posted_at'] = "{}".format(images.posted_at)
        # data['url'] = 'images/'+request.FILES['gallery_img'].name
        # image_data = json.dumps(data)

        #get the latest inserted entry from the database
        images = ImageModel.objects.last();

        print(images.image.url)

        # using data from database
        data = {}
        data['gallery_id'] = images.gallery_id
        data['posted_by'] = images.posted_by
        data['posted_at'] = "{}".format(images.posted_at)
        data['url'] = images.image.url
        image_data = json.dumps(data)

        # print(image_data)

        return JsonResponse({'success': image_data, 'errorMsg': True})

def updateFeed(request):
    msg = Message.objects.all()
    msg_data = serializers.serialize('json', msg)
    return JsonResponse({'success': msg_data, 'username': request.user.get_username(),'errorMsg': True})


def getImage(request):
    images = ImageModel.objects.all()
    image_data = serializers.serialize('json', images)
    return JsonResponse({'success': image_data,  'errorMsg': True})

def deleteAllItems(request):
    ImageModel.objects.all().delete()
    Message.objects.all().delete()
    return HttpResponse('')
