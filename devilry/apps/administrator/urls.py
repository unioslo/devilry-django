from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

from restful import administrator_restful
from views import MainView
import editorviews

urlpatterns = patterns('devilry.apps.administrator',
                       url(r'^$',
                           login_required(MainView.as_view()),
                           name='administrator'),
                      url(r'^editors/node/(?P<id>\d+)?',
                          editorviews.NodeEditor.as_view(),
                          name='administrator-editors-node'))
urlpatterns += administrator_restful
