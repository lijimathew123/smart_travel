from django.urls import path
from .views import RecommendTripView

urlpatterns = [
    path('recommend-trip/', RecommendTripView.as_view(), name='recommend-trip'),
]