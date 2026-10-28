'use client';

import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadImageToCloudinary } from '@/utils/uploadImage';


const ManProductAddModal = ({ 
  isAddModalOpen, 
  setIsAddModalOpen, 
  formData, 
  setFormData, 
  onProductAdded 
}) => {
  if (!isAddModalOpen) return null;

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [detailsImagePreviews, setDetailsImagePreviews] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Predefined category suggestions
  const categorySuggestions = [
    'Formal & Casual', 
    'Winter Collection', 
    'Streetwear', 
    'Casual Wear', 
    'Summer Special',
    'Activewear'
  ];

  // Main Image File Upload Handler
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove Main Image
  const handleRemoveMainImage = () => {
    setFormData({ ...formData, imageFile: null });
    setMainImagePreview(null);
  };

  // Details Images Upload Handler (Multiple accumulation & Previews)
  const handleDetailsImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const existingFiles = formData.detailFiles || [];
      const updatedFiles = [...existingFiles, ...files];
      setFormData({ ...formData, detailFiles: updatedFiles });

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setDetailsImagePreviews([...detailsImagePreviews, ...newPreviews]);
    }
  };

  // Remove specific gallery image
  const handleRemoveGalleryImage = (index) => {
    const updatedFiles = (formData.detailFiles || []).filter((_, i) => i !== index);
    const updatedPreviews = detailsImagePreviews.filter((_, i) => i !== index);
    
    setFormData({ ...formData, detailFiles: updatedFiles });
    setDetailsImagePreviews(updatedPreviews);
  };

  // Size Toggle Handler
  const handleSizeToggle = (size) => {
    const currentSizes = formData.sizes || [];
    if (currentSizes.includes(size)) {
      setFormData({ ...formData, sizes: currentSizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...currentSizes, size] });
    }
  };

  // Form Submit Handler: Cloudinary Upload & Save to Database with Default Rating
  const handleFormSubmitAndSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let mainImageUrl = formData.image || ''; 
      let detailImageUrls = formData.detailsPics || [];

      // ১. মেইন ইমেজ ক্লাউডিনারিতে আপলোড
      if (formData.imageFile) {
        console.log("Uploading main image to Cloudinary...");
        const uploadedMainUrl = await uploadImageToCloudinary(formData.imageFile);
        if (uploadedMainUrl) mainImageUrl = uploadedMainUrl;
      }

      // ২. গ্যালারি ইমেজগুলো ক্লাউডিনারিতে আপলোড
      if (formData.detailFiles && formData.detailFiles.length > 0) {
        console.log("Uploading gallery images to Cloudinary...");
        for (let file of formData.detailFiles) {
          const url = await uploadImageToCloudinary(file);
          if (url) detailImageUrls.push(url);
        }
      }

      // ৩. ডাটাবেজে পাঠানোর ফাইনাল অবজেক্ট (যেখানে ইউজার পেজের জন্য rating যোগ করা হয়েছে)
      const finalProductData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice || 0),
        stock: Number(formData.stock),
        sizes: formData.sizes || [],
        image: mainImageUrl,         
        detailsPics: detailImageUrls, 
        description: formData.description || '',
        rating: 5, // এটি ইউজার সাইডে রেটিং দেখানোর জন্য ডিফল্টভাবে সেভ হবে
      };

      console.log("Saving product to database...", finalProductData);

      // ৪. ব্যাকএন্ড এপিআই-তে পাঠানো
      const response = await fetch('http://localhost:5000/api/man-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalProductData),
      });

      const result = await response.json();

      if (response.ok && (result.acknowledged || result.insertedId || result.success)) {
        alert('Product added successfully!');
        setIsAddModalOpen(false);
        
        // ফর্ম রিসেট
        setFormData({});
        setMainImagePreview(null);
        setDetailsImagePreviews([]);
        
        if (onProductAdded) onProductAdded();
      } else {
        alert('Failed to save product in database.');
      }

    } catch (error) {
      console.error("Error during image upload or database save:", error);
      alert('Something went wrong! Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 font-sans text-xs my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-black text-slate-900 text-base">Add New Product</h3>
          <button 
            onClick={() => setIsAddModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmitAndSave} className="space-y-3.5">
          
          {/* Product Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Premium Casual Slim Fit Shirt"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Category Input with Suggestions */}
          <div className="relative">
            <label className="font-bold text-slate-700 block mb-1">Category</label>
            <input
              type="text"
              required
              placeholder="Type or select category..."
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            
            {showSuggestions && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {categorySuggestions
                  .filter(cat => cat.toLowerCase().includes((formData.category || '').toLowerCase()))
                  .map((cat, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        setFormData({ ...formData, category: cat });
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-purple-50 hover:text-purple-600 font-semibold cursor-pointer transition-colors"
                    >
                      {cat}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price, Discount Price & Stock */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Price (৳)</label>
              <input
                type="number"
                required
                placeholder="1450"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Discount (৳)</label>
              <input
                type="number"
                placeholder="1200"
                value={formData.discountPrice || ''}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock</label>
              <input
                type="number"
                required
                placeholder="20"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Available Sizes</label>
            <div className="flex items-center gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const isSelected = (formData.sizes || []).includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Image (Select from Device)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-purple-300 hover:border-purple-500 p-3 rounded-xl cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-600">Choose Main Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  required={!mainImagePreview}
                  onChange={handleMainImageChange} 
                  className="hidden" 
                />
              </label>

              {mainImagePreview && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 group">
                  <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveMainImage}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove main image"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Details/Gallery Images (Multiple Select & Deletable)</label>
            <label className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-purple-300 hover:border-purple-500 p-3 rounded-xl cursor-pointer transition-all">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-600">Choose Gallery Images</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleDetailsImagesChange} 
                className="hidden" 
              />
            </label>

            {detailsImagePreviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-2">
                {detailsImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 group">
                    <img src={src} alt={`Detail ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Detailed Description</label>
            <textarea
              rows="3"
              placeholder="Write full specifications and details here..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              {uploading ? 'Saving Product...' : 'Save Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManProductAddModal;