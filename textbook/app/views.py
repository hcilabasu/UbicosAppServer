
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, render_to_response
from rest_framework.views import APIView
from .models import imageModel, imageComment, Message, brainstormNote,userLogTable, tableChartData, userQuesAnswerTable, groupInfo, userLogTable
from django.contrib.auth import authenticate
from django.http.response import JsonResponse
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from .parser import parser
import json




# activity feed code -- start
from pusher import Pusher
from django.views.decorators.csrf import csrf_exempt

# instantiate the pusher class - this is used for activity feed message
pusher = Pusher(app_id=u'525110', key=u'ea517de8755ddb1edd03', secret=u'be2bf8ae15037bde9d94', cluster=u'us2')

# instantiate the pusher class - this is used for inidividual image message
pusher1 = Pusher(app_id=u'525110', key=u'f6bea936b66e4ad47f97', secret=u'ed3e9509fce91430fcac', cluster=u'us2')

# instantiate the pusher class - this is used for brainstorm note
pusher2 = Pusher(app_id=u'525110', key=u'5da367936aa67ecdf673', secret=u'e43f21c19211c9738d6b', cluster=u'us2')

@csrf_exempt
def broadcast(request):


    pusher.trigger(u'a_channel', u'an_event', {u'name': request.POST['username'], u'message': request.POST['message'] })

    #insert into database
    msg = Message(content=request.POST['message'], posted_by=request.user);
    msg.save();

    # print(image_data)

    return JsonResponse({'success': '', 'errorMsg': True})

# activity feed code -- end


@csrf_exempt
def broadcastImageComment(request):

    pusher1.trigger(u'b_channel', u'bn_event', {u'name': request.POST['username'], u'message': request.POST['message'], u'imageid': request.POST['imagePk'] })

    #get the image id
    img = imageModel.objects.get(id=request.POST['imagePk'])
    print('image primary id type',type(img))
    #error: id is not instance of the model
    #solution: https://www.slideshare.net/BaabtraMentoringPartner/how-to-fix-must-be-an-instance-when-a-foreign-key-is-referred-django-python-mysql
    comment = imageComment(content=request.POST['message'], posted_by = request.user, imageId = img)
    comment.save()

    return JsonResponse({'success': '', 'errorMsg': True})

@csrf_exempt
def broadcastBrainstormNote(request):

    #pusher2.trigger(u'c_channel', u'cn_event', {u'name': request.POST['username'], u'message': request.POST['message']})
    pusher2.trigger(u'c_channel', u'cn_event', {u'noteID': request.POST.get('brainstormID'), u'idea': request.POST.get('idea'),
                          u'color': request.POST.get('color'), u'posTop': request.POST.get('posTop'), u'posLeft': request.POST.get('posLeft'),
                          u'posted_by':request.POST['username'],
                          u'update': 'false'})

    note = brainstormNote(brainstormID=request.POST.get('brainstormID'), ideaText=request.POST.get('idea'),
                          color=request.POST.get('color'),
                          position_top=request.POST.get('posTop'), position_left=request.POST.get('posLeft'),
                          posted_by=request.user)
    note.save()

    note = brainstormNote.objects.last()
    print(note.id)
    return JsonResponse({'id': note.id, 'errorMsg': True})



    #return JsonResponse({'success': '', 'errorMsg': True})
#in the browser: http://127.0.0.1:8000/app/

def getUsername(request):
    if request.user.is_authenticated:
        print('username :: ', request.user.get_username())
        username = request.user.get_username();
        return JsonResponse({'name': username, 'errorMsg': True})

@login_required
def index(request):
    return render(request, 'app/index.html')


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
        # user is created using the createsuperuser command
        user = authenticate(username=username, password=password)
        print(user)

        if user:
            auth_login(request, user)
            #add to user log table
            userLog = userLogTable(username = request.user, action="user click login button", type="login", input=request.POST.get('username'), pagenumber=0000)
            userLog.save();

            # member = groupInfo(activityType='gallery', activityID=1, group=0, users=request.user)
            # member.save();

            return HttpResponseRedirect('/index/')
        else:
            #return invalid login message
            userLog = userLogTable(username=request.user, action="user click login button", type="invalid login",
                                   input=request.POST.get('username'), pagenumber=0000)
            userLog.save();



            return render(request, 'app/login.html', {})
    else:
        return render(request, 'app/login.html', {})


