from django.db.models import query
from django.db.models import Q
from project.models import FeedbackRequest, Feedback, User


class FeedbackRequestManager:
	""" Helper methods related to FeedbackRequests. """

	@staticmethod
	def query_for_user(user: User, include_edited: bool = False):
		""" Query all FeedbackRequests available to the current user.

			Includes those that are finished if requested. Otherwise, includes only unfinished.
		"""
		queryset = FeedbackRequest.objects.filter(assigned_editors=user)
		if not include_edited:
			queryset = queryset.filter(
				Q(feedback_request__isnull=True) |
				Q(
					feedback_request__status=Feedback.PICKED_UP_FEEDBACK,
					feedback_request__edited_by=user
				)
			).exclude(
				feedback_request__status=Feedback.RETURN_FEEDBACK
			)
		return queryset
