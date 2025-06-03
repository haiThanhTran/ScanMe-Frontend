import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Divider,
  Paper,
  Avatar,
} from '@mui/material';

const ProductStoreDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:9999/api/products-store/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data);
      } catch (error) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        console.error('Failed to fetch product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'grey.100',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Không tìm thấy sản phẩm.'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Grid container>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : 'https://cdn.pnj.io/images/detailed/47/gv0000w000133-vong-tay-vang-trang-y-18k-pnj-01-4001.png'
              }
              alt={product.name}
              sx={{
                height: { xs: 300, md: '100%' },
                width: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://cdn.pnj.io/images/detailed/47/gv0000w000133-vong-tay-vang-trang-y-18k-pnj-01-4001.png';
              }}
            />
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>

              <Typography variant="h6" color="primary" gutterBottom>
                Giá: {product.price.toLocaleString()} VND
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Còn lại:</strong> {product.inventory} sản phẩm
              </Typography>

              <Box sx={{ mt: 2 }}>
                {product.categories.map((cat) => (
                  <Chip
                    key={cat._id}
                    label={cat.name}
                    variant="outlined"
                    color="secondary"
                    avatar={<Avatar src={cat.icon} />}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thông tin cửa hàng
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={product.storeId.logo} sx={{ mr: 2 }} />
                <Typography variant="body1">{product.storeId.name}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Địa chỉ:</strong> {product.storeId.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Số điện thoại:</strong> {product.storeId.phone}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductStoreDetail;
