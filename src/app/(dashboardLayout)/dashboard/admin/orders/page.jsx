'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Package, ShoppingBag, MapPin, Phone, User, Trash2, Search, Calendar, ChevronUp, ChevronDown, AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedOrders, setExpandedOrders] = useState({});

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

  // Status Change Handler
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

  // Order Delete Handler
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
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

  // Toggle Accordion
  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const status = (order.status || 'pending').toLowerCase();
    const matchesStatus = filterStatus === 'all' ? true : status === filterStatus;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (order.orderId && order.orderId.toLowerCase().includes(query)) ||
      (order.productName && order.productName.toLowerCase().includes(query)) ||
      (order.userName && order.userName.toLowerCase().includes(query)) ||
      (order.Name && order.Name.toLowerCase().includes(query)) ||
      (order.phone && order.phone.toLowerCase().includes(query)) ||
      (order._id && order._id.toLowerCase().includes(query)) ||
      (order.userId && order.userId.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header, Search & Tabs */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-600" />
                Manage Orders ({filteredOrders.length})
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Track, search, update status, or delete orders</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
              {['all', 'pending', 'shipping', 'delivered', 'not-received'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    filterStatus === tab ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, User ID, Product Name, Customer Name or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs py-2.5 pl-9 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
            <p className="text-xs text-slate-400">No orders match your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const currentStatus = (order.status || 'pending').toLowerCase();
              const isExpanded = !!expandedOrders[order._id];
              
              // পরিসংখ্যান ডেটা (backend থেকে আসা বা ডিফল্ট মান)
              const totalOrdersCount = Number(order.totalOrders || 1);
              const unreceivedCount = Number(order.unreceivedCount || 0);
              const unreceivedHistory = order.unreceivedHistory || []; // [{date: '...', productName: '...'}]

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
                  
                  {/* Cikon Line Summary */}
                  <div 
                    onClick={() => toggleExpand(order._id)}
                    className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={order.productImage} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-purple-700">{order.orderId || 'ORD-N/A'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{order.productName}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Customer: <span className="font-bold text-slate-700">{order.userName || order.Name}</span> ({order.phone})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                        currentStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
                        currentStatus === 'shipping' ? 'bg-blue-50 text-blue-700' :
                        currentStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {currentStatus}
                      </span>

                      {/* Arrow Icon */}
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4 text-xs">
                      
                      {/* Top Action Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            MongoDB ID: {order._id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${
                              currentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              currentStatus === 'shipping' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              currentStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                            <option value="not-received">Not-Received</option>
                          </select>

                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* User Profile, Total Orders, Unreceived Count & Alerts */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={order.userProfilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
                              alt="User Profile" 
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-sm"
                            />
                            <div>
                              <h4 className="font-black text-slate-900 text-sm">{order.userName || order.Name}</h4>
                              <p className="text-[11px] text-slate-400 font-mono">User ID: {order.userId || 'N/A'}</p>
                              <p className="text-[11px] text-slate-500">{order.userEmail || 'No email provided'}</p>
                            </div>
                          </div>

                          {/* Stats Badge: Mot Order & Receive na korar sonkha */}
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-center">
                              <span className="text-[9px] font-bold text-slate-500 block">Mot Order</span>
                              <span className="text-xs font-black text-purple-700">{totalOrdersCount} bar</span>
                            </div>
                            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-center">
                              <span className="text-[9px] font-bold text-slate-500 block">Receive koreni</span>
                              <span className="text-xs font-black text-rose-700">{unreceivedCount} bar</span>
                            </div>
                          </div>
                        </div>

                        {/* Red / Yellow Alert Banner */}
                        {unreceivedCount >= 3 ? (
                          <div className="px-3.5 py-2 rounded-xl bg-red-500 text-white flex items-center gap-2 shadow-sm animate-pulse">
                            <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                            <span className="font-black text-[11px] uppercase tracking-wider">
                              Red Alert: Customer porapor {unreceivedCount} bar order receive kareni!
                            </span>
                          </div>
                        ) : unreceivedCount === 2 ? (
                          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-900 flex items-center gap-2 shadow-sm">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-900" />
                            <span className="font-extrabold text-[11px] uppercase tracking-wider">
                              Yellow Alert: Customer porapor 2 bar order receive kareni!
                            </span>
                          </div>
                        ) : (
                          <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                            <span className="font-bold text-[11px]">Regular Customer (Safe history)</span>
                          </div>
                        )}

                        {/* Unreceived History List (Kto tarikhe ki order kore receive koreni) */}
                        {unreceivedHistory.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-rose-600 tracking-wider block">
                              Unreceived Order History:
                            </span>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {unreceivedHistory.map((item, hIndex) => (
                                <div key={hIndex} className="flex items-center justify-between bg-rose-50/60 px-3 py-1.5 rounded-lg border border-rose-100 text-[11px]">
                                  <span className="font-bold text-slate-800">{item.productName || 'Apparel Item'}</span>
                                  <span className="text-rose-600 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product & Delivery Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Product Specifications</h5>
                          <div className="space-y-1 text-slate-700 font-medium">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Category:</span>
                              <span className="font-bold uppercase text-slate-800">{order.productCategory || 'General'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Selected Size:</span>
                              <span className="font-bold uppercase text-slate-800">{order.selectedSize || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Quantity:</span>
                              <span className="font-bold text-slate-800">{order.quantity || 1} pcs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Unit Price:</span>
                              <span className="font-bold text-slate-800">৳{order.productPrice?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Delivery & Bill Summary</h5>
                          <div className="space-y-1.5 text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-bold">{order.phone}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span className="font-medium">{order.address}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-slate-900 text-xs">
                              <span>Total Payable (incl. ৳{order.deliveryCharge || 130} delivery):</span>
                              <span className="text-purple-600">৳{order.totalPrice?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Order Timestamp: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}</span>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

            {hasMore && filterStatus === 'all' && searchQuery === '' && (
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
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;