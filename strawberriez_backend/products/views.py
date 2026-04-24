from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Product, Category
from .serializers import ProductListSerializer, RecursiveCategorySerializer

@api_view(['GET'])
def product_list(request):
    """
    Получение списка товаров с фильтрацией, сортировкой и пагинацией
    GET /api/products/?category=2&min_price=500&ordering=-price
    """
    # Начинаем с ВСЕХ активных товаров
    products = Product.objects.filter(is_active=True)
    
    # Фильтрация по категории
    category_id = request.query_params.get('category')
    if category_id:
        products = products.filter(category_id=category_id)
    
    # Фильтрация по бренду
    brand_id = request.query_params.get('brand')
    if brand_id:
        products = products.filter(brand_id=brand_id)
    
    # Фильтрация по цене
    min_price = request.query_params.get('min_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    
    max_price = request.query_params.get('max_price')
    if max_price:
        products = products.filter(price__lte=max_price)
    
    # Поиск по названию
    search = request.query_params.get('search')
    if search:
        products = products.filter(name__icontains=search)
    
    # Сортировка (по умолчанию — новинки сверху)
    ordering = request.query_params.get('ordering', '-created_at')
    products = products.order_by(ordering)
    
    # Пагинация
    paginator = PageNumberPagination()
    paginator.page_size = 24
    result_page = paginator.paginate_queryset(products, request)
    
    # Сериализация и возврат
    serializer = ProductListSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def category_list(request):
    """
    Получение дерева категорий
    GET /api/categories/
    """
    # Получаем только корневые категории (у которых нет родителя)
    root_categories = Category.objects.filter(parent=None, is_active=True)
    serializer = RecursiveCategorySerializer(root_categories, many=True)
    return Response(serializer.data)