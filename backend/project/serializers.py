from rest_framework import serializers

from project.models import Essay, FeedbackRequest


class EssaySerializer(serializers.ModelSerializer):
	""" Serialize an Essay. """

	class Meta:
		model = Essay
		fields = (
			'pk',
			'name',
			'uploaded_by',
			'content',
			'revision_of',
		)


class FeedbackRequestSerializer(serializers.ModelSerializer):
	""" Serialize a FeedbackRequest. """

	essay = EssaySerializer()

	class Meta:
		model = FeedbackRequest
		fields = ('pk', 'essay', 'edited', 'deadline')
