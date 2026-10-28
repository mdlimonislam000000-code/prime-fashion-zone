'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Search, 
  Sparkles, 
  Star,
  Loader2
} from 'lucide-react';
import ManProductAddModal from './ManProductAddModal';

const ManCollectionAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    category: 'Formal & Casual',
    image: '',
    description: ''
  });

  // ব্যাকএন্ড API থেকে প্রোডাক্ট ফেচ করা
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/man-collection');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching admin products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add Product Handler (POST API)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      const newProductPayload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock) || 10,
        category: formData.category,
        rating: 5.0,
        image: formData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        description: formData.description || 'New trendy addition to the men collection line.'
      };

      const res = await fetch('http://localhost:5000/api/man-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductPayload),
      });

      const result = await res.json();

      if (res.ok) {
        fetchProducts(); // লিস্ট রিফ্রেশ করা
        setFormData({ name: '', price: '', stock: '', category: 'Formal & Casual', image: '', description: '' });
        setIsAddModalOpen(false);
      } else {
        alert(result.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      alert("Something went wrong!");
    }
  };

  // Delete Product Handler (DELETE API)
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/man-collection/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Something went wrong!");
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 font-sans text-xs px-2 sm:px-0 max-w-7xl mx-auto">
      
      {/* 1. Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="hidden sm:block">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700 mb-1">
            <Sparkles size={11} />
            <span className="text-[9px] font-black tracking-wider uppercase">Admin Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            ManCollection Management
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Manage inventory, add new clothing items, and update pricing for men.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-3 sm:py-2.5 rounded-xl shadow-md shadow-purple-600/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 2. Quick Stats & Search Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 flex items-center justify-center shadow-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] py-1.5 sm:py-2 pl-7 sm:pl-8 pr-2 sm:pr-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 sm:left-2.5 top-2 sm:top-2.5" />
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 shadow-sm">
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">Total Items</p>
            <h3 className="text-sm sm:text-base font-black text-slate-900">{products.length}</h3>
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 shadow-sm">
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBag className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">In Stock Units</p>
            <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
              {products.reduce((acc, item) => acc + (Number(item.stock) || 10), 0)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5 sm:gap-3 shadow-sm">
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">Catalog Valuation</p>
            <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
              ৳{products.reduce((acc, item) => acc + (Number(item.price) * (Number(item.stock) || 10)), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Loading / Products Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold">Loading collection inventory...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Products Found</h3>
          <p className="text-xs text-slate-400">Add products to your Man Collection catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-0">
          {filteredProducts.map((product) => {
            const productId = product._id;
            return (
              <div 
                key={productId}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    Stock: {product.stock || 10}
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{product.rating || 5}</span>
                      </div>
                    </div>

                    <div className="text-xs font-black text-purple-600 mt-1">
                      ৳{Number(product.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                    <button 
                      onClick={() => alert(`Editing product: ${product.name}`)}
                      className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(productId)}
                      className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modular Add Product Modal */}
      <ManProductAddModal 
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleAddProduct={handleAddProduct}
      />

    </div>
  );
};

export default ManCollectionAdmin;