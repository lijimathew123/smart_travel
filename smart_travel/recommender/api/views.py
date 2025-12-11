from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendTripSerializer

from recommender.services.weather_service import get_weather


class RecommendTripView(APIView):
    def post(self,request):
        serializer = RecommendTripSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            destination = data.get("destination")

            weather_info = get_weather(destination)

            return Response({
                "message": "Trip recommendations generated successfully.",
                "destination": destination,
                "weather": weather_info,
                "input": data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)