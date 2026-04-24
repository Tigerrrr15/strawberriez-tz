from django.db import models

class Category(models.Model):
    """Категории товаров"""
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL-идентификатор")
    parent = models.ForeignKey(
        'self',                     # Ссылается сама на себя (вложенность)
        on_delete=models.CASCADE,   # При удалении родителя удаляются дети
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Родительская категория"
    )
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name

class Brand(models.Model):
    """Бренды товаров"""
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL-идентификатор")
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)

    class Meta:
        verbose_name = "Бренд"
        verbose_name_plural = "Бренды"

    def __str__(self):
        return self.name

class Product(models.Model):
    """Товары в каталоге"""
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL-идентификатор")
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Старая цена")
    
    # Связи с другими таблицами
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products', verbose_name="Бренд")
    
    stock = models.IntegerField(default=0, verbose_name="Остаток")
    sku = models.CharField(max_length=100, unique=True, verbose_name="Артикул")
    
    # Флаги состояния
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    is_new = models.BooleanField(default=False, verbose_name="Новинка")
    is_sale = models.BooleanField(default=False, verbose_name="Распродажа")
    
    views_count = models.IntegerField(default=0, verbose_name="Просмотры")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def is_in_stock(self):
        """Проверяет, есть ли товар в наличии"""
        return self.stock > 0

    @property
    def main_image(self):
        """Возвращает главное фото товара"""
        first_image = self.images.filter(is_main=True).first()
        if first_image:
            return first_image.image_url
        return None

class ProductImage(models.Model):
    """Фотографии товара"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name="Товар")
    image_url = models.URLField(max_length=500, verbose_name="URL изображения")
    sort_order = models.IntegerField(default=0, verbose_name="Порядок")
    is_main = models.BooleanField(default=False, verbose_name="Главное фото")

    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"
        ordering = ['sort_order']

    def __str__(self):
        return f"Фото для {self.product.name}"