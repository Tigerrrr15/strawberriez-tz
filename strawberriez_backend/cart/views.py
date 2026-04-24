from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartItemSerializer
from products.models import Product

def get_or_create_cart(request):
    """
    Получает или создает корзину для пользователя
    """
    # Используем session_id из кук (в реальном проекте здесь была бы авторизация)
    session_id = request.session.session_key
    if not session_id:
        request.session.create()
        session_id = request.session.session_key
    
    # Получаем или создаем корзину
    cart, created = Cart.objects.get_or_create(
        session_id=session_id,
        defaults={'user_id': request.user.id if request.user.is_authenticated else None}
    )
    return cart

@api_view(['GET'])
def cart_detail(request):
    """
    Получение содержимого корзины
    GET /api/cart/
    """
    cart = get_or_create_cart(request)
    items = cart.items.all()
    serializer = CartItemSerializer(items, many=True)
    
    return Response({
        'items': serializer.data,
        'total_sum': str(cart.total_sum)
    })

@api_view(['POST'])
def cart_add_item(request):
    """
    Добавление товара в корзину
    POST /api/cart/items/
    """
    cart = get_or_create_cart(request)
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    size = request.data.get('size')
    
    # Проверяем, что товар существует
    product = get_object_or_404(Product, id=product_id, is_active=True)
    
    # Проверяем, достаточно ли товара на складе
    if product.stock < quantity:
        return Response(
            {'error': f'Недостаточно товара на складе. Доступно: {product.stock}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Пробуем найти такой же товар в корзине
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        size=size,
        defaults={'quantity': quantity}
    )
    
    # Если уже был — увеличиваем количество
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response({
        'message': 'Товар добавлен в корзину',
        'item': serializer.data
    }, status=status.HTTP_201_CREATED)