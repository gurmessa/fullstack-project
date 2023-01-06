from django.conf import settings


def context_processor(request):
	""" Context processor to inject context into every render operation. """

	return {
		"FRONTEND_URL": settings.FRONTEND_URL,
		"ENV": settings.ENV,
		"DEBUG": settings.DEBUG,
		"STATIC_URL": settings.STATIC_URL,
	}
