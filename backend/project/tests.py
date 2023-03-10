import uuid
import json

from typing import Optional
from django.utils import timezone
from faker import Faker

from django.test import TestCase
from django.urls import reverse
from django.contrib import auth

from project.models import Essay, FeedbackRequest, User, Feedback

USER_PASSWORD = '12345'
JSON = 'application/json'


def user_factory(is_superuser=False):
	fake = Faker()
	email = fake.email()
	u = User.objects.create(
		first_name=fake.first_name(),
		last_name=fake.last_name(),
		username=email,
		email=email,
		is_superuser=is_superuser,
		is_staff=is_superuser
	)
	u.set_password(USER_PASSWORD)
	u.save()
	return u


def essay_factory(revision_of: Optional[Essay] = None):
	fake = Faker()
	admin_user = User.objects.filter(is_superuser=True).first()
	return Essay.objects.create(
		name=' '.join(fake.words(nb=5)),
		uploaded_by=admin_user,
		content=fake.paragraph(nb_sentences=5),
		revision_of=revision_of,
	)


def feedback_request_factory(essay: Essay, assign=False):
	""" Create a feedback request. """
	feedback_request = FeedbackRequest.objects.create(essay=essay, deadline=timezone.now())
	if assign:
		feedback_request.assigned_editors(*User.objects.all())
	return feedback_request


def feedback_factory(essay: Essay, feedback_request: FeedbackRequest, user: User, with_comment=True):
	""" Create a feedback """
	fake = Faker()
	feedback = Feedback(
		essay=essay,
		feedback_request=feedback_request,
		edited_by=user,
		started_at=timezone.now()
	)	
	if with_comment:
		feedback.comment = fake.paragraph(nb_sentences=3),
	feedback.save()
	return feedback


class AuthenticationTestCase(TestCase):
	""" Test user authentication: login and logout. """

	def setUp(self):
		self.user = user_factory()

	def test_login(self):
		""" Check that login is functional. """
		url = reverse('user-login')

		# The user can load the /login/ page
		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed('project/login.html')

		# The user cannot login with incorrect credentials
		data = {'username': self.user.username, 'password': 'WRONG'}
		response = self.client.post(url, data=json.dumps(data), content_type=JSON)
		self.assertEqual(response.status_code, 403)

		# The user can login with correct credentials
		data = {'username': self.user.username, 'password': USER_PASSWORD}
		response = self.client.post(url, data=json.dumps(data), content_type=JSON)
		self.assertEqual(response.status_code, 204)
		user = auth.get_user(self.client)
		self.assertTrue(user.is_authenticated)

	def test_logout(self):
		""" Check that logout is functional. """
		url = reverse('user-logout')
		self.client.force_login(self.user)

		# Logging out logs out the user
		response = self.client.post(url)
		self.assertEqual(response.status_code, 204)
		user = auth.get_user(self.client)
		self.assertFalse(user.is_authenticated)


class PlatformTestCase(TestCase):
	""" Verify that the platform is able to be loaded. """

	def setUp(self):
		self.user = user_factory()

	def test_load_platform(self):
		url = reverse('platform')

		# Loading the platform fails if the user is not authenticated
		response = self.client.get(url)
		self.assertEqual(response.status_code, 403)

		# Loading the platform works if the user is not authenticated
		self.client.force_login(self.user)
		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed('project/platform.html')


class FeedbackRequestViewTestCase(TestCase):
	""" Test feedback request views. """

	def setUp(self):
		self.user = user_factory()
		self.other_user = user_factory()
		self.admin = user_factory(is_superuser=True)
		self.old_essay = essay_factory()
		self.essay = essay_factory(revision_of=self.old_essay)

	def test_list_matched_feedback_requests(self):
		""" Test listing feedback requests matched with the a user. """
		url = reverse('feedback-request-list')

		# Must be authenticated to access feedback requests
		response = self.client.get(url)
		self.assertEqual(response.status_code, 403)

		self.client.force_login(self.user)

		# The user sees requests matched with them, not requests matched with others
		fr_matched_with_editor = feedback_request_factory(self.essay)
		fr_matched_with_editor.assigned_editors.add(self.user)
		fr_not_matched_with_editor = feedback_request_factory(self.old_essay)
		fr_not_matched_with_editor.assigned_editors.add(self.admin)

		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		data = json.loads(response.content)
		self.assertEqual(len(data), 1)
		self.assertEqual(data[0].get('pk'), fr_matched_with_editor.pk)
		self.assertIsInstance(data[0].get('essay'), dict)

		picked = [d['picked']for d in data if d['pk']==fr_matched_with_editor.pk][0]
		self.assertEqual(picked, False)
		

		# The user sees requests they have picked
		essay2 = essay_factory()
		picked_feedback_request = feedback_request_factory(essay2)
		picked_feedback_request.assigned_editors.add(self.user)
		feedback_factory(self.essay, picked_feedback_request, self.user)

		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		data = json.loads(response.content)
		essay_feedback_request_ids = [d['pk'] for d in data]
		self.assertIn(picked_feedback_request.pk, essay_feedback_request_ids)
		
		picked = [d['picked']for d in data if d['pk']==picked_feedback_request.pk][0]
		self.assertEqual(picked, True)
		

		# The user can not see requests that others picked
		essay3 = essay_factory()
		other_user_picked_feedback_request = feedback_request_factory(essay3)
		other_user_picked_feedback_request.assigned_editors.add(self.user)
		picked_up_feedback_with_other_user = feedback_factory(essay3, other_user_picked_feedback_request, self.other_user)

		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		data = json.loads(response.content)
		essay_feedback_request_ids = [d['pk'] for d in data]
		self.assertNotIn(other_user_picked_feedback_request.pk, essay_feedback_request_ids)


		# The user does not see requests that a feed back has been returned
		essay4 = essay_factory()
		returned_feedback_request = feedback_request_factory(essay4)
		returned_feedback_request.assigned_editors.add(self.user)
		returned_feedback = feedback_factory(essay4, returned_feedback_request, self.user)
		returned_feedback.status = Feedback.RETURN_FEEDBACK
		returned_feedback.save()

		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		data = json.loads(response.content)
		essay_feedback_request_ids = [d['pk'] for d in data]
		self.assertNotIn(returned_feedback_request.pk, essay_feedback_request_ids)





