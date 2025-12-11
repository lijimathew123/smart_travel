from rest_framework import serializers

class RecommendTripSerializer(serializers.Serializer):
    destination = serializers.CharField(max_length=100)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    budget = serializers.ChoiceField(choices=['low', 'medium', 'high'])
    travel_type = serializers.ChoiceField(choices=['family','solo','couple'])
    interests = serializers.ListField(child=serializers.CharField())