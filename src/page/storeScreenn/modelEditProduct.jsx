import { 
  Modal, 
  Typography, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import React, { useState, useEffect } from 'react';

function ModelEditProduct({ dataDetail, openModal, setOpenModal, dataProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    inventory: 0,
    isActive: true,
    categories: [],
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (dataDetail && openModal) {
      setFormData({
        name: dataDetail.name || '',
        description: dataDetail.description || '',
        price: dataDetail.price || 0,
        inventory: dataDetail.inventory || 0,
        isActive: dataDetail.isActive || true,
        categories: dataDetail.categories || [],
        images: dataDetail.images || []
      });
      setSelectedCategories(dataDetail.categories?.map(cat => cat._id) || []);
      setImages(dataDetail.images || []);
    }
  }, [dataDetail, openModal]);

  // Gọi API lấy danh sách categories
  useEffect(() => {
    if (openModal) {
      fetchCategories();
    }
  }, [openModal]);

  const fetchCategories = async () => {
    try {
      // Thay thế bằng API endpoint thực của bạn
      const response = await fetch('http://localhost:9999/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadLoading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:9999/api/cloudinary-upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Thêm các URL mới vào mảng images hiện tại
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
      
      // Reset input file
      event.target.value = '';
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Upload hình ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...formData,
        categories: selectedCategories,
        images: images
      };
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Gọi API update product
      const response = await fetch(`http://localhost:9999/api/products-store/${dataDetail._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        console.log('Product updated successfully');
        handleClose();
        dataProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: 0,
      inventory: 0,
      isActive: true,
      categories: [],
      images: []
    });
    setSelectedCategories([]);
    setImages([]);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="edit-product-modal"
    >
      <Box sx={style}>
        <Typography id="edit-product-modal" variant="h6" component="h2" mb={3}>
          Chỉnh sửa sản phẩm
        </Typography>
        
        <Grid container spacing={2}>
          {/* Tên sản phẩm */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Mô tả */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Giá và số lượng */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Giá (VNĐ)"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Số lượng tồn kho"
              type="number"
              value={formData.inventory}
              onChange={(e) => handleInputChange('inventory', parseInt(e.target.value) || 0)}
              variant="outlined"
            />
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" mb={1}>
              Hình ảnh sản phẩm
            </Typography>
            
            {/* File input */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload-input"
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={uploadLoading}
              />
              <label htmlFor="image-upload-input">
                <Button 
                  variant="outlined" 
                  component="span"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? 'Đang upload...' : 'Chọn hình ảnh'}
                </Button>
              </label>
              
              {uploadLoading && (
                <Typography variant="body2" color="primary">
                  Đang upload hình ảnh...
                </Typography>
              )}
            </Box>
            
            {/* Current Images Display */}
            {images.length > 0 && (
              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Hình ảnh hiện tại ({images.length}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {images.map((imageUrl, index) => (
                    <Box key={index} position="relative">
                      <img 
                        src={imageUrl} 
                        alt={`Product ${index + 1}`} 
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleRemoveImage(index)}
                        disabled={uploadLoading}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          minWidth: 'auto',
                          width: 24,
                          height: 24,
                          p: 0,
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Trạng thái hoạt động */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              }
              label="Sản phẩm đang hoạt động"
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '80vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

export default ModelEditProduct;