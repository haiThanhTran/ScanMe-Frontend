import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Container,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Rating,
  Avatar,
  Stack,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from "@mui/icons-material";
import fetchUtils from "../../utils/fetchUtils";
import { message } from "antd";

// Utility function for price formatting
const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN") + " đ";
};

// --- Sub-components ---

const ProductImageGallery = ({ product, selectedImage, setSelectedImage, handleImageClick, imageDialogOpen, setImageDialogOpen }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      backgroundColor: '#fafafa',
      borderRadius: 3,
      border: '1px solid #f0f0f0'
    }}
  >
    {/* Main Image */}
    {product.images && product.images.length > selectedImage ? (
      <CardMedia
        component="img"
        image={product.images[selectedImage]}
        alt={`${product.name} - Image ${selectedImage + 1}`}
        sx={{
          width: "100%",
          height: 450,
          objectFit: "cover",
          borderRadius: 3,
          cursor: "pointer",
          mb: 3,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
        onClick={() => handleImageClick(selectedImage)}
      />
    ) : (
      <Box
        sx={{
          height: 450,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 3
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Không có hình ảnh để hiển thị
        </Typography>
      </Box>
    )}

    {/* Thumbnail Images */}
    {product.images && product.images.length > 1 && (
      <ImageList cols={4} gap={12} sx={{ height: 120 }}>
        {product.images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
                cursor: "pointer",
                maxHeight: "100px",
                maxWidth: "100%",
                border: selectedImage === index ? "3px solid #d32f2f" : "2px solid #e0e0e0",
                transition: 'all 0.3s ease',
                opacity: selectedImage === index ? 1 : 0.7
              }}
              onClick={() => setSelectedImage(index)}
            />
          </ImageListItem>
        ))}
      </ImageList>
    )}

    {/* Image Dialog */}
    <Dialog
      open={imageDialogOpen}
      onClose={() => setImageDialogOpen(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative", backgroundColor: '#fafafa' }}>
        <IconButton
          onClick={() => setImageDialogOpen(false)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            backgroundColor: "rgba(211, 47, 47, 0.9)",
            color: "white",
            width: 48,
            height: 48,
            "&:hover": {
              backgroundColor: "rgba(183, 28, 28, 0.9)",
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CloseIcon />
        </IconButton>
        {product.images && product.images.length > selectedImage ? (
          <img
            src={product.images[selectedImage]}
            alt={`${product.name} - Full size`}
            style={{
              width: "100%",
              height: "auto",
              display: "block"
            }}
          />
        ) : (
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Không có hình ảnh để hiển thị
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  </Paper>
);

const ProductInfo = ({ product, quantity, handleQuantityChange, incrementQuantity, decrementQuantity, handleAddToCart }) => {
  const storeName = product.storeId?.name || "Unknown Store";

  return (
    <Stack spacing={3}>
      {/* Product Name */}
      <Typography
        variant="h3"
        component="h1"
        fontWeight="600"
        sx={{
          color: '#2c2c2c',
          lineHeight: 1.2,
          mb: 1
        }}
      >
        {product.name}
      </Typography>

      {/* Store Info */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          p: 2,
          backgroundColor: '#f8f8f8',
          borderRadius: 2,
          border: '1px solid #f0f0f0'
        }}
      >
        <StoreIcon sx={{ color: '#d32f2f' }} />
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          Bởi: {storeName}
        </Typography>
      </Box>

      {/* Price */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: '#fff5f5',
          border: '2px solid #ffebee',
          borderRadius: 3
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#d32f2f' }}>
          Giá bán:
        </Typography>
        {product.discountedPrice ? (
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Typography
              variant="h6"
              sx={{
                textDecoration: "line-through",
                color: '#999'
              }}
            >
              {formatPrice(product.price)}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#d32f2f',
                fontWeight: '700'
              }}
            >
              {formatPrice(product.discountedPrice)}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="h4"
            sx={{
              color: '#d32f2f',
              fontWeight: '700'
            }}
          >
            {formatPrice(product.price)}
          </Typography>
        )}
      </Paper>

      {/* Stock */}
      {product.inventory !== undefined && (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            p: 2,
            backgroundColor: '#f8f8f8',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        >
          <InventoryIcon sx={{ color: '#d32f2f' }} />
          <Typography variant="body1" fontWeight="500">
            <strong>Tồn kho:</strong> {product.inventory}
          </Typography>
        </Box>
      )}

      {/* Categories */}
      {product.categories && product.categories.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#2c2c2c' }}>
            Danh mục:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {product.categories.map((category) => (
              <Chip
                key={category._id || category}
                label={category.name || category}
                variant="outlined"
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  fontWeight: '500',
                  '&:hover': {
                    backgroundColor: '#fff5f5'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Quantity Selector */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: '#f8f8f8',
          borderRadius: 3,
          border: '1px solid #f0f0f0'
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#2c2c2c' }}>
          Số lượng:
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: '#b71c1c'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#999'
              }
            }}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              handleQuantityChange(value);
            }}
            inputProps={{
              min: 1,
              max: product.inventory,
              style: { textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }
            }}
            sx={{
              width: 80,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#d32f2f'
                },
                '&:hover fieldset': {
                  borderColor: '#b71c1c'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d32f2f'
                }
              }
            }}
          />

          <IconButton
            onClick={incrementQuantity}
            disabled={quantity >= product.inventory}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: '#b71c1c'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#999'
              }
            }}
          >
            <AddIcon />
          </IconButton>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (Tối đa: {product.inventory})
          </Typography>
        </Box>
      </Paper>

      {/* Add to Cart Button */}
      <Button
        variant="contained"
        size="large"
        startIcon={<ShoppingCartIcon />}
        fullWidth
        onClick={handleAddToCart}
        sx={{
          py: 2,
          fontSize: "1.2rem",
          fontWeight: '600',
          backgroundColor: '#d32f2f',
          borderRadius: 3,
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
          '&:hover': {
            backgroundColor: '#b71c1c',
            boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        Thêm {quantity} sản phẩm vào giỏ hàng
      </Button>
    </Stack>
  );
};

const ProductDescription = ({ description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      backgroundColor: '#fafafa',
      borderRadius: 3,
      border: '1px solid #f0f0f0'
    }}
  >
    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#2c2c2c' }}>
      Mô tả sản phẩm:
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#555',
        lineHeight: 1.7,
        fontSize: '1.1rem'
      }}
    >
      {description}
    </Typography>
  </Paper>
);

