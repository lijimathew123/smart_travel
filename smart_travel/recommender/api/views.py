from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendTripSerializer,TravelSearchHistorySerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from recommender.models import TravelSearchHistory
from collections import Counter

import math

from recommender.services.weather_service import get_weather
from recommender.services.places_service import (
    get_city_coords,
    get_geoapify_places,
    get_nearest_airports,
    get_nearest_hospitals,
    get_nearest_police_stations,
    get_nearest_fire_stations,
    get_nearest_ambulance_services,
)


from recommender.services.ai_service import generate_itinerary
from recommender.services.place_ranker import rank_places,personalize_score

from recommender.utils import generate_cache_key

from django.core.cache import cache

from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User




class RegisterView(APIView):
    """Create user account. JWT is obtained via /api/token/ using simplejwt."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": UserSerializer(user).data,
                    "message": "User registered successfully. Login via /api/token/ to get JWT.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class RecommendTripView(APIView):
    permission_classes = [AllowAny]



    def post(self, request):
        serializer = RecommendTripSerializer(data=request.data)
        
        # 1. Check if data is valid
        if serializer.is_valid():
            data = serializer.validated_data
            
            # 2. Define cache key inside the valid block
            cache_key = generate_cache_key(
                prefix="trip_recommendation",
                payload=data
            )

            # 3. Check Cache
            cached_response = cache.get(cache_key)
            if cached_response:
                if request.user.is_authenticated:
                    TravelSearchHistory.objects.create(
                        user=request.user,
                        destination=data.get("destination"),
                        start_date=data.get("start_date"),
                        end_date=data.get("end_date"),
                        budget=data.get("budget"),
                        travel_type=data.get("travel_type"),
                        interests=data.get("interests")
                    )
                return Response({**cached_response, "cached": True})

            # 4. Generate New Data
            destination = data.get("destination")
            weather_info = get_weather(destination)
            lat, lon = get_city_coords(destination)
            
            places = []
            emergency_places = {
                "airports": [],
                "hospitals": [],
                "police_stations": [],
                "fire_stations": [],
                "ambulance_services": [],
            }

            if lat and lon:
                places = get_geoapify_places(lat, lon)

                # Use a larger radius to improve accuracy around city clusters
                emergency_places = {
                    "airports": get_nearest_airports(lat, lon, limit=2, radius=100000),
                    "hospitals": get_nearest_hospitals(lat, lon, limit=2, radius=100000),
                    "police_stations": get_nearest_police_stations(lat, lon, limit=2, radius=100000),
                    "fire_stations": get_nearest_fire_stations(lat, lon, limit=2, radius=100000),
                    "ambulance_services": get_nearest_ambulance_services(lat, lon, limit=2, radius=100000),
                }



            ranked_places = rank_places(places)

            itinerary = generate_itinerary(
                destination=destination,
                weather=weather_info,
                places=ranked_places,
                user_input=data
            )

            final_response = {
                "message": "Trip recommendations generated successfully.",
                "destination": destination,
                "weather": weather_info,
                "places": ranked_places,
                "itinerary": itinerary,
                "emergency_places": emergency_places,
                "input": data
            }


            # 5. Save to Cache (Now inside the IF block)
            cache.set(cache_key, final_response)

            # 6. Save to History (Now inside the IF block)
            if request.user.is_authenticated:
                TravelSearchHistory.objects.create(
                    user=request.user,
                    destination=data.get("destination"),
                    start_date=data.get("start_date"),
                    end_date=data.get("end_date"),
                    budget=data.get("budget"),
                    travel_type=data.get("travel_type"),
                    interests=data.get("interests"),
                    summary=itinerary.get("summary")
                )

            return Response({**final_response, "cached": False})
        
        # 7. If serializer is NOT valid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class RecommendTripView(APIView):
#     authentication_classes = [SessionAuthentication, BasicAuthentication]
#     permission_classes = [AllowAny] 
#     def post(self,request):
#         serializer = RecommendTripSerializer(data=request.data)
#         if serializer.is_valid():
#             data = serializer.validated_data
#             cache_key = generate_cache_key(
#             prefix="trip_recommendation",
#             payload=data
#         )

#             cached_response = cache.get(cache_key)
#             if cached_response:
#                 if request.user.is_authenticated:
#                     TravelSearchHistory.objects.create(
#                         user=request.user,
#                         destination=data.get("destination"),
#                         start_date=data.get("start_date"),
#                         end_date=data.get("end_date"),
#                         budget=data.get("budget"),
#                         travel_type=data.get("travel_type"),
#                         interests=data.get("interests")
                    
#                     )
#                 return Response(
#                     {
#                         **cached_response,
#                         "cached": True
#                     }
#                 )
#             destination = data.get("destination")

#             weather_info = get_weather(destination)
#             lat, lon = get_city_coords(destination)
#             if lat and lon:
#                 places = get_geoapify_places(lat, lon)


#             ranked_places = rank_places(places)
#             itinerary = generate_itinerary(
#                 destination=destination,
#                 weather=weather_info,
#                 places=ranked_places,
#                 user_input=data
#             )

#             final_response = {
#             "message": "Trip recommendations generated successfully.",
#             "destination": destination,
#             "weather": weather_info,
#             "places": ranked_places,
#             "itinerary": itinerary,
#             "input": data
#         }

#         cache.set(cache_key, final_response)
#         if request.user.is_authenticated:
#             TravelSearchHistory.objects.create(
#                 user=request.user,
#                 destination=data.get("destination"),
#                 start_date=data.get("start_date"),
#                 end_date=data.get("end_date"),
#                 budget=data.get("budget"),
#                 travel_type=data.get("travel_type"),
#                 interests=data.get("interests"),
#                 summary=itinerary.get("summary")
#             )

#         return Response(
#             {
#                 **final_response,
#                 "cached": False
#             }
#         )



class TravelHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = TravelSearchHistory.objects.filter(user=request.user)
        serializer = TravelSearchHistorySerializer(history, many=True)
        return Response(serializer.data)
    



class PersonalizedRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

     
        history = TravelSearchHistory.objects.filter(user=user)

        if not history.exists():
            return Response(
                {"message": "No history found. Please search trips first."},
                status=400
            )

        destinations = [h.destination for h in history]
        travel_types = [h.travel_type for h in history]

        interests = []
        for h in history:
            if isinstance(h.interests, list): 
                interests.extend(h.interests)

        destination_count = Counter(destinations)
        travel_type_count = Counter(travel_types)
        interest_count = Counter(interests)

        top_destination = destination_count.most_common(1)[0][0]
        top_travel_type = travel_type_count.most_common(1)[0][0]
        top_interests = [i[0] for i in interest_count.most_common(3)]

        user_profile = {
            "interest_count": interest_count,
            "top_travel_type": top_travel_type,
            "recent_destination": history.first().destination
        }

        # -----------------------------------
        # 3. Fetch places
        # -----------------------------------
        weather_info = get_weather(top_destination)
        lat, lon = get_city_coords(top_destination)

        places = []
        if lat and lon:
            places = get_geoapify_places(lat, lon)

        if not places:
            return Response(
                {"message": "No places found for recommendation."},
                status=400
            )

        # -----------------------------------
        # 4. Base ranking (existing logic)
        # -----------------------------------
        ranked_places = rank_places(places, limit=50)  # take more for scoring

        # -----------------------------------
        # 5. Personalized scoring
        # -----------------------------------
        scored_places = []

        for place in ranked_places:
            try:
                final_score = personalize_score(place, user_profile)
                place["personalized_score"] = final_score
                scored_places.append(place)
            except Exception as e:
                # Skip bad data instead of breaking API
                continue

        # -----------------------------------
        # 6. Sort by personalized score
        # -----------------------------------
        scored_places.sort(
            key=lambda x: x.get("personalized_score", 0),
            reverse=True
        )

        # fallback safety
        if not scored_places:
            scored_places = ranked_places

        # -----------------------------------
        # 7. Final response
        # -----------------------------------
        return Response({
            "message": "Personalized recommendations generated successfully",
            "based_on": {
                "top_destination": top_destination,
                "top_travel_type": top_travel_type,
                "top_interests": top_interests
            },
            "weather": weather_info,
            "places": scored_places[:10]
        })


