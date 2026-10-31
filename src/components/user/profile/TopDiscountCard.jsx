'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Loader2, Eye } from 'lucide-react';
import MenDetailsButtonModal from '@/components/user/nav-item/MenDetailsButtonModal';

const TopDiscountSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const endpoints = [
    'http://localhost:5000/api/man-collection',
    'http://localhost:5000/api/women-collection',
    'http://localhost:5000/api/kids-collection',
    'http://localhost:5000/api/cosmetics-collection',
    'http://localhost:5000/api/sports-collection'
  ];

  useEffect(() => {
    const fetchTopDiscounts = async () => {
      try {
        setLoading(true);
        let allProducts = [];

        const responses = await Promise.allSettled(
          endpoints.map(url => fetch(url).then(res => res.json()))
        );

        responses.forEach((result) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            allProducts = [...allProducts, ...result.value];
          }
        });

        // Calculate discount percentage and sort top discounts
        const formattedProducts = allProducts.map(product => {
          const price = Number(product.price) || 0;
          const discountPrice = Number(product.discountPrice) || 0;
          const discountPercent = discountPrice > price 
            ? Math.round(((discountPrice - price) / discountPrice) * 100) 
            : 0;
          return { ...product, discountPercent };
        })
        .filter(p => p.discountPercent > 0)
        .sort((a, b) => b.discountPercent - a.discountPercent);

        // Top 10 products
        setProducts(formattedProducts.slice(0, 10));
      } catch (error) {
        console.error("Error fetching top discount products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDiscounts();
  }, []);

  // Auto Slide Effect (Every 5 Seconds)
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-center min-h-[360px]">
        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-center min-h-[360px] text-xs font-bold text-slate-400">
        No discounted products available
      </div>
    );
  }

  const activeProduct = products[currentSlide];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 relative group">
      
      {/* Header & Indicator */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Top 10 Discounts ({currentSlide + 1}/10)
        </h4>
        
        {/* Dots Indicator */}
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
          {products.map((_, idx) => (
            <span 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-3 bg-purple-600' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Image & Content Area */}
      <div 
        onClick={() => setSelectedProduct(activeProduct)}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 cursor-pointer group/img"
      >
        <img 
          src={activeProduct.image} 
          alt={activeProduct.name} 
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" /> -{activeProduct.discountPercent}% OFF
        </span>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-slate-900 p-2 rounded-full shadow-md">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Product Name & Pricing */}
      <div>
        <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
          {activeProduct.name}
        </h5>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900">
              ৳{Number(activeProduct.price).toLocaleString()}
            </span>
            {activeProduct.discountPrice > activeProduct.price && (
              <span className="text-xs text-slate-400 line-through font-bold">
                ৳{Number(activeProduct.discountPrice).toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded uppercase">
            {activeProduct.category || 'Deal'}
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-purple-600 hover:text-white text-slate-800 shadow-md transition-all cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-purple-600 hover:text-white text-slate-800 shadow-md transition-all cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Details Modal */}
      <MenDetailsButtonModal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onOpenBuyModal={() => {}}
      />
    </div>
  );
};

export default TopDiscountSlider;