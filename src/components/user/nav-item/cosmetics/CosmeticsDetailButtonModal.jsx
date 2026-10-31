'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingBag, Zap, Ruler } from 'lucide-react';

const CosmeticsDetailsButtonModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onOpenBuyModal 
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [sizeUnit, setSizeUnit] = useState('ML');

  const discountPercent = product.discountPrice > product.price 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100) 
    : 0;

  const sizeChartData = {
    '50ml': { volume: sizeUnit === 'ML' ? '50 ml' : '1.7 fl oz', type: 'Compact / Travel', usage: '1-2 months' },
    '100ml': { volume: sizeUnit === 'ML' ? '100 ml' : '3.4 fl oz', type: 'Standard Size', usage: '3-4 months' },
    'Standard': { volume: sizeUnit === 'ML' ? '150 ml' : '5.1 fl oz', type: 'Regular Bottle', usage: '4-5 months' },
    'Pack of 2': { volume: sizeUnit === 'ML' ? '2 x 100 ml' : 'Double Pack', type: 'Combo Offer', usage: '6+ months' },
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

              {/* --- Volume / Usage Guide Section --- */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-purple-600" />
                    <span>Volume & Usage Guide</span>
                  </span>
                  
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSizeUnit('ML')}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${sizeUnit === 'ML' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      ML
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizeUnit('OZ')}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${sizeUnit === 'OZ' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      OZ
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <th className="p-2 font-bold">Variant</th>
                        <th className="p-2 font-bold">Volume</th>
                        <th className="p-2 font-bold">Type</th>
                        <th className="p-2 font-bold">Est. Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {['50ml', '100ml', 'Standard', 'Pack of 2'].map((sz) => (
                        sizeChartData[sz] && (
                          <tr key={sz} className="hover:bg-slate-50/50">
                            <td className="p-2 font-bold text-slate-900">{sz}</td>
                            <td className="p-2">{sizeChartData[sz].volume}</td>
                            <td className="p-2">{sizeChartData[sz].type}</td>
                            <td className="p-2">{sizeChartData[sz].usage}</td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- Description & Database Details Sections (Bullet Points) --- */}
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

export default CosmeticsDetailsButtonModal;