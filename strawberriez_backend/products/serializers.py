from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_main']

class ProductListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка товаров (карточки)"""
    main_image_url = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'old_price', 
            'main_image_url', 'is_in_stock'
        ]
    
    def get_main_image_url(self, obj):
        """Получает URL главного изображения"""
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return main_image.image_url
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной страницы товара"""
    images = ProductImageSerializer(many=True, read_only=True)
    is_in_stock = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class RecursiveCategorySerializer(serializers.ModelSerializer):
    """Рекурсивный сериализатор для дерева категорий"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'children']
    
    def get_children(self, obj):
        """ПОЛУЧАЕТ ДОЧЕРНИЕ КАТЕГОРИИ"""
        children = obj.children.filter(is_active=True)
        return RecursiveCategorySerializer(children, many=True).data