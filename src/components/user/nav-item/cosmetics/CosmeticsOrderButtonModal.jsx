'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Zap, Ruler, Plus, Minus, ShoppingCart, Truck } from 'lucide-react';

const CosmeticsOrderButtonModal = ({ 
  isOpen, 
  onClose, 
  selectedProduct, 
  currentUser 
}) => {
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [sizeUnit, setSizeUnit] = useState('ML');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(''); // অর্ডারের নাম্বার বা আইডি স্টোর করার জন্য

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (currentUser?.name) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name
      }));
    }
  }, [currentUser]);

  if (!isOpen || !selectedProduct) return null;

  const unitPrice = Number(selectedProduct.price);
  const subtotal = unitPrice * quantity;
  const deliveryCharge = 130;
  const totalPrice = subtotal + deliveryCharge;

  const sizeChartData = {
    '50ml': { volume: sizeUnit === 'ML' ? '50 ml' : '1.7 fl oz', type: 'Compact / Travel', usage: '1-2 months' },
    '100ml': { volume: sizeUnit === 'ML' ? '100 ml' : '3.4 fl oz', type: 'Standard Size', usage: '3-4 months' },
    'Standard': { volume: sizeUnit === 'ML' ? '150 ml' : '5.1 fl oz', type: 'Regular Bottle', usage: '4-5 months' },
    'Pack of 2': { volume: sizeUnit === 'ML' ? '2 x 100 ml' : 'Double Pack', type: 'Combo Offer', usage: '6+ months' },
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      // ইউনিক অর্ডার আইডি ফ্রন্টএন্ড বা ব্যাকএন্ড থেকে জেনারেট করে পাঠানো হচ্ছে
      const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      const orderPayload = {
        orderId: generatedOrderId, // ডাটাবেজে orderId পাঠানো হলো
        userId: currentUser?.id || currentUser?._id,
        userName: currentUser?.name,
        Name: formData.fullName,
        userEmail: currentUser?.email,
        userProfilePic: currentUser?.image,
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        productCategory: selectedProduct.category || "Cosmetics",
        productPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        totalPrice: totalPrice,
        selectedSize: selectedSize, // Cosmetics Variant/Size
        phone: formData.phone,
        address: formData.address,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (res.ok) {
        setPlacedOrderId(generatedOrderId); // সফল হলে আইডি সেট করা
        setOrderSuccess(true);
        setTimeout(() => {
          setOrderSuccess(false);
          onClose();
          setFormData({ fullName: currentUser?.name || '', phone: '', address: '' });
          setQuantity(1);
        }, 3000);
      } else {
        alert(result.error || "Failed to place cosmetics order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong!");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
            <Zap className="w-5 h-5 fill-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Express Checkout (Cosmetics)</h2>
            <p className="text-[11px] text-slate-500 font-medium">Complete your cosmetics order securely with Cash on Delivery</p>
          </div>
        </div>

        {orderSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-black text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500">Your cosmetics order has been saved successfully.</p>
            {/* অর্ডার আইডি প্রদর্শন */}
            <div className="inline-block bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl mt-2">
              <span className="text-xs font-bold text-slate-600">Order ID: </span>
              <span className="text-xs font-black text-purple-700">{placedOrderId}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={selectedProduct.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">{selectedProduct.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-purple-600">৳{unitPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold">per unit</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right bg-purple-50 px-2.5 py-1.5 rounded-xl border border-purple-100 shrink-0">
                  <span className="text-[10px] font-bold text-purple-700 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-purple-600" />
                    Delivery Charge
                  </span>
                  <span className="text-[11px] font-black text-purple-800">৳130 (All Bangladesh)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-purple-600" />
                  Quantity:
                </span>
                
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-xs">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-900 px-2">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-bold">৳{deliveryCharge}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 font-black text-slate-900">
                  <span>Total Payable Amount:</span>
                  <span className="text-sm text-purple-600">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Variant / Volume:</label>
                  <button 
                    type="button" 
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[11px] font-extrabold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>{showSizeGuide ? 'Hide Volume Guide' : 'View Volume Guide'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {selectedProduct.sizes.map(sz => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        selectedSize === sz ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Volume & Usage Guide</span>
                      <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                        <button type="button" onClick={() => setSizeUnit('ML')} className={`px-2 py-0.5 rounded text-[9px] font-black ${sizeUnit === 'ML' ? 'bg-purple-600 text-white' : 'text-slate-600'}`}>ML</button>
                        <button type="button" onClick={() => setSizeUnit('OZ')} className={`px-2 py-0.5 rounded text-[9px] font-black ${sizeUnit === 'OZ' ? 'bg-purple-600 text-white' : 'text-slate-600'}`}>OZ</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-200/60 text-slate-700">
                            <th className="p-1.5">Variant</th>
                            <th className="p-1.5">Volume</th>
                            <th className="p-1.5">Type</th>
                            <th className="p-1.5">Est. Usage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-600">
                          {['50ml', '100ml', 'Standard', 'Pack of 2'].map((sz) => (
                            sizeChartData[sz] && (
                              <tr key={sz}>
                                <td className="p-1.5 font-bold text-slate-900">{sz}</td>
                                <td className="p-1.5">{sizeChartData[sz].volume}</td>
                                <td className="p-1.5">{sizeChartData[sz].type}</td>
                                <td className="p-1.5">{sizeChartData[sz].usage}</td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter your name" 
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="017XXXXXXXX" 
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address</label>
                <textarea 
                  required 
                  rows="2" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="House, Road, Area, City" 
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={orderLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-purple-500/25 cursor-pointer mt-3 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {orderLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Confirm Order (৳{totalPrice.toLocaleString()} Cash on Delivery)</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default CosmeticsOrderButtonModal;