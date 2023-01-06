from django.utils import timezone
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
	picked = serializers.SerializerMethodField() 

	class Meta:
		model = FeedbackRequest
		fields = ('pk', 'essay', 'deadline', 'picked', )
	
	def get_picked(self, obj):
		if(hasattr(obj, 'feedback_request')):
			if obj.feedback_request.status == Feedback.PICKED_UP_FEEDBACK:
				return True
			if obj.feedback_request.status == Feedback.RETURN_FEEDBACK:
				return False
		else:
			return False


class ReturnFeedbackSerializer(serializers.ModelSerializer):
	""" Serialize a Feedback. """
	
	class Meta:
		model = Feedback
		fields = ('comment', )

	def update(self, instance, validated_data):
		instance.comment = validated_data.get('comment', instance.comment)
		instance.status = Feedback.RETURN_FEEDBACK
		instance.ended_at = timezone.now()
		instance.save()
		return instance


class PickupFeedbackSerializer(serializers.ModelSerializer):
	""" Serialize a Feedback. """
	
	class Meta:
		model = Feedback
		fields = ('feedback_request', )

	def create(self, validated_data):
		feedback_request = validated_data['feedback_request']
		essay = feedback_request.essay 
		feedback = Feedback.objects.create(
			essay=essay,
			feedback_request=feedback_request,
			started_at=timezone.now(),
			edited_by=self.context['request'].user
		)
		return feedback


class FeedbackSerializer(serializers.ModelSerializer):
	""" Serialize Feedback request. """

	class Meta:
		model = Feedback
		fields = ('pk', 'comment', )


class FeedbackRequestDetailSerializer(serializers.ModelSerializer):
	""" Serialize Feedback request. """

	class EssaySerializer(serializers.ModelSerializer):
		revision_of = serializers.SerializerMethodField()
		feedback = FeedbackSerializer()
		
		class Meta:
			model = Essay
			fields = (
				'pk',
				'name',
				'content',
				'feedback',
				'revision_of',
			)

		def get_revision_of(self, obj):
			if obj.revision_of:
				return FeedbackRequestDetailSerializer.EssaySerializer(obj.revision_of).data
			return None

	essay = EssaySerializer()

	class Meta:
		model = FeedbackRequest
		fields = ('pk', 'essay')
