'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Package, ShoppingBag, MapPin, Phone, User, Trash2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(`http://localhost:5000/api/orders?page=${pageNum}&limit=10`);
      const data = await res.json();
      
      if (data && Array.isArray(data.orders)) {
        if (isLoadMore) {
          setOrders(prev => [...prev, ...data.orders]);
        } else {
          setOrders(data.orders);
        }

        if (pageNum >= data.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Status Change Handler (PATCH API Call)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong!");
    }
  };

  // Order Delete Handler (DELETE API Call)
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
        // UI থেকে অর্ডারটি সাথে সাথে সরিয়ে ফেলা
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      } else {
        alert(result.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Something went wrong!");
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, true);
  };

  // Filter Logic ('all', 'pending', 'shipping', 'delivered')
  const filteredOrders = orders.filter(order => {
    const status = (order.status || 'pending').toLowerCase();
    if (filterStatus === 'all') return true;
    return status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              Manage Orders ({orders.length})
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Update status, view IDs, or delete orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {['all', 'pending', 'shipping', 'delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterStatus === tab ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Orders Found</h3>
            <p className="text-xs text-slate-400">No orders match this filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const currentStatus = (order.status || 'pending').toLowerCase();
                
                return (
                  <div key={order._id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                    
                    {/* Top Row: Order ID, Status Dropdown & Delete Button */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                        {order.orderId || 'ORD-N/A'}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-xl border outline-none cursor-pointer transition-all ${
                            currentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            currentStatus === 'shipping' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipping">Shipping</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-start gap-3">
                      <img src={order.productImage} alt="" className="w-16 h-16 object-cover rounded-2xl border border-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">{order.productName}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Category: {order.productCategory || 'General'}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-extrabold text-purple-600">৳{order.totalPrice?.toLocaleString()}</span>
                          <span className="text-slate-400 text-[10px]">({order.quantity} pcs, Size: {order.selectedSize})</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>{order.userName || order.Name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{order.address}</span>
                      </div>
                    </div>

                    {/* Subtotal & Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                      <span>Delivery: ৳{order.deliveryCharge || 130}</span>
                      <span className="font-bold text-slate-700">Subtotal: ৳{order.subtotal?.toLocaleString()}</span>
                    </div>

                  </div>
                );
              })}
            </div>

            {hasMore && filterStatus === 'all' && (
              <div className="text-center pt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loadingMore ? 'Loading more...' : 'Load More Orders'}</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Orders;