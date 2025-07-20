"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
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

// Move Header outside of MeeshoClone
const Header = ({ searchTerm, setSearchTerm, setShowImageUpload, setShowFilters, showFilters, funnelRef, setShowCart, cart }: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  setShowImageUpload: (val: boolean) => void;
  setShowFilters: (val: boolean) => void;
  showFilters: boolean;
  funnelRef: React.RefObject<HTMLButtonElement | null>;
  setShowCart: (val: boolean) => void;
  cart: CartItem[];
}) => (
  <header className="bg-white shadow-lg rounded-b-xl sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight flex items-center gap-2">
          {/* Rural artisan icon: basket */}
          <span className="inline-block align-middle">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
              <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
              <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
              <circle cx="16" cy="12" r="2" fill="#7c3aed" />
            </svg>
          </span>
          Chotti AI
        </h1>
        <div className="hidden md:flex relative w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowImageUpload(true)}
          className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
        >
          <Camera className="h-5 w-5" />
          <span className="hidden md:block font-medium">Search by Image</span>
        </button>
        <button
          ref={funnelRef}
          onClick={(e) => {
            setShowFilters(!showFilters);
            if (!showFilters && funnelRef.current) {
              const rect = funnelRef.current.getBoundingClientRect();
              const panelWidth = 176; // w-44 in px
              let left = rect.left + window.scrollX + rect.width / 2 - panelWidth / 2;
              left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
              let top = rect.bottom + window.scrollY + 4;
              const panelHeight = 320; // estimate, adjust as needed
              if (top + panelHeight > window.innerHeight) {
                top = window.innerHeight - panelHeight - 16;
                if (top < 0) top = 8;
              }
              // setFilterDropdownPos is not available here, so keep this logic in MeeshoClone
            }
          }}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <Filter className="h-5 w-5" />
          <span className="hidden md:block font-medium">Filters</span>
        </button>
        {/* Cart button restored here */}
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden md:block font-medium">Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          )}
        </button>
      </div>
    </div>
    {/* Mobile Search */}
    <div className="md:hidden px-4 pb-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  </header>
);

