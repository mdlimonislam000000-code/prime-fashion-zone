'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Search, 
  Eye, 
  Loader2,
  ArrowUpDown,
  Zap,
  Check
} from 'lucide-react';

// আলাদা করা মোডাল কম্পোনেন্টগুলো ইম্পোর্ট করা হলো
import MenDetailsButtonModal from './MenDetailsButtonModal';
import MenOrderButtonModal from './MenOrderButtonModal';

const ManCollectionUser = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  
  // Wishlist & Cart Product IDs State
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [cartProductIds, setCartProductIds] = useState([]);
  
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Buy Now Modal States
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ইউজারের ইউনিক আইডি (currentUser থেকে নেওয়া)
  const userId = currentUser?.id || currentUser?._id;

  // ব্যাকএন্ড API থেকে প্রোডাক্ট ফেচ করা
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (sortOption) queryParams.append('sort', sortOption);

      const res = await fetch(`http://localhost:5000/api/man-collection?${queryParams.toString()}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ইউজারের উইশলিস্ট প্রোডাক্টের আইডিগুলো ফেচ করা
  const fetchWishlistIds = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.wishlist)) {
        const ids = data.wishlist.map(item => item.productId.toString());
        setWishlistProductIds(ids);
      }
    } catch (error) {
      console.error("Error fetching wishlist IDs:", error);
    }
  };

  // ইউজারের কার্ট প্রোডাক্টের আইডিগুলো ফেচ করা
  const fetchCartIds = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.cart)) {
        const ids = data.cart.map(item => item.productId.toString());
        setCartProductIds(ids);
      }
    } catch (error) {
      console.error("Error fetching cart IDs:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  useEffect(() => {
    if (userId) {
      fetchWishlistIds();
      fetchCartIds();
    }
  }, [userId]);

  // লাভ (Wishlist) টগল বাটন হ্যান্ডলার
  const toggleWishlist = async (product) => {
    if (!userId) {
      alert("Please log in to add products to your wishlist!");
      return;
    }

    const productId = product._id || product.id;

    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          product: product
        })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.action === 'added') {
          setWishlistProductIds(prev => [...prev, productId.toString()]);
        } else if (data.action === 'removed') {
          setWishlistProductIds(prev => prev.filter(id => id !== productId.toString()));
        }
      } else {
        alert(data.error || "Failed to update wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  // ----------------------------------------------------
  // ADD TO BAG HANDLER (কনসোলে ডেটা প্রিন্ট ও ব্যাকএন্ডে পাঠানো)
  // ----------------------------------------------------
  const handleAddToCart = async (product) => {
    console.log("=== Add to Bag Triggered ===");
    console.log("Current User Object:", currentUser);
    console.log("Selected Product Object:", product);

    if (!currentUser || (!currentUser._id && !currentUser.id)) {
      alert("Please log in to add products to your bag!");
      return;
    }

    const productId = product._id || product.id;
    const selectedSize = product.sizes?.[0] || 'M';

    const requestBody = {
      user: currentUser,
      product: product,
      selectedSize: selectedSize
    };

    console.log("Payload Sending to Backend (/api/cart):", requestBody);

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (res.ok) {
        setCartProductIds(prev => {
          if (!prev.includes(productId.toString())) {
            return [...prev, productId.toString()];
          }
          return prev;
        });
      } else {
        alert(data.error || "Failed to add to bag");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleOpenBuyModal = (product) => {
    setSelectedProduct(product);
    setBuyModalOpen(true);
    setQuickViewProduct(null); 
  };

  const categories = ['All', 'Formal & Casual', 'Winter Collection', 'Streetwear', 'Casual Wear'];

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 lg:w-72">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs py-2 pl-8 pr-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0">
                Search
              </button>
            </form>

            <div className="relative shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading / Grid States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold">Loading collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <p className="text-sm font-bold text-slate-600">No products found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => {
              const productId = product._id;
              const isWishlisted = wishlistProductIds.includes(productId.toString());
              const isInCart = cartProductIds.includes(productId.toString());

              const discountPercent = product.discountPrice > product.price 
                ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100) 
                : 0;

              const availableSizes = product.sizes && product.sizes.length > 0 
                ? product.sizes 
                : ['S', 'M', 'L', 'XL', 'XXL'];

              return (
                <div key={productId} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {discountPercent > 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        -{discountPercent}%
                      </span>
                    )}

                    <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>

                    {/* Wishlist / Love Button */}
                    <button 
                      onClick={() => toggleWishlist(product)} 
                      className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                        isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>

                    <button onClick={() => setQuickViewProduct(product)} className="absolute inset-x-3 bottom-12 py-2 bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-[11px] rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] sm:text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{product.rating || 5}</span>
                        </div>
                      </div>

                      {/* --- প্রাইস এবং অ্যাভেইলেবল সাইজ পাশাপাশি সেকশন --- */}
                      <div className="flex items-center justify-between gap-2 mt-2">
                        {/* Price Area */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs sm:text-base font-black text-purple-600">
                            ৳{Number(product.price).toLocaleString()}
                          </span>
                          {product.discountPrice > product.price && (
                            <span className="text-[10px] text-slate-400 line-through font-bold">
                              ৳{Number(product.discountPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Available Sizes (Pasapasi) */}
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          {availableSizes.map((sz) => (
                            <span 
                              key={sz} 
                              className="text-[9px] font-black text-slate-700 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded-md uppercase"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleAddToCart(product)} 
                        className={`flex items-center justify-center gap-1 font-bold text-[10px] sm:text-xs py-2 rounded-xl transition-all cursor-pointer ${
                          isInCart 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                        }`}
                      >
                        {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        <span>{isInCart ? 'Added in Bag' : 'Add Bag'}</span>
                      </button>
                      <button 
                        onClick={() => handleOpenBuyModal(product)} 
                        className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] sm:text-xs py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Quick View Details Modal Component --- */}
        <MenDetailsButtonModal 
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
          onOpenBuyModal={(prod) => handleOpenBuyModal(prod)}
        />

        {/* --- Buy Now / Checkout Modal Component --- */}
        <MenOrderButtonModal 
          isOpen={buyModalOpen}
          onClose={() => setBuyModalOpen(false)}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
        />

      </div>
    </div>
  );
};

export default ManCollectionUser;