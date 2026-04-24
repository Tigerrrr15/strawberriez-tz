from django.contrib import admin
from .models import Category, Brand, Product, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'is_active', 'sort_order']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'brand', 'stock', 'is_active']
    list_filter = ['category', 'brand', 'is_active']
    search_fields = ['name', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]