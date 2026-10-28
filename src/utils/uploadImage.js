// src/utils/images.js

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'ecommerce-uploads'); // সব জায়গায় ব্যবহারের জন্য একটি কমন Unsigned Preset

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/tw6h2utr/image/upload', {
      method: 'POST',
      body: data,
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      console.error("Cloudinary Error Details:", result);
      return null;
    }

    return result.secure_url; 
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};