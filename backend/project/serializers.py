from rest_framework import serializers

from project.models import Essay, FeedbackRequest, Feedback


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
		fields = ('pk', 'essay', 'deadline')


class ReturnFeedbackSerializer(serializers.ModelSerializer):
	""" Serialize a Feedback. """
	
	class Meta:
		model = Feedback
		fields = ('comment', )

	def update(self, instance, validated_data):
		instance.comment = validated_data.get('comment', instance.comment)
		instance.status = Feedback.RETURN_FEEDBACK
		instance.save()
		return instance