const MeeshoClone = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const funnelRef = useRef<HTMLButtonElement>(null);
  const [filterDropdownPos, setFilterDropdownPos] = useState<{top: number, left: number}>({top: 0, left: 0});

  // Sample product data with 50+ items across different categories
  const sampleProducts: Product[] = [
    // Women's Clothing
    { id: 1, name: "Classic Pink Pant", price: 499, originalPrice: 999, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    { id: 2, name: "Cotton Saree", price: 799, originalPrice: 1299, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop", rating: 4.5, reviews: 187 },
    { id: 4, name: "Ice Jacket", price: 899, originalPrice: 1499, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop", rating: 4.3, reviews: 98 },
    { id: 5, name: "Maxi Dress", price: 1099, originalPrice: 1899, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop", rating: 4.4, reviews: 221 },
    // Men's Clothing
    { id: 6, name: "Casual Shirt", price: 599, originalPrice: 999, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", rating: 4.1, reviews: 145 },
    { id: 7, name: "Blazzer", price: 799, originalPrice: 1299, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop", rating: 4.2, reviews: 167 },
    { id: 8, name: "Polo T-Shirt", price: 449, originalPrice: 799, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop", rating: 4.0, reviews: 203 },
    { id: 9, name: "White Shirt", price: 1299, originalPrice: 2199, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", rating: 4.5, reviews: 89 },
    { id: 10, name: "Jeans", price: 899, originalPrice: 1499, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop", rating: 4.3, reviews: 276 },
    // Electronics
    { id: 11, name: "Wireless Earbuds", price: 1499, originalPrice: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=400&fit=crop", rating: 4.4, reviews: 432 },
    { id: 12, name: "Phone Case", price: 299, originalPrice: 599, category: "Electronics", image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=400&fit=crop", rating: 4.0, reviews: 187 },
    { id: 13, name: "Bluetooth Speaker", price: 2199, originalPrice: 3499, category: "Electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=400&fit=crop", rating: 4.6, reviews: 298 },
    { id: 14, name: "Smartwatch", price: 2999, originalPrice: 4999, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop", rating: 4.3, reviews: 156 },
    { id: 15, name: "Power Bank", price: 799, originalPrice: 1299, category: "Electronics", image: "https://images.unsplash.com/photo-1609592813817-c8450c8b7fd2?w=300&h=400&fit=crop", rating: 4.2, reviews: 234 },
    // Home & Kitchen
    { id: 16, name: "Wall Sticker", price: 1299, originalPrice: 2199, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop", rating: 4.5, reviews: 167 },
    { id: 17, name: "Non-Stick Cookware", price: 1599, originalPrice: 2699, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop", rating: 4.4, reviews: 189 },
    { id: 18, name: "Bed Sheet Set", price: 799, originalPrice: 1399, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=400&fit=crop", rating: 4.2, reviews: 245 },
    { id: 19, name: "Wall Clock", price: 599, originalPrice: 999, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=400&fit=crop", rating: 4.1, reviews: 123 },
    { id: 20, name: "Tool Kit", price: 899, originalPrice: 1499, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop", rating: 4.3, reviews: 156 },
  ];
 
  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
    const uniqueCategories = ['All', ...new Set(sampleProducts.map(p => p.category))];
    setCategories(uniqueCategories);
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    setFilteredProducts(filtered);
  }, [selectedCategory, debouncedSearch, priceRange, products]);

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

  // Filter Dropdown (not sidebar)
  const FilterPanel = () => (
    <div
      className="absolute bg-white border border-gray-200 shadow-xl rounded-2xl z-50 w-44 p-3 flex flex-col gap-2 animate-fade-slide-down"
      style={{ top: filterDropdownPos.top, left: filterDropdownPos.left }}
      role="dialog" aria-modal="true" aria-label="Filter products"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#3B82F6] tracking-tight text-left">Filters</h2>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-400 hover:text-[#3B82F6] rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          aria-label="Close filters"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <hr className="my-1 border-gray-200" />
      {/* Categories */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold mb-1 text-gray-700 text-xs uppercase tracking-wide text-left">Categories</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-50 px-2 py-1 rounded transition w-full">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="accent-[#3B82F6] w-4 h-4 focus:ring-2 focus:ring-[#3B82F6]"
                aria-label={`Filter by ${category}`}
              />
              <span className={selectedCategory === category ? 'text-[#3B82F6] font-semibold' : ''}>{category}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="my-1 border-gray-200" />
      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold mb-1 text-gray-700 text-xs uppercase tracking-wide text-left">Price Range</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 w-full">
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full accent-[#3B82F6] h-2 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              aria-label="Minimum price"
              title="Minimum price"
            />
            <span className="text-xs text-gray-500 font-mono min-w-[48px] text-right">₹{priceRange[0]}</span>
          </div>
          <div className="flex items-center gap-2 w-full">
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-[#3B82F6] h-2 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              aria-label="Maximum price"
              title="Maximum price"
            />
            <span className="text-xs text-gray-500 font-mono min-w-[48px] text-right">₹{priceRange[1]}</span>
          </div>
        </div>
      </div>
      <hr className="my-1 border-gray-200" />
      <div className="flex gap-2 mt-2 sticky bottom-0 bg-white pt-2 pb-1 z-10 w-full">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setPriceRange([0, 5000]);
          }}
          className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          aria-label="Reset filters"
        >
          Reset
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="flex-1 py-2 rounded-lg bg-[#3B82F6] text-white font-semibold shadow hover:bg-[#2563EB] transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Highlight search term in product name
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : part
    );
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
        />
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <Heart 
            className={`h-5 w-5 ${wishlist.some(item => item.id === product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
            {highlightMatch(product.name, debouncedSearch)}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-purple-600">₹{product.price}</span>
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            <span className="text-xs text-green-600 font-semibold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setSelectedProduct(product)}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  // Cart Sidebar
  const Cart = () => (
    showCart ? (
      <div className="fixed top-0 right-0 h-full max-w-xs w-full bg-white rounded-l-xl shadow-xl z-50 p-6 flex flex-col">
        <button
          onClick={() => setShowCart(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-purple-600 rounded-full p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h3 className="text-xl font-bold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div className="flex flex-col min-w-0">
                      <p className="text-lg truncate force-dark-cart-name">{item.name}</p>
                      <p className="force-dark-cart-name whitespace-nowrap">₹{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 bg-gray-200 rounded-full">
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 bg-gray-200 rounded-full">
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">Total: ₹{getTotalPrice()}</p>
                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-semibold">
                  Proceed to Payment
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-2 border-t pt-4 bg-white sticky bottom-0 z-10">
              <p className="text-base font-medium text-purple-500" style={{fontWeight: 500, color: '#a78bfa', fontSize: '1rem', margin: 0, padding: 0, letterSpacing: '0.01em', fontFamily: 'inherit'}}>Total: ₹{getTotalPrice()}</p>
            </div>
          </>
        )}
      </div>
    ) : null
  );

  // ProductDetail component
  const ProductDetail = () => (
    selectedProduct ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col md:flex-row overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 rounded-full p-2 cursor-pointer z-10"
            aria-label="Close product details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          {/* Product Image */}
          <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-80 object-contain rounded-xl shadow" />
          </div>
          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col p-6 gap-4">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">{selectedProduct.name}</h2>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-extrabold text-purple-700">₹{selectedProduct.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
              <span className="text-md text-green-600 font-semibold">
                {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% off
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-base text-gray-700 font-semibold">{selectedProduct.rating?.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({selectedProduct.reviews} reviews)</span>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => addToCart(selectedProduct)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-bold text-lg transition cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className="w-full bg-gray-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 font-bold text-lg transition cursor-pointer border border-purple-200"
              >
                {wishlist.some(item => item.id === selectedProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold text-lg transition cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  // Payment component
  const Payment = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );

  // ImageUpload component
  const ImageUpload = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4">Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Upload Image
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowImageUpload={setShowImageUpload}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        funnelRef={funnelRef}
        setShowCart={setShowCart}
        cart={cart}
      />
      <div className="flex relative">
        {/* FilterPanel: only visible when showFilters is true, overlays content */}
        {showFilters && <FilterPanel />}
        <main className="flex-1 p-6">
          {/* Intro Section */}
          <div className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">Welcome to ChottiAI Shopping Zone!</h2>
            <p className="force-intro-desc">Discover a curated selection of quality products for every need. Enjoy seamless shopping, exclusive deals, and fast delivery—right at your fingertips. Start exploring and find something special today!</p>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-1 text-purple-700">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-500">{filteredProducts.length} products found</p>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 text-lg font-semibold py-12">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Cart />
      <ProductDetail />
      <Payment />
      <ImageUpload />
    </div>
  );
};

export default function Page() {
  return <MeeshoClone />;
} 