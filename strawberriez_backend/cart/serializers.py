from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    price_per_item = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 
                  'size', 'quantity', 'price_per_item', 'total_price']
    
    def get_product_image(self, obj):
        main_image = obj.product.images.filter(is_main=True).first()
        return main_image.image_url if main_image else None