const ProductFeedbackSection = ({ feedback }) => (
  <Box sx={{ mt: 6 }}>
    <Typography
      variant="h4"
      fontWeight="600"
      gutterBottom
      sx={{
        color: '#2c2c2c',
        mb: 4,
        textAlign: 'left'
      }}
    >
      Đánh giá từ khách hàng
    </Typography>
    <Grid container spacing={3}>
      {feedback.map((fdbk) => (
        <Grid item xs={12} md={6} lg={4} key={fdbk._id}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 'fit',
              backgroundColor: 'white',
              borderRadius: 3,
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(211, 47, 47, 0.1)',
                transform: 'translateY(-4px)',
                borderColor: '#ffcdd2'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  backgroundColor: '#d32f2f',
                  fontWeight: '600'
                }}
                src={fdbk.userId ? fdbk.userId.avatar : 'NA'}
              >
                {fdbk.userId ? fdbk.userId.avatar : 'NA'}
              </Avatar>
              <Box flex={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ color: '#2c2c2c' }}
                >
                  {fdbk.userId.fullName || 'Khách hàng'}
                </Typography>
                <Rating
                  value={fdbk.rating}
                  readOnly
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#d32f2f'
                    }
                  }}
                />
              </Box>
            </Box>
            <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 0.5, fontWeight: '500' }}
                >
                  {new Date(fdbk.createAt).toLocaleDateString("vi-VN")}
                </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}
            >
              {fdbk.comment}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// --- Main Component ---

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUtils.get(`/products/${id}`, false);
        if (data && data.data) {
          setProduct(data.data);
        } else {
          throw new Error("Sản phẩm không tìm thấy.");
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setError(new Error("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau."));
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    } else {
      setLoading(false);
      setError(new Error("Không có ID sản phẩm được cung cấp."));
    }
  }, [id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Vui lòng đăng nhập để sử dụng giỏ hàng!");
      navigate("/login");
      return;
    }

    if (quantity > product.inventory) {
      message.error("Số lượng vượt quá số lượng tồn kho!");
      return;
    }

    try {
      const res = await fetchUtils.post(
        "/user/carts/cart",
        { productId: product?._id, quantity: quantity },
        true
      );
      if (res.success) {
        message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
        setQuantity(1); // Reset quantity after successful add
      } else {
        message.error(res.message || "Thêm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product.inventory) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.inventory) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setImageDialogOpen(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: '#fafafa' }}
      >
        <CircularProgress size={60} sx={{ color: '#d32f2f' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: '#fafafa' }}
      >
        <Typography variant="h4" color="error" textAlign="center">
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: '#fafafa' }}
      >
        <Typography variant="h4" textAlign="center">
          Sản phẩm không tìm thấy.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Card
          elevation={0}
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(211, 47, 47, 0.08)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Product Images */}
              <Grid item xs={12} md={6}>
                <ProductImageGallery
                  product={product}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  handleImageClick={handleImageClick}
                  imageDialogOpen={imageDialogOpen}
                  setImageDialogOpen={setImageDialogOpen}
                />
              </Grid>

              {/* Product Information */}
              <Grid item xs={12} md={6}>
                <ProductInfo
                  product={product}
                  quantity={quantity}
                  handleQuantityChange={handleQuantityChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                  handleAddToCart={handleAddToCart}
                />
              </Grid>
            </Grid>

            {/* Product Description */}
            <Divider sx={{ my: 6, borderColor: '#eee' }} />
            <ProductDescription description={product.description} />

            {/* Feedback Section */}
            {product.feedBack && product.feedBack.length > 0 && (
              <>
                <Divider sx={{ my: 6, borderColor: '#eee' }} />
                <ProductFeedbackSection feedback={product.feedBack} />
              </>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;