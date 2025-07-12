"use client"
import React, { useState, useEffect } from 'react';
import { Search, Upload, ShoppingCart, Filter, Star, Heart, Camera, CreditCard, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';

// Type definitions
type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
};

type CartItem = Product & { quantity: number };

const MeeshoClone = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sample product data with 50+ items across different categories
  const sampleProducts = [
    // Women's Clothing
    { id: 1, name: "Floral Print Kurti", price: 499, originalPrice: 999, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    { id: 2, name: "Cotton Saree", price: 799, originalPrice: 1299, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop", rating: 4.5, reviews: 187 },
    { id: 3, name: "Palazzo Set", price: 649, originalPrice: 1199, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop", rating: 4.0, reviews: 156 },
    { id: 4, name: "Denim Jacket", price: 899, originalPrice: 1499, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop", rating: 4.3, reviews: 98 },
    { id: 5, name: "Maxi Dress", price: 1099, originalPrice: 1899, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop", rating: 4.4, reviews: 221 },
    
    // Men's Clothing
    { id: 6, name: "Casual Shirt", price: 599, originalPrice: 999, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", rating: 4.1, reviews: 145 },
    { id: 7, name: "Chinos Pants", price: 799, originalPrice: 1299, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop", rating: 4.2, reviews: 167 },
    { id: 8, name: "Polo T-Shirt", price: 449, originalPrice: 799, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop", rating: 4.0, reviews: 203 },
    { id: 9, name: "Formal Blazer", price: 1299, originalPrice: 2199, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", rating: 4.5, reviews: 89 },
    { id: 10, name: "Jeans", price: 899, originalPrice: 1499, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop", rating: 4.3, reviews: 276 },
    
    // Electronics
    { id: 11, name: "Wireless Earbuds", price: 1499, originalPrice: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=400&fit=crop", rating: 4.4, reviews: 432 },
    { id: 12, name: "Phone Case", price: 299, originalPrice: 599, category: "Electronics", image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=400&fit=crop", rating: 4.0, reviews: 187 },
    { id: 13, name: "Bluetooth Speaker", price: 2199, originalPrice: 3499, category: "Electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=400&fit=crop", rating: 4.6, reviews: 298 },
    { id: 14, name: "Smartwatch", price: 2999, originalPrice: 4999, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop", rating: 4.3, reviews: 156 },
    { id: 15, name: "Power Bank", price: 799, originalPrice: 1299, category: "Electronics", image: "https://images.unsplash.com/photo-1609592813817-c8450c8b7fd2?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    
    // Home & Kitchen
    { id: 16, name: "Ceramic Dinner Set", price: 1299, originalPrice: 2199, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop", rating: 4.5, reviews: 167 },
    { id: 17, name: "Non-Stick Cookware", price: 1599, originalPrice: 2699, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop", rating: 4.4, reviews: 189 },
    { id: 18, name: "Bed Sheet Set", price: 799, originalPrice: 1399, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=400&fit=crop", rating: 4.2, reviews: 245 },
    { id: 19, name: "Wall Clock", price: 599, originalPrice: 999, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=400&fit=crop", rating: 4.1, reviews: 123 },
    { id: 20, name: "Storage Containers", price: 899, originalPrice: 1499, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop", rating: 4.3, reviews: 156 },
    
    // Beauty & Personal Care
    { id: 21, name: "Skincare Kit", price: 1199, originalPrice: 1999, category: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=400&fit=crop", rating: 4.6, reviews: 278 },
    { id: 22, name: "Makeup Palette", price: 799, originalPrice: 1399, category: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=400&fit=crop", rating: 4.3, reviews: 189 },
    { id: 23, name: "Hair Dryer", price: 1599, originalPrice: 2699, category: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=300&h=400&fit=crop", rating: 4.4, reviews: 134 },
    { id: 24, name: "Perfume Set", price: 1299, originalPrice: 2199, category: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop", rating: 4.2, reviews: 167 },
    { id: 25, name: "Face Mask Kit", price: 599, originalPrice: 999, category: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=400&fit=crop", rating: 4.5, reviews: 298 },
    
    // Sports & Fitness
    { id: 26, name: "Yoga Mat", price: 799, originalPrice: 1299, category: "Sports & Fitness", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop", rating: 4.3, reviews: 234 },
    { id: 27, name: "Dumbbell Set", price: 1999, originalPrice: 3299, category: "Sports & Fitness", image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&h=400&fit=crop", rating: 4.5, reviews: 156 },
    { id: 28, name: "Running Shoes", price: 1799, originalPrice: 2999, category: "Sports & Fitness", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop", rating: 4.4, reviews: 345 },
    { id: 29, name: "Water Bottle", price: 399, originalPrice: 699, category: "Sports & Fitness", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=400&fit=crop", rating: 4.1, reviews: 189 },
    { id: 30, name: "Resistance Bands", price: 599, originalPrice: 999, category: "Sports & Fitness", image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&h=400&fit=crop", rating: 4.2, reviews: 123 },
    
    // Books & Stationery
    { id: 31, name: "Notebook Set", price: 299, originalPrice: 499, category: "Books & Stationery", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop", rating: 4.0, reviews: 234 },
    { id: 32, name: "Pen Collection", price: 199, originalPrice: 399, category: "Books & Stationery", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop", rating: 4.1, reviews: 156 },
    { id: 33, name: "Desk Organizer", price: 799, originalPrice: 1299, category: "Books & Stationery", image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop", rating: 4.3, reviews: 89 },
    { id: 34, name: "Art Supplies", price: 1299, originalPrice: 2199, category: "Books & Stationery", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop", rating: 4.5, reviews: 167 },
    { id: 35, name: "Backpack", price: 999, originalPrice: 1699, category: "Books & Stationery", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    
    // Toys & Games
    { id: 36, name: "Building Blocks", price: 599, originalPrice: 999, category: "Toys & Games", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop", rating: 4.4, reviews: 189 },
    { id: 37, name: "Board Game", price: 799, originalPrice: 1299, category: "Toys & Games", image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=400&fit=crop", rating: 4.3, reviews: 234 },
    { id: 38, name: "Puzzle Set", price: 449, originalPrice: 799, category: "Toys & Games", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop", rating: 4.2, reviews: 156 },
    { id: 39, name: "Remote Control Car", price: 1499, originalPrice: 2499, category: "Toys & Games", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop", rating: 4.5, reviews: 123 },
    { id: 40, name: "Doll House", price: 1999, originalPrice: 3299, category: "Toys & Games", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop", rating: 4.6, reviews: 89 },
    
    // Additional products to reach 50+
    { id: 41, name: "Wireless Mouse", price: 599, originalPrice: 999, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    { id: 42, name: "Laptop Stand", price: 1299, originalPrice: 1999, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=400&fit=crop", rating: 4.4, reviews: 156 },
    { id: 43, name: "LED Strip Lights", price: 799, originalPrice: 1299, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=400&fit=crop", rating: 4.3, reviews: 189 },
    { id: 44, name: "Cushion Covers", price: 299, originalPrice: 599, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=400&fit=crop", rating: 4.1, reviews: 234 },
    { id: 45, name: "Table Lamp", price: 899, originalPrice: 1499, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=400&fit=crop", rating: 4.3, reviews: 167 },
    { id: 46, name: "Sunglasses", price: 799, originalPrice: 1299, category: "Fashion Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop", rating: 4.2, reviews: 189 },
    { id: 47, name: "Handbag", price: 1299, originalPrice: 2199, category: "Fashion Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop", rating: 4.4, reviews: 156 },
    { id: 48, name: "Watch", price: 1999, originalPrice: 3299, category: "Fashion Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop", rating: 4.5, reviews: 234 },
    { id: 49, name: "Sneakers", price: 1599, originalPrice: 2699, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop", rating: 4.3, reviews: 298 },
    { id: 50, name: "Sandals", price: 799, originalPrice: 1299, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop", rating: 4.1, reviews: 167 }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
    const uniqueCategories = ['All', ...new Set(sampleProducts.map(p => p.category))];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, priceRange, products]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files && files[0];
    if (file) {
      // Simulate image search - in reality, this would use ML/AI
      const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 6);
      setFilteredProducts(randomProducts);
      setShowImageUpload(false);
    }
  };

  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-600">Chotti AI</h1>
            <div className="hidden md:flex relative flex-col">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-96 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowImageUpload(true)}
              className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span className="hidden md:block">Search by Image</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden md:block">Filters</span>
            </button>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:block">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-64`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="text-purple-600"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <Heart 
            className={`h-4 w-4 ${wishlist.some(item => item.id === product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg font-bold text-purple-600">₹{product.price}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          <span className="text-sm text-green-600">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setSelectedProduct(product)}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  const Cart = () => (
    <div className={`fixed inset-0 z-50 ${showCart ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-purple-600 font-bold">₹{item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total: ₹{getTotalPrice()}</span>
            </div>
            <button
              onClick={() => {
                setShowCart(false);
                setShowPayment(true);
              }}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ProductDetail = () => (
    <div className={`fixed inset-0 z-50 ${selectedProduct ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProduct(null)} />
      <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {selectedProduct && (
          <div className="p-4 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-4">{selectedProduct.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-purple-600">₹{selectedProduct.price}</span>
                  <span className="text-xl text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg">{selectedProduct.rating}</span>
                  <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="w-full border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    {wishlist.some(item => item.id === selectedProduct.id) ? 'Remove from' : 'Add to'} Wishlist
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Free delivery on orders above ₹499</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">7-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Payment = () => (
    <div className={`fixed inset-0 z-50 ${showPayment ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPayment(false)} />
      <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Payment</h2>
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm">{item.name} x {item.quantity}</span>
                    <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Payment successful! Order placed.');
                    setCart([]);
                    setShowPayment(false);
                  }}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Pay ₹{getTotalPrice()}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ImageUpload = () => (
    <div className={`fixed inset-0 z-50 ${showImageUpload ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowImageUpload(false)} />
      <div className="absolute inset-4 bg-white rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Search by Image</h2>
          <p className="text-gray-600 mb-6">Upload an image to find similar products</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
            </label>
          </div>
          <button
            onClick={() => setShowImageUpload(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            </div>
          )}
        </main>
      </div>
      
      <Cart />
      <ProductDetail />
      <Payment />
      <ImageUpload />
      
      {/* Overlay for mobile filters */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default function Home() {
  return <MeeshoClone />;
}