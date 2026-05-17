from rest_framework import serializers
from recommender.models import TravelSearchHistory
from django.contrib.auth.models import User

class RecommendTripSerializer(serializers.Serializer):
    destination = serializers.CharField(max_length=100)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    budget = serializers.ChoiceField(choices=['low', 'medium', 'high'])
    travel_type = serializers.ChoiceField(choices=['family','solo','couple','friends'])
    interests = serializers.ListField(child=serializers.CharField())



class TravelSearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelSearchHistory
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","username","email")

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=("id","username","email","password")
        extra_kwargs ={"password":{"write_only":True}}

    def create(self,validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"]

        )

        return user