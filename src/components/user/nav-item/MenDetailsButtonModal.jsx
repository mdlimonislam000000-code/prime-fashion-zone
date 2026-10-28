'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingBag, Zap, Ruler } from 'lucide-react';

const MenDetailsButtonModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onOpenBuyModal 
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [sizeUnit, setSizeUnit] = useState('INCH'); // 'INCH' অথবা 'CM'

  const discountPercent = product.discountPrice > product.price 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100) 
    : 0;

  // সাইজ চার্টের মাপ ডিকশনারি (ইঞ্চ থেকে সেন্টিমিটারে কনভার্ট করার জন্য বা স্ট্যান্ডার্ড মাপ)
  const sizeChartData = {
    'M': { chest: sizeUnit === 'INCH' ? '39' : '99', length: sizeUnit === 'INCH' ? '27.5' : '70', sleeve: sizeUnit === 'INCH' ? '25.25' : '64' },
    'L': { chest: sizeUnit === 'INCH' ? '40.5' : '103', length: sizeUnit === 'INCH' ? '28.5' : '72', sleeve: sizeUnit === 'INCH' ? '26' : '66' },
    'XL': { chest: sizeUnit === 'INCH' ? '43' : '109', length: sizeUnit === 'INCH' ? '29' : '74', sleeve: sizeUnit === 'INCH' ? '26.25' : '67' },
    'XXL': { chest: sizeUnit === 'INCH' ? '45' : '114', length: sizeUnit === 'INCH' ? '30' : '76', sleeve: sizeUnit === 'INCH' ? '26.5' : '67.5' },
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 cursor-pointer z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {product.detailsPics && product.detailsPics.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div 
                onClick={() => setActiveImage(product.image)}
                className={`aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 cursor-pointer transition-all ${activeImage === product.image ? 'border-purple-600 shadow-md' : 'border-slate-200'}`}
              >
                <img src={product.image} alt="thumb" className="w-full h-full object-cover" />
              </div>
              {product.detailsPics.map((pic, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(pic)}
                  className={`aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 cursor-pointer transition-all ${activeImage === pic ? 'border-purple-600 shadow-md' : 'border-slate-200'}`}
                >
                  <img src={pic} alt="detail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Info & Size Chart */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stock: {product.stock || 'Available'}</span>
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span className="ml-1">{product.rating || 5}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-black text-purple-600">
                ৳{Number(product.price).toLocaleString()}
              </span>
              {product.discountPrice > product.price && (
                <span className="text-sm text-slate-400 line-through font-bold">
                  ৳{Number(product.discountPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* --- Size Chart Section (স্ক্রিনশটের মতো) --- */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-purple-600" />
                  <span>Size Guide</span>
                </span>
                {/* INCH / CM Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSizeUnit('INCH')}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${sizeUnit === 'INCH' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    INCH
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeUnit('CM')}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${sizeUnit === 'CM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="p-2 font-bold">Size</th>
                      <th className="p-2 font-bold">Chest (round)</th>
                      <th className="p-2 font-bold">Length</th>
                      <th className="p-2 font-bold">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {['M', 'L', 'XL', 'XXL'].map((sz) => (
                      <tr key={sz} className="hover:bg-slate-50/50">
                        <td className="p-2 font-bold text-slate-900">{sz}</td>
                        <td className="p-2">{sizeChartData[sz].chest}</td>
                        <td className="p-2">{sizeChartData[sz].length}</td>
                        <td className="p-2">{sizeChartData[sz].sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              onClick={() => {
                alert(`Added ${product.name} to bag!`);
                onClose();
              }} 
              className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>
            
            <button 
              onClick={() => {
                onClose();
                onOpenBuyModal(product);
              }} 
              className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-purple-500/25 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MenDetailsButtonModal;