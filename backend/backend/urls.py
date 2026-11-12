"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

class HealthCheckView(APIView):
    """Liveness probe: verifies that the web service is responsive."""
    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "parakh-ai-backend",
        }, status=status.HTTP_200_OK)

class ReadinessCheckView(APIView):
    """Readiness probe: verifies database connectivity and engine status."""
    def get(self, request):
        from django.db import connection
        db_healthy = False
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()
                db_healthy = row[0] == 1
        except Exception:
            db_healthy = False

        if db_healthy:
            return Response({
                "status": "ready",
                "database": "connected",
            }, status=status.HTTP_200_OK)
        return Response({
            "status": "not_ready",
            "database": "unavailable",
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/v1/health/", HealthCheckView.as_view(), name="api-health"),
    path("api/v1/ready/", ReadinessCheckView.as_view(), name="api-ready"),
    
    path('core/', include('core.urls')),
    path('reports/', include('reports.urls')),
    path('products/', include('products.urls')),
    path('inspectors/', include('inspectors.urls')),
    path('supervisor/', include('supervisor.urls')),

    path('api/', include('rest_framework.urls')),
    # OpenAPI schema & Swagger documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # django-allauth urls
    path('_allauth/', include('allauth.headless.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)