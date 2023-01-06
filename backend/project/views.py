from django.shortcuts import redirect, render
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout

from rest_framework import views
from rest_framework import viewsets
from rest_framework import status
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from project.models import FeedbackRequest

from project.serializers import EssaySerializer, FeedbackRequestSerializer
from project.utilities import FeedbackRequestManager


class FeedbackRequestViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
	""" Viewset for views pertaining to feedback requests. """

	serializer_class = FeedbackRequestSerializer
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		return FeedbackRequestManager.query_for_user(self.request.user, include_edited=False).select_related('essay')


class HomeView(views.APIView):
	""" View that takes users who navigate to `/` to the correct page, depending on login status. """

	def get(self, *args, **kwargs):
		if self.request.user.is_authenticated:
			return redirect('/platform/')
		return redirect('/login/')


class PlatformView(views.APIView):
	""" View that renders the essay review platform. """

	permission_classes = (IsAuthenticated,)

	def get(self, *args, **kwargs):
		return render(self.request, 'project/platform.html', {})


class LoginView(views.APIView):
	""" View for user login. """

	def get(self, *args, **kwargs):
		if self.request.user.is_authenticated:
			return redirect('/platform/')
		return render(self.request, 'project/login.html', {})

	def post(self, request, *args, **kwargs):
		user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
		if user is None:
			# Auth failure
			return Response({'detail': 'Incorrect email or password.'}, status=status.HTTP_403_FORBIDDEN)
		auth_login(request, user)
		return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(views.APIView):
	""" View for user logout. """

	def post(self, request, *args, **kwargs):
		auth_logout(request)
		return Response(status=status.HTTP_204_NO_CONTENT)
