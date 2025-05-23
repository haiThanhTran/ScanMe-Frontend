import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Container,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  Store as StoreIcon, 
  Phone as PhoneIcon, 
  LocationOn as LocationOnIcon, 
  Person as PersonIcon, 
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';

function StoreManagement() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:9999/api/store/store-by-userId', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
      setFormData({
        name: data.name,
        address: data.address,
        phone: data.phone
      });
    } catch (err) {
      setError('Failed to fetch store data. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if cancel editing
      setFormData({
        name: store.name,
        address: store.address,
        phone: store.phone
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setSaveLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send the updated data to the backend
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9999/api/store/update/store-by-userId', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // For now, just update the local state to simulate success
      setStore({
        ...store,
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save store data', err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#d32f2f' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading store data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ maxWidth: 500, boxShadow: 3, bgcolor: '#d32f2f' }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!store) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert 
          severity="info"
          variant="filled"
          sx={{ maxWidth: 500, boxShadow: 3, bgcolor: '#ef9a9a', color: '#731717' }}
        >
          No store information found. Please create a store first.
        </Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(to right, #ffffff, #fff5f5)',
          borderTop: '4px solid #e53935'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <ShoppingBagIcon sx={{ fontSize: 32, mr: 2, color: '#d32f2f' }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color="#d32f2f">
              Store Management
            </Typography>
          </Box>
          <Button 
            variant={isEditing ? "outlined" : "contained"} 
            onClick={handleEditToggle}
            startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
            sx={{ 
              borderRadius: 8, 
              px: 3, 
              bgcolor: isEditing ? 'transparent' : '#d32f2f',
              color: isEditing ? '#d32f2f' : 'white',
              borderColor: isEditing ? '#d32f2f' : 'transparent',
              '&:hover': {
                bgcolor: isEditing ? 'rgba(211, 47, 47, 0.04)' : '#b71c1c',
                borderColor: isEditing ? '#d32f2f' : 'transparent'
              }
            }}
          >
            {isEditing ? "Cancel" : "Edit Store"}
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3, borderColor: '#ffcdd2' }} />

        {isEditing ? (
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <StoreIcon sx={{ mr: 1, color: '#d32f2f' }} />,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#d32f2f',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: '#d32f2f' }} />,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#d32f2f',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <LocationOnIcon sx={{ mr: 1, mt: 1, color: '#d32f2f' }} />,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#d32f2f',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5, 
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c'
                    }
                  }}
                  fullWidth
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving Changes...' : 'Save Changes'}
                  {saveLoading && <CircularProgress size={20} sx={{ ml: 2, color: 'white' }} />}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                },
                borderTop: '3px solid #d32f2f'
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  py: 4
                }}>
                  <Avatar 
                    src={store.logo || "/api/placeholder/150/150"} 
                    alt={store.name}
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mb: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }}
                  />
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {store.name}
                  </Typography>
                  <Chip 
                    label={`ID: ${store._id.substring(0, 8)}...`} 
                    size="small" 
                    sx={{ mb: 2, bgcolor: '#ffebee', color: '#d32f2f', borderColor: '#ffcdd2' }}
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#d32f2f' }} />
                    <Typography variant="body2" color="#d32f2f">
                      Ngày tạo: {formatDate(store.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderTop: '3px solid #d32f2f'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 3, color: '#d32f2f' }}>
                    Chi tiết cửa hàng
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 2, borderLeft: '3px solid #ef5350' }}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#ffebee', mr: 2 }}>
                          <StoreIcon sx={{ color: '#d32f2f' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Tên cửa hàng
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {store.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 2, borderLeft: '3px solid #ef5350' }}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#ffebee', mr: 2 }}>
                          <PhoneIcon sx={{ color: '#d32f2f' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Số điện thoại
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {store.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 2, borderLeft: '3px solid #ef5350' }}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#ffebee', mr: 2 }}>
                          <LocationOnIcon sx={{ color: '#d32f2f' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Địa chỉ
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {store.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 2, borderLeft: '3px solid #ef5350' }}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#ffebee', mr: 2 }}>
                          <PersonIcon sx={{ color: '#d32f2f' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Thông tin chủ sở hữu
                          </Typography>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Tài khoản:
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {store.userId.username}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Email:
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {store.userId.email}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default StoreManagement;