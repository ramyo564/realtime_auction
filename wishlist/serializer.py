from rest_framework import serializers
from .models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = ('id', 'user_id', 'product_id', 'wishlist_active')