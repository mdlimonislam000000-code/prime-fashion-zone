'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Plus, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary } from '@/utils/uploadImage';

const WomanProductEditModal = ({ 
  isEditModalOpen, 
  setIsEditModalOpen, 
  productToEdit, 
  onProductUpdated 
}) => {
  if (!isEditModalOpen || !productToEdit) return null;

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

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [detailsImagePreviews, setDetailsImagePreviews] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customSections, setCustomSections] = useState([{ heading: '', points: [''] }]);

  // Women's category suggestions
  const categorySuggestions = [
    'Traditional', 
    'Western', 
    'Summer Special', 
    'Party Wear', 
    'Casual Wear',
    'Activewear'
  ];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        price: productToEdit.price || '',
        discountPrice: productToEdit.discountPrice || '',
        stock: productToEdit.stock || '',
        sizes: [...(productToEdit.sizes || [])],
        description: productToEdit.description || '',
        image: productToEdit.image || '',
        detailsPics: [...(productToEdit.detailsPics || [])]
      });

      setMainImagePreview(productToEdit.image || null);
      setDetailsImagePreviews([...(productToEdit.detailsPics || [])]);

      // Safe deep copy to prevent React internal state mutation crash
      if (productToEdit.productDetails && productToEdit.productDetails.length > 0) {
        const clonedSections = productToEdit.productDetails.map(sec => ({
          heading: sec.heading || '',
          points: [...(sec.points || [''])]
        }));
        setCustomSections(clonedSections);
      } else {
        setCustomSections([{ heading: '', points: [''] }]);
      }
    }
  }, [productToEdit]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDetailsImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const existingFiles = formData.detailFiles || [];
      const updatedFiles = [...existingFiles, ...files];
      setFormData(prev => ({ ...prev, detailFiles: updatedFiles }));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setDetailsImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const existingDetailsPics = formData.detailsPics || [];
    if (index < existingDetailsPics.length) {
      const updatedPics = existingDetailsPics.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, detailsPics: updatedPics }));
    } else {
      const fileIndex = index - existingDetailsPics.length;
      const updatedFiles = (formData.detailFiles || []).filter((_, i) => i !== fileIndex);
      setFormData(prev => ({ ...prev, detailFiles: updatedFiles }));
    }
    const updatedPreviews = detailsImagePreviews.filter((_, i) => i !== index);
    setDetailsImagePreviews(updatedPreviews);
  };

  const handleSizeToggle = (size) => {
    const currentSizes = formData.sizes || [];
    if (currentSizes.includes(size)) {
      setFormData(prev => ({ ...prev, sizes: currentSizes.filter(s => s !== size) }));
    } else {
      setFormData(prev => ({ ...prev, sizes: [...currentSizes, size] }));
    }
  };

  const handleAddSection = () => {
    if (customSections.length < 5) {
      setCustomSections([...customSections, { heading: '', points: [''] }]);
    }
  };

  const handleRemoveSection = (secIndex) => {
    setCustomSections(customSections.filter((_, i) => i !== secIndex));
  };

  const handleHeadingChange = (secIndex, value) => {
    const updated = customSections.map((sec, i) => 
      i === secIndex ? { ...sec, heading: value } : sec
    );
    setCustomSections(updated);
  };

  const handlePointChange = (secIndex, pointIndex, value) => {
    const updated = customSections.map((sec, i) => {
      if (i === secIndex) {
        const newPoints = [...sec.points];
        newPoints[pointIndex] = value;
        return { ...sec, points: newPoints };
      }
      return sec;
    });
    setCustomSections(updated);
  };

  const handleAddPoint = (secIndex) => {
    const updated = customSections.map((sec, i) => {
      if (i === secIndex && sec.points.length < 7) {
        return { ...sec, points: [...sec.points, ''] };
      }
      return sec;
    });
    setCustomSections(updated);
  };

  const handleRemovePoint = (secIndex, pointIndex) => {
    const updated = customSections.map((sec, i) => {
      if (i === secIndex && sec.points.length > 1) {
        return { ...sec, points: sec.points.filter((_, pIdx) => pIdx !== pointIndex) };
      }
      return sec;
    });
    setCustomSections(updated);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let mainImageUrl = formData.image; 
      let detailImageUrls = [...(formData.detailsPics || [])];

      if (formData.imageFile) {
        const uploadedMainUrl = await uploadImageToCloudinary(formData.imageFile);
        if (uploadedMainUrl) mainImageUrl = uploadedMainUrl;
      }

      if (formData.detailFiles && formData.detailFiles.length > 0) {
        for (let file of formData.detailFiles) {
          const url = await uploadImageToCloudinary(file);
          if (url) detailImageUrls.push(url);
        }
      }

      const updatedProductData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice || 0),
        stock: Number(formData.stock),
        sizes: formData.sizes || [],
        image: mainImageUrl,        
        detailsPics: detailImageUrls, 
        description: formData.description || '',
        productDetails: customSections.filter(sec => sec.heading.trim() !== ''),
      };

      const productId = productToEdit._id || productToEdit.id;
      const response = await fetch(`http://localhost:5000/api/women-collection/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Women product updated successfully!');
        setIsEditModalOpen(false);
        if (onProductUpdated) onProductUpdated();
      } else {
        alert(result.error || 'Failed to update women product.');
      }

    } catch (error) {
      console.error("Error updating women product:", error);
      alert('Something went wrong!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 font-sans text-xs my-8 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-black text-slate-900 text-base">Edit Women Product</h3>
          <button 
            onClick={() => setIsEditModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateProduct} className="space-y-3.5">
          
          {/* Product Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <label className="font-bold text-slate-700 block mb-1">Category</label>
            <input
              type="text"
              required
              value={formData.category}
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

          {/* Price, Discount, Stock */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Price (৳)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Discount (৳)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Available Sizes</label>
            <div className="flex items-center gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => {
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

          {/* Main Image */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Image</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-purple-300 hover:border-purple-500 p-3 rounded-xl cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-600">Change Main Image</span>
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
              </label>

              {mainImagePreview && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Details/Gallery Images</label>
            <label className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-purple-300 hover:border-purple-500 p-3 rounded-xl cursor-pointer transition-all">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-600">Add More Gallery Images</span>
              <input type="file" accept="image/*" multiple onChange={handleDetailsImagesChange} className="hidden" />
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
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Short Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium resize-none"
            ></textarea>
          </div>

          {/* Dynamic Sections */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-900 text-sm">Product Specification Sections</label>
            </div>

            {customSections.map((section, secIndex) => (
              <div key={secIndex} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 relative">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Section Heading"
                    value={section.heading}
                    onChange={(e) => handleHeadingChange(secIndex, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {customSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(secIndex)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pl-2 border-l-2 border-purple-200">
                  {section.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Point ${pointIndex + 1}`}
                        value={point}
                        onChange={(e) => handlePointChange(secIndex, pointIndex, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      {section.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePoint(secIndex, pointIndex)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {section.points.length < 7 && (
                    <button
                      type="button"
                      onClick={() => handleAddPoint(secIndex)}
                      className="text-purple-600 hover:text-purple-700 font-bold text-[11px] flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                    </button>
                  )}
                </div>
              </div>
            ))}

            {customSections.length < 5 && (
              <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-2.5 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 text-purple-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Details Section
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{uploading ? 'Updating...' : 'Update Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default WomanProductEditModal;