def uploadImage(request):
    #get image from html and save it in the database
    if request.method == "POST":
        # print (request.Files) #gives the name of the <input type='file' name...>

        #get the gallery ID
        gallery_id = request.POST.get('act-id')

        #get the group ID
        group_id = request.POST.get('group-id')

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
        img = imageModel(gallery_id=gallery_id, group_id = group_id , posted_by = request.user, image=request.FILES['gallery_img'])
        # TODO: check whether the insertion was successful or not, else wrong image will be shown using the last() query
        img.save()

        # using data NOT from database
        # data = {}
        # data['gallery_id'] = gallery_id
        # data['posted_by'] = username
        # # data['posted_at'] = "{}".format(images.posted_at)
        # data['url'] = 'images/'+request.FILES['gallery_img'].name
        # image_data = json.dumps(data)

        #get the latest inserted entry from the database for this particular group
        #https://stackoverflow.com/questions/2191010/get-last-record-in-a-queryset/21247350
        images = imageModel.objects.filter(group_id=group_id).last()

        print('image url :: ',images.image.url)

        print('user ::', images.posted_by.get_username())

        # using data from database
        data = {}
        data['gallery_id'] = images.gallery_id
        data['group_id'] = images.group_id
        data['posted_by'] = images.posted_by.get_username()
        data['posted_at'] = "{}".format(images.posted_at)
        data['url'] = images.image.url
        image_data = json.dumps(data)

        # print(image_data)

        return JsonResponse({'success': image_data, 'errorMsg': True})

def getImage(request, view_id, gallery_id,group_id):

    # for pilot/study
    print("@@@@", view_id)
    if(int(view_id) == 1): #view_id = 1 means comment view
        print("@@@@inside if", view_id)
        images = imageModel.objects.exclude(group_id=group_id)
        images = images.filter(gallery_id=gallery_id)
    else:

        images = imageModel.objects.filter(gallery_id=gallery_id)
        images = images.filter(group_id=group_id)

    # for workshop
    # images = imageModel.objects.filter(group_id=group_id)
    # images = images.filter(gallery_id=gallery_id)

    image_data = serializers.serialize('json', images, use_natural_foreign_keys=True)
    #print(image_data)
    return JsonResponse({'success': image_data,  'errorMsg': True})

def getImageID(request,img_filename):
    print('file name :: ' + img_filename);

    img = imageModel.objects.filter(image='images/'+img_filename)
    print(img[0].pk)
    return JsonResponse({'imageID': img[0].pk})

def imageDelete(request, img_id):

    img = imageModel.objects.get(pk=img_id)
    # This will delete the image and all of its Entry objects.
    print(img)
    img.delete()

    return HttpResponse('deleted?')

def updateFeed(request):
    msg = Message.objects.all()
    msg_data = serializers.serialize('json', msg, use_natural_foreign_keys=True)
    return JsonResponse({'success': msg_data, 'username': request.user.get_username(),'errorMsg': True})

def updateImageFeed(request, img_id):

    print('updateImageFeed (image_id) :: ' + img_id)
    img_msg = imageComment.objects.filter(imageId_id=img_id)
    img_msg = serializers.serialize('json', img_msg, use_natural_foreign_keys=True, use_natural_primary_keys=True)
    print('hojoborolo :: ', img_msg)
    return JsonResponse({'success': img_msg, 'username': request.user.get_username(),'errorMsg': True})

def brainstormSave(request):

    note = brainstormNote(brainstormID = request.POST.get('brainstormID'), ideaText = request.POST.get('idea'), color = request.POST.get('color'),
                              position_top = request.POST.get('posTop'), position_left = request.POST.get('posLeft'), posted_by = request.user)
    note.save()

    note = brainstormNote.objects.last()
    print(note.id)
    return JsonResponse({'id': note.id,'errorMsg': True})


def brainstormGet(request,brainstorm_id):

    notes = brainstormNote.objects.filter(brainstormID=brainstorm_id)
    notes = serializers.serialize('json', notes, use_natural_foreign_keys=True)

    return JsonResponse({'success': notes})


