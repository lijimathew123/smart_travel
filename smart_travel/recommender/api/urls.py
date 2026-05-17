from django.urls import path
from .views import RecommendTripView,TravelHistoryView,PersonalizedRecommendationView,RegisterView,LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('recommend-trip/', RecommendTripView.as_view(), name='recommend-trip'),
    path('travel-history/', TravelHistoryView.as_view()),
    path('personalized-recommendations/', PersonalizedRecommendationView.as_view()),
]