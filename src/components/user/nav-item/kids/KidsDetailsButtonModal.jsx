'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingBag, Zap, Ruler } from 'lucide-react';

const KidsDetailsButtonModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onOpenBuyModal,
  currentUser 
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [sizeUnit, setSizeUnit] = useState('INCH');
  const [addingToCart, setAddingToCart] = useState(false);

  const discountPercent = product.discountPrice > product.price 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100) 
    : 0;

  // Kids Specific Size Chart Data (Age / Size based)
  const sizeChartData = {
    '2-3Y': { chest: sizeUnit === 'INCH' ? '22' : '56', length: sizeUnit === 'INCH' ? '15' : '38', sleeve: sizeUnit === 'INCH' ? '13' : '33' },
    '4-5Y': { chest: sizeUnit === 'INCH' ? '24' : '61', length: sizeUnit === 'INCH' ? '17' : '43', sleeve: sizeUnit === 'INCH' ? '14' : '35.5' },
    '6-7Y': { chest: sizeUnit === 'INCH' ? '26' : '66', length: sizeUnit === 'INCH' ? '19' : '48', sleeve: sizeUnit === 'INCH' ? '15' : '38' },
    '8-9Y': { chest: sizeUnit === 'INCH' ? '28' : '71', length: sizeUnit === 'INCH' ? '21' : '53', sleeve: sizeUnit === 'INCH' ? '16' : '40.5' },
  };

  // Add to Bag / Cart API Handler
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const userId = currentUser?._id || currentUser?.id || "guest-user";
      const selectedSize = product.sizes?.[0] || '2-3Y';

      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser,
          userId: userId,
          product: product,
          selectedSize: selectedSize
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Added ${product.name} to bag!`);
        onClose();
      } else {
        alert(data.error || "Failed to add item to bag");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong!");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-hidden">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 cursor-pointer z-20">
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images (Independent Scroll / Fixed while right scrolls) */}
        <div className="w-full md:w-1/2 flex flex-col gap-3 overflow-y-auto max-h-[calc(85vh-3rem)] pr-1">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {product.detailsPics && product.detailsPics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 shrink-0">
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

        {/* Right Side: Product Info & Scrollable Content with Sticky Buttons */}
        <div className="w-full md:w-1/2 flex flex-col justify-between max-h-[calc(85vh-3rem)] overflow-hidden relative">
          
          {/* Scrollable Details Area */}
          <div className="overflow-y-auto pr-2 space-y-4 flex-1 pb-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  {product.category || 'Kids Collection'}
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

              {/* --- Kids Size Chart Section --- */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-purple-600" />
                    <span>Kids Size & Age Guide</span>
                  </span>
                  
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

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <th className="p-2 font-bold">Age/Size</th>
                        <th className="p-2 font-bold">Chest</th>
                        <th className="p-2 font-bold">Length</th>
                        <th className="p-2 font-bold">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {['2-3Y', '4-5Y', '6-7Y', '8-9Y'].map((sz) => (
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

              {/* --- Description & Database Details Sections --- */}
              <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                {product.description && (
                  <div>
                    <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-wider mb-1">Description</h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.productDetails && product.productDetails.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    {product.productDetails.map((section, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                        <h5 className="text-[11px] font-black uppercase text-purple-700 tracking-wider">
                          {section.heading}
                        </h5>
                        <ul className="space-y-1 pl-1">
                          {section.points.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"></span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Buttons at the Bottom */}
          <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 grid grid-cols-2 gap-2 shrink-0">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl cursor-pointer transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addingToCart ? 'Adding...' : 'Add to Bag'}</span>
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

export default KidsDetailsButtonModal;