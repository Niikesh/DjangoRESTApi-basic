from django.urls import path
from .views import get_task, create_task, update_task
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path("tasks/", get_task, name="get_task"),
    path("tasks/create/", create_task, name="create_task"),
    path("tasks/<int:pk>/", update_task, name="update_task"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]