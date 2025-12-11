from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendTripSerializer


class RecommendTripView(APIView):
    def post(self,request):
        serializer = RecommendTripSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            return Response({
                "message": "Trip recommendations generated successfully.",
                "data": data
            }, status=status.HTTP_200_OK)