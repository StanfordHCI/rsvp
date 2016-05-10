from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import images.views

urlpatterns = [
    url(r'^$', images.views.Task, name='task'),
    url(r'^results', images.views.Results, name='results'),
    url(r'^resutls', images.views.Resutls, name='resutls'),
    url(r'^data', images.views.Data, name='data'),
    url(r'^update', images.views.Update, name='update'),
]