class ReturnFeedbackViewTestCase(TestCase):
	""" Test feedback request views. """
	def setUp(self):
		self.user = user_factory()
		self.admin = user_factory(is_superuser=True)
		self.old_essay = essay_factory()
		self.essay = essay_factory(revision_of=self.old_essay)

	def test_feedback(self):	
		# The user sees requests matched with them, not requests matched with others
		feedback_request = feedback_request_factory(self.essay)
		feedback_request.assigned_editors.add(self.user)
		feedback = feedback_factory(self.essay, feedback_request, self.user, False)

		url = reverse('return-feedback', kwargs={'pk': feedback_request.pk})

		fake = Faker()
		data = {'comment': fake.paragraph(nb_sentences=3)}
		
		self.client.force_login(self.user)
		response = self.client.put(url, data=json.dumps(data), content_type=JSON)
		self.assertEqual(response.status_code, 200)
		feedback = Feedback.objects.get(pk=feedback.pk)
		self.assertEqual(data['comment'], feedback.comment)
		self.assertEqual(Feedback.RETURN_FEEDBACK, feedback.status)


class PickupFeedbackViewTestCase(TestCase):
	""" Test pickupfeedback  views. """
	def setUp(self):
		self.user = user_factory()
		self.admin = user_factory(is_superuser=True)
		self.old_essay = essay_factory()
		self.essay = essay_factory(revision_of=self.old_essay)

	def test_pickup_feedback_request(self):	
		# The user sees requests matched with them, not requests matched with others
		feedback_request = feedback_request_factory(self.essay)
		feedback_request.assigned_editors.add(self.user)

		url = reverse('pickup-feedback')

		data = {'feedback_request': feedback_request.pk}
		
		self.client.force_login(self.user)
		response = self.client.post(url, data=json.dumps(data), content_type=JSON)
		self.assertEqual(response.status_code, 201)
		feedback = Feedback.objects.last()

		self.assertEqual(self.user, feedback.edited_by)




class FeedbackRequestRetrieveAPIViewTestCase(TestCase):
	""" Test pickupfeedback  views. """
	def setUp(self):
		self.user = user_factory()
		self.admin = user_factory(is_superuser=True)
		self.older_essay= essay_factory()
		self.old_essay = essay_factory(revision_of=self.older_essay)
		self.essay = essay_factory(revision_of=self.old_essay)

	def test_pickup_feedback_request(self):	
		older_feedback_request = feedback_request_factory(self.older_essay)
		older_feedback_request.assigned_editors.add(self.user)
		older_feedback = feedback_factory(self.older_essay, older_feedback_request, self.user)
		
		old_feedback_request = feedback_request_factory(self.old_essay)
		old_feedback_request.assigned_editors.add(self.user)
		old_feedback = feedback_factory(self.old_essay, old_feedback_request, self.user)
		
		essay_feedback_request = feedback_request_factory(self.essay)
		essay_feedback_request.assigned_editors.add(self.user)
		essay_feedback = feedback_factory(self.essay, essay_feedback_request, self.user, False)
		
		url = reverse('feedback-request-detail', kwargs={'pk':essay_feedback_request.pk })

		
		self.client.force_login(self.user)
		response = self.client.get(url)
		data = json.loads(response.content)
		
		self.assertEqual(data['essay']['pk'], self.essay.pk)
		self.assertEqual(data['essay']['revision_of']['pk'], self.old_essay.pk)
		self.assertEqual(data['essay']['revision_of']['revision_of']['pk'], self.older_essay.pk)

		
		print(data)