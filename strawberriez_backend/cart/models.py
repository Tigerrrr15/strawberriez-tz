from django.db import models
from products.models import Product

class Cart(models.Model):
    """Корзина пользователя"""
    user_id = models.IntegerField(null=True, blank=True, verbose_name="ID пользователя")
    session_id = models.CharField(max_length=255, verbose_name="ID сессии")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"

    @property
    def total_sum(self):
        """Считает общую сумму корзины"""
        return sum(item.total_price for item in self.items.all())

class CartItem(models.Model):
    """Элемент корзины (конкретный товар)"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name="Корзина")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    size = models.CharField(max_length=10, verbose_name="Размер")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Элемент корзины"
        verbose_name_plural = "Элементы корзины"
        unique_together = ['cart', 'product', 'size']  # Один размер одного товара только один раз

    @property
    def total_price(self):
        """Считает сумму для этого товара"""
        return self.product.price * self.quantity