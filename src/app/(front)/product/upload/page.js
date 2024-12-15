"use client";
import { useState } from 'react';
import axios from 'axios';

export default function ProductUpload() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    brand: '',
    sizes: '',
    colors: '',
    stock: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
    setErrors({ ...errors, files: '' }); // Clear error message for file input
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error message for the specific field
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (selectedFiles.length === 0) newErrors.files = 'At least one image is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return; // Stop if form is not valid

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    selectedFiles.forEach((file) => form.append('images', file)); // Append files with the 'images' key

    try {
      const response = await axios.post('http://localhost:3000/api/products/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Product uploaded successfully:', response.data);
      } else {
        console.error('Error uploading product:', response);
      }
    } catch (error) {
      console.error('Error uploading product:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleInputChange}
      />
      {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
      <input
        type="text"
        name="subCategory"
        placeholder="subCategory"
        value={formData.subCategory}
        onChange={handleInputChange}
      />
      {errors.subCategory && <p style={{ color: 'red' }}>{errors.subCategory}</p>}

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleInputChange}
      />
      {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}

      <input type="file" multiple onChange={handleFileChange} />
      {errors.files && <p style={{ color: 'red' }}>{errors.files}</p>}

      <button onClick={handleUpload} disabled={!formData.name || !formData.category || !formData.price || selectedFiles.length === 0}>
        Upload Product
      </button>
    </div>
  );
}
