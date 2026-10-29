'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  Star, 
  PackageCheck, 
  Eye,
  ArrowUpDown
} from 'lucide-react';

import ManProductAddModal from './ManProductAddModal';
import AdminEditProductMan from './AdminEditProductMan';
import MenDetailsButtonModal from '@/components/user/nav-item/MenDetailsButtonModal';

const ManCollectionAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Form State for Adding Product
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sizes: [],
    description: '',
    image: '',
    detailsPics: []
  });

  // Fetch Men Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (sortOption) queryParams.append('sort', sortOption);

      const res = await fetch(`http://localhost:5000/api/man-collection?${queryParams.toString()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching men products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Delete Product Handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/man-collection/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong!");
    }
  };

  // Open Edit Modal with Sanitized ID
  const handleEditClick = (product) => {
    const sanitizedProduct = {
      ...product,
      _id: product._id ? product._id.toString() : product.id
    };
    setProductToEdit(sanitizedProduct);
    setIsEditModalOpen(true);
  };

  const categories = ['All', 'Formal & Casual', 'Winter Collection', 'Streetwear', 'Casual Wear'];

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-purple-600" />
              <span>Men's Collection Admin</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage inventory, add new items, and edit details for Men's collection.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({});
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filter, Search & Sorting Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 lg:w-72">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs py-2 pl-8 pr-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0">
                Search
              </button>
            </form>

            <div className="relative shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading / Grid States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold">Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <p className="text-sm font-bold text-slate-600">No products found in database!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => {
              const productId = product._id;
              const discountPercent = product.discountPrice > product.price 
                ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100) 
                : 0;

              const availableSizes = product.sizes && product.sizes.length > 0 
                ? product.sizes 
                : ['S', 'M', 'L', 'XL', 'XXL'];

              return (
                <div key={productId} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {discountPercent > 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        -{discountPercent}%
                      </span>
                    )}

                    <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>

                    {/* Quick Preview Button */}
                    <button 
                      onClick={() => setQuickViewProduct(product)} 
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-white/80 backdrop-blur-md text-slate-700 hover:text-purple-600 rounded-full transition-all shadow-sm cursor-pointer"
                      title="Quick Preview"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] sm:text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{product.rating || 5}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs sm:text-base font-black text-purple-600">
                            ৳{Number(product.price).toLocaleString()}
                          </span>
                          {product.discountPrice > product.price && (
                            <span className="text-[10px] text-slate-400 line-through font-bold">
                              ৳{Number(product.discountPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          {availableSizes.map((sz) => (
                            <span 
                              key={sz} 
                              className="text-[9px] font-black text-slate-700 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded-md uppercase"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                        <span>Stock Quantity:</span>
                        <span className="text-slate-900 font-bold">{product.stock || 0} pcs</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleEditClick(product)} 
                        className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 font-bold text-[10px] sm:text-xs py-2 rounded-xl transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(productId)} 
                        className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] sm:text-xs py-2 rounded-xl transition-all cursor-pointer"
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

        {/* Add Product Modal (Man) */}
        <ManProductAddModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          formData={formData}
          setFormData={setFormData}
          onProductAdded={fetchProducts}
        />

        {/* Edit Product Modal (Man) - Conditionally Rendered with Key */}
        {isEditModalOpen && productToEdit && (
          <AdminEditProductMan
            key={productToEdit._id || 'edit-modal'}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            productToEdit={productToEdit}
            onProductUpdated={fetchProducts}
          />
        )}

        {/* Quick View Details Modal */}
        <MenDetailsButtonModal
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
          onOpenBuyModal={() => {}} 
        />

      </div>
    </div>
  );
};

export default ManCollectionAdmin;