import { 
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
  FormControlLabel,
  Paper,
  Container
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchUtils from '../../utils/fetchUtils';

function AddProduct() {
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
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  // Gọi API lấy danh sách categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchUtils.get('/categories' , false);
      setCategories(response);
    }
    catch (error) {
      console.error('Error fetching categories:', error);
      alert('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
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

        const formData = new FormData();
        formData.append('file', file);

        const data = await fetchUtils.post('/cloudinary-upload', formData, true);
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
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (formData.price <= 0) {
      alert('Vui lòng nhập giá sản phẩm hợp lệ');
      return;
    }

    setSubmitLoading(true);
    try {
      const productData = {
        ...formData,
        categories: selectedCategories,
        images: images
      };

      const response = await fetchUtils.post('/products-store', productData, true);

      if (response) {
        handleReset();
        navigate('/store/productManagement');
      } else {
        throw new Error('Thêm sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" mb={4} textAlign="center">
          Thêm sản phẩm mới
        </Typography>
        
        <Grid container spacing={3}>
          {/* Tên sản phẩm */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên sản phẩm *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          {/* Mô tả */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả sản phẩm"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Giá và số lượng */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Giá sản phẩm (VNĐ) *"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              variant="outlined"
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số lượng tồn kho"
              type="number"
              value={formData.inventory}
              onChange={(e) => handleInputChange('inventory', parseInt(e.target.value) || 0)}
              variant="outlined"
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Danh mục sản phẩm</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                label="Danh mục sản phẩm"
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
            <Typography variant="h6" mb={2}>
              Hình ảnh sản phẩm
            </Typography>
            
            {/* File input */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
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
                  variant="contained" 
                  component="span"
                  disabled={uploadLoading}
                  size="large"
                  sx={{ 
                    backgroundColor: '#d32f2f',
                    '&:hover': { backgroundColor: '#b71c1c' }
                  }}
                >
                  {uploadLoading ? 'Đang upload...' : 'Chọn hình ảnh'}
                </Button>
              </label>
              
              {uploadLoading && (
                <Typography variant="body2" color="error">
                  Đang upload hình ảnh...
                </Typography>
              )}
            </Box>
            
            {/* Current Images Display */}
            {images.length > 0 && (
              <Box>
                <Typography variant="subtitle1" mb={2} color="error">
                  Hình ảnh đã chọn ({images.length}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {images.map((imageUrl, index) => (
                    <Box key={index} position="relative">
                      <img 
                        src={imageUrl} 
                        alt={`Product ${index + 1}`} 
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '2px solid #d32f2f'
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
                          width: 28,
                          height: 28,
                          p: 0,
                          fontSize: '14px',
                          fontWeight: 'bold'
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
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#d32f2f',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#d32f2f',
                    },
                  }}
                />
              }
              label="Kích hoạt sản phẩm ngay sau khi thêm"
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" justifyContent="center" gap={3} mt={4}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            size="large"
            disabled={submitLoading}
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': {
                borderColor: '#b71c1c',
                color: '#b71c1c',
                backgroundColor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            Làm mới
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            size="large"
            disabled={submitLoading || uploadLoading}
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            {submitLoading ? 'Đang thêm...' : 'Thêm sản phẩm'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddProduct;