'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Trash2, Heart, ShoppingBag, Eye, Zap, HelpCircle } from 'lucide-react';
import MenDetailsButtonModal from '@/components/user/nav-item/MenDetailsButtonModal';
import MenOrderButtonModal from '@/components/user/nav-item/MenOrderButtonModal';

const Whislist = () => {
  const { data: session, isPending: sessionLoading } = useSession();
  const currentUser = session?.user;
  const userId = currentUser?.id || currentUser?._id;

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);

  // Post-purchase delete confirmation modal states for wishlist
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState(null);

  // User-er wishlist items fetch kora
  const fetchUserWishlist = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.wishlist)) {
        setWishlistItems(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching user wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserWishlist();
    }
  }, [userId]);

  // Wishlist item delete / remove handler
  const handleDeleteWishlistItem = async (wishlistId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${wishlistId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistId));
      } else {
        alert(data.error || "Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Delete wishlist error:", error);
    }
  };

  // Add to Bag handler from wishlist
  const handleAddToCartFromWishlist = async (item) => {
    if (!currentUser) {
      alert("Please log in to add products to your bag!");
      return;
    }

    const productData = {
      _id: item.productId,
      name: item.productName || item.name,
      image: item.productImage || item.image,
      price: item.productPrice || item.price,
      discountPrice: item.discountPrice || 0,
      category: item.category || '',
      stock: item.stock || 0,
      sizes: item.sizes || ['M'],
      detailsPics: item.detailsPics || [],
      description: item.description || '',
      productDetails: item.productDetails || [],
      rating: item.rating || 5
    };

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser,
          product: productData,
          selectedSize: productData.sizes[0]
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added to your bag successfully!");
      } else {
        alert(data.error || "Failed to add to bag");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong!");
    }
  };

  // Buy Now modal open
  const handleOpenBuyModal = (item) => {
    setSelectedWishlistItem(item);
    setBuyModalOpen(true);
    setQuickViewProduct(null);
  };

  // Order success handler
  const handleOrderSuccess = () => {
    const orderedItem = selectedWishlistItem;
    setBuyModalOpen(false);
    setSelectedWishlistItem(null);

    // Order সফল হওয়ার পর ডিলিট কনফার্মেশন মোডাল ওপেন করা
    if (orderedItem) {
      setItemPendingDelete(orderedItem);
      setShowDeleteModal(true);
    }
  };

  // কনফার্মেশন মোডাল থেকে User এর চয়েস হ্যান্ডেল করা
  const handleConfirmDeleteChoice = async (shouldDelete) => {
    if (shouldDelete && itemPendingDelete?._id) {
      await handleDeleteWishlistItem(itemPendingDelete._id);
      alert("Order placed successfully and removed from your wishlist!");
    } else {
      alert("Order placed successfully! Item kept in your wishlist.");
    }
    setShowDeleteModal(false);
    setItemPendingDelete(null);
  };

  if (sessionLoading || (userId && loading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-16 font-sans">
        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-700">Please log in to view your wishlist!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans relative">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <span>My Wishlist ({wishlistItems.length})</span>
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Your wishlist is empty!</h3>
          <p className="text-xs text-slate-400">Save products you love to your wishlist.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => {
            const productData = {
              _id: item.productId,
              name: item.productName || item.name,
              image: item.productImage || item.image,
              price: item.productPrice || item.price,
              discountPrice: item.discountPrice || 0,
              category: item.category || '',
              stock: item.stock || 0,
              sizes: item.sizes || ['M'],
              detailsPics: item.detailsPics || [],
              description: item.description || '',
              productDetails: item.productDetails || [],
              rating: item.rating || 5
            };

            return (
              <div 
                key={item._id} 
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img 
                    src={item.productImage} 
                    alt={item.productName} 
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{item.productName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Category: <span className="font-bold">{item.category || 'General'}</span></p>
                    <p className="text-xs font-black text-purple-600 mt-1">৳{Number(item.productPrice).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  {/* See Details Button */}
                  <button 
                    onClick={() => setQuickViewProduct(productData)}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>See Details</span>
                  </button>

                  {/* Add to Bag Button */}
                  <button 
                    onClick={() => handleAddToCartFromWishlist(item)}
                    className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Bag</span>
                  </button>

                  {/* Buy Now Button */}
                  <button 
                    onClick={() => handleOpenBuyModal(item)}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Buy Now</span>
                  </button>

                  {/* Remove Button */}
                  <button 
                    onClick={() => {
                      if (confirm("Remove this item from wishlist?")) {
                        handleDeleteWishlistItem(item._id);
                      }
                    }}
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Details Modal */}
      <MenDetailsButtonModal 
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        onOpenBuyModal={(prod) => {
          const matchedItem = wishlistItems.find(i => i.productId.toString() === prod._id.toString());
          if (matchedItem) handleOpenBuyModal(matchedItem);
        }}
      />

      {/* Buy Now Order Modal */}
      <MenOrderButtonModal 
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        selectedProduct={selectedWishlistItem ? {
          _id: selectedWishlistItem.productId,
          name: selectedWishlistItem.productName,
          image: selectedWishlistItem.productImage,
          price: selectedWishlistItem.productPrice,
          discountPrice: selectedWishlistItem.discountPrice || 0,
          category: selectedWishlistItem.category || '',
          stock: selectedWishlistItem.stock || 0,
          sizes: selectedWishlistItem.sizes || ['M'],
          detailsPics: selectedWishlistItem.detailsPics || [],
          description: selectedWishlistItem.description || '',
          productDetails: selectedWishlistItem.productDetails || [],
          rating: selectedWishlistItem.rating || 5
        } : null}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* --- Post-Purchase Delete Confirmation Modal for Wishlist --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Remove from Wishlist?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have successfully purchased this product. Would you like to remove it from your wishlist?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleConfirmDeleteChoice(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                Keep It
              </button>
              <button
                onClick={() => handleConfirmDeleteChoice(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whislist;