def brainstormUpdate(request, note_id):

    note = brainstormNote.objects.filter(id=note_id)

    pusher2.trigger(u'c_channel', u'cn_event',
                    {u'noteID': note_id, u'idea': note[0].ideaText,
                     u'color': note[0].color, u'posTop': request.POST.get('top'),
                     u'posLeft': request.POST.get('left'),
                     u'posted_by': request.POST.get('username'),
                     u'update': 'true'})

    brainstormNote.objects.filter(id=note_id).update(position_top=request.POST.get('top'),
                                                     position_left=request.POST.get('left'))
    return HttpResponse('')

def brainstormDelete(request,note_id):


    print('NOTEID', note_id);

    b = brainstormNote.objects.get(pk=note_id)
    # This will delete the Blog and all of its Entry objects.
    print(b)
    b.delete()

    return HttpResponse('no delete?')


def userlog(request):


    log = userLogTable(username=request.user, action=request.POST.get('action'), type=request.POST.get('type'),
                       input=request.POST.get('input'), pagenumber=request.POST.get('pagenumber'))
    log.save()

    return HttpResponse('')



def tableEntriesSave(request):

    entries = tableChartData(posted_by = request.user, table_id = request.POST.get('table_id'), plot_type = request.POST.get('plot_type'),
                             plot_data = request.POST.get('plot_data'))
    entries.save()

    return HttpResponse('')


def submitAnswer(request):

    print(request.POST.get('answer'));
    userQuesAnswer = userQuesAnswerTable(questionIDbyPage = request.POST.get('page'), answer = request.POST.get('answer'), posted_by = request.user)
    userQuesAnswer.save()

    return HttpResponse('')


def pageParser(request):
    #CASE 4: static method - FAIL, not possible to call `cls.get` or `self.get`
    #ref: https://stackoverflow.com/questions/50806626/django-calling-one-class-method-from-another-in-class-based-view
    self = None
    print(parser.activityParser(self))
    return HttpResponse('')

def getUserList(request):
    users = User.objects.all()
    print(users)

    return HttpResponse('')

# create superuser
# https://docs.djangoproject.com/en/2.1/topics/auth/default/
def registerUser(request):
    return render(request, 'app/register.html', {})

def createUser(request):

    if request.method == "POST":
        #get username/password from the form
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = User.objects.create_user(username, '', password)
        user.save()

        #authenticate and redirect to index
        user = authenticate(username=username, password=password)
        print(user)

        if user:
            auth_login(request, user)
            return HttpResponseRedirect('/index/')
        else:
            # return invalid login message
            return render(request, 'app/login.html', {})



    # user = User.objects.create_user('ant', '', 'ant');
    # user.save();
    # user = User.objects.create_user('bee', '', 'bee');
    # user.save();
    # user = User.objects.create_user('tiger', '', 'tiger');
    # user.save();
    # user = User.objects.create_user('lion', '', 'lion');
    # user.save();
    # user = User.objects.create_user('fish', '', 'fish');
    # user.save();
    # user = User.objects.create_user('bear', '', 'bear');
    # user.save();
    # user = User.objects.create_user('fox', '', 'fox');
    # user.save();
    # user = User.objects.create_user('deer', '', 'deer');
    # user.save();
    # user = User.objects.create_user('zebra', '', 'zebra');
    # user.save();
    # user = User.objects.create_user('eagle', '', 'eagle');
    # user.save();

    return HttpResponse('')

#temp solution for pilot-1 -- start
def groupAdd(request):

    member = groupInfo(activityType='gallery', activityID=1, group=3, users=request.user)
    member.save();
    member = groupInfo(activityType='gallery', activityID=2, group=3, users=request.user)
    member.save();
    member = groupInfo(activityType='gallery', activityID=3, group=3, users=request.user)
    member.save();



    return HttpResponse('')

def getGroupID(request, act_id):
    print('line 384 From server activity id', act_id)
    groupID = groupInfo.objects.all().filter(activityID = act_id)
    print('from server group id', groupID)
    groupID = groupID.filter(users_id = request.user)
    print(type(groupID))
    print('line 358',groupID[0].group)

    return HttpResponse(groupID[0].group)

# temp solution for pilot-1 -- end

def camera(request):
    return render(request, 'app/camera.html', {})


@csrf_exempt
def userLogFromExtenstion(request):
    #https://stackoverflow.com/questions/35474259/django-middleware-making-post-request-blank
    body = request.body.decode('utf-8')  # in python 3 json.loads only accepts unicode strings
    body = json.loads(body)

    print(body)
    username = body['username'].split(' ')[0].lower()
    action = body['action']
    type = body['type']
    data = body['input']
    pagenumber = body['pagenumber']

    print(username)
    user_pk_id = User.objects.get(username=username).pk
    print (user_pk_id)

    print('from extension?', username, action, type, data, pagenumber)
    log = body
    f = open("extensionLOGfile.txt", "a")
    f.write(str(log))
    f.write('\n')

    log = userLogTable(username=User.objects.get(pk=user_pk_id), action=body['action'], type=body['type'],
                       input=body['input'], pagenumber=body['pagenumber'])
    log.save()

    return HttpResponse('')

# hacks - start

def createThirtyUser(request):

    user = User.objects.create_user('alligator', '', 'alligator');
    user.save();
    user = User.objects.create_user('ant', '', 'ant');
    user.save();
    user = User.objects.create_user('bat', '', 'bat');
    user.save();
    user = User.objects.create_user('bear', '', 'bear');
    user.save();
    user = User.objects.create_user('bee', '', 'bee');
    user.save();
    user = User.objects.create_user('buffalo', '', 'buffalo');
    user.save();
    user = User.objects.create_user('camel', '', 'camel');
    user.save();
    user = User.objects.create_user('dog', '', 'dog');
    user.save();
    user = User.objects.create_user('dolphin', '', 'dolphin');
    user.save();
    user = User.objects.create_user('duck', '', 'duck');
    user.save();
    user = User.objects.create_user('deer', '', 'deer');
    user.save();
    user = User.objects.create_user('elephant', '', 'elephant');
    user.save();
    user = User.objects.create_user('eagle', '', 'eagle');
    user.save();
    user = User.objects.create_user('fox', '', 'fox');
    user.save();
    user = User.objects.create_user('fish', '', 'fish');
    user.save();
    user = User.objects.create_user('frog', '', 'frog');
    user.save();
    user = User.objects.create_user('giraffe', '', 'giraffe');
    user.save();
    user = User.objects.create_user('hippo', '', 'hippo');
    user.save();
    user = User.objects.create_user('lion', '', 'lion');
    user.save();
    user = User.objects.create_user('kangaroo', '', 'kangaroo');
    user.save();
    user = User.objects.create_user('leopard', '', 'leopard');
    user.save();
    user = User.objects.create_user('tiger', '', 'tiger');
    user.save();
    user = User.objects.create_user('monkey', '', 'monkey');
    user.save();
    user = User.objects.create_user('panda', '', 'panda');
    user.save();
    user = User.objects.create_user('penguin', '', 'penguin');
    user.save();
    user = User.objects.create_user('rabbit', '', 'rabbit');
    user.save();
    user = User.objects.create_user('raccoon', '', 'raccoon');
    user.save();
    user = User.objects.create_user('rhino', '', 'rhino');
    user.save();
    user = User.objects.create_user('sheep', '', 'sheep');
    user.save();
    user = User.objects.create_user('squirrel', '', 'squirrel');
    user.save();
    user = User.objects.create_user('liger', '', 'liger');
    user.save();
    user = User.objects.create_user('turtle', '', 'turtle');
    user.save();
    user = User.objects.create_user('wolf', '', 'wolf');
    user.save();
    user = User.objects.create_user('zebra', '', 'zebra');
    user.save();

    return HttpResponse('')

# hacks - end


def deleteAllItems(request):
    # brainstormNote.objects.all().delete()
    # imageModel.objects.all().delete()
    Message.objects.all().delete()
    # imageComment.objects.all().delete();
    userLogTable.objects.all().delete();
    #groupInfo.objects.all().delete()

    return HttpResponse('')