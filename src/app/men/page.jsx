'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, ShoppingBag, Heart, Star, Edit, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export default function ManCollection() {
  const { data: session, isPending } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  // ফেক ডেটা স্টেট
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Casual Slim Fit Shirt',
      price: '৳1,450',
      category: 'Formal & Casual',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Classic Black Denim Jacket',
      price: '৳2,800',
      category: 'Winter Collection',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Urban Streetwear Cotton Hoodie',
      price: '৳1,990',
      category: 'Streetwear',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
    },
  ]);

  // নতুন প্রোডাক্ট যোগ করার ফাংশন (অ্যাডমিনের জন্য)
  const handleAddProduct = () => {
    const name = prompt("Enter product name:");
    const price = prompt("Enter product price (e.g., ৳1,500):");
    const category = prompt("Enter category (e.g., Winter Wear):");
    
    if (name && price) {
      const newProduct = {
        id: Date.now(),
        name: name.trim(),
        price: price.trim(),
        category: category ? category.trim() : 'Men Collection',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        rating: 5.0,
      };
      setProducts([newProduct, ...products]);
    }
  };

  // প্রোডাক্ট ডিলিট করার ফাংশন (অ্যাডমিনের জন্য)
  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-purple-700 mb-2">
              <Sparkles size={12} />
              <span className="text-[10px] font-black tracking-wider uppercase">PRIMEzone Catalogue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Men&apos;s Collection
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Discover premium fashion, trendy outfits, and everyday wear designed for men.
            </p>
          </div>

          {/* Admin Control: Add Product Button */}
          {isAdmin && (
            <button
              onClick={handleAddProduct}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* User Wishlist or Admin Actions */}
                {!isAdmin ? (
                  <button 
                    onClick={() => alert("Added to Wishlist!")}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button 
                      onClick={() => alert(`Editing product ID: ${product.id}`)}
                      className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-blue-600 hover:bg-blue-50 shadow-sm cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-red-600 hover:bg-red-50 shadow-sm cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <div className="text-sm sm:text-base font-black text-purple-600 mt-1">
                    {product.price}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button 
                    onClick={() => alert(`Added ${product.name} to bag!`)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}