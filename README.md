# UbicosAppServer
pythonanywhere configuration: https://www.youtube.com/watch?v=Y4c4ickks2A

1. Go to the bash and clone the repository: https://github.com/hcilabasu/UbicosAppServer
2. Create Virtual Environment: mkvirtualenv --python=/usr/bin/python3.6 myenv
3. Install Django: pip install django
4. Install corsheaders: pip install django-cors-headers
5. Under the 'Web' tab, create a new Web-Application and configure the virtual environment just created above
6. Configure the wsgi.py file by setting up the path for this project ('/home/hcilabasu/UbicosApp/textbook') and also Django_Settings_Module (textbook.settings)
7. In the Django Project settings.py, add 'hcilabasu.pythonanywhere.com' in ALLOWED_HOST array.
8. Reload the server.
9. (setting the static files): https://blog.pythonanywhere.com/60/
9.a. In pythonanywhere add the following two url-directory pair
/static/admin/ - /usr/local/lib/python2.7/dist-packages/django/contrib/admin/media
/static/ - /home/hcilabasu/UbicosApp/textbook/app/static
10. Reload the server.

(pusher library installation)
1. Go inside the virtual environment using the bash console
2. pip install pusher
3. reload the applicatin
