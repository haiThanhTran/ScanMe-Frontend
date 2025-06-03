import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Checkbox,
  Alert,
  AppBar,
  Toolbar,
  Stack,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fetchUtils from '../../utils/fetchUtils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AddVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigator = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    totalQuantity: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    applicableCategories: [],
    restrictions: {
      newUsersOnly: false,
      oneTimeUse: false,
      minOrderValue: '',
      maxUsagePerUser: 1
    }
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchUtils.get('/categories', true);
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleRestrictionChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      restrictions: {
        ...prev.restrictions,
        [field]: value
      }
    }));
  };

  const handleCategoryChange = (event) => {
    setFormData(prev => ({
      ...prev,
      applicableCategories: event.target.value
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const generateVoucherCode = () => {
    const prefix = 'VOUCHER';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const code = `${prefix}${randomNum}`;
    setFormData(prev => ({
      ...prev,
      code: code
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã voucher là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả voucher là bắt buộc';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Giá trị giảm giá phải lớn hơn 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Phần trăm giảm giá không được vượt quá 100%';
    }

    if (!formData.totalQuantity || formData.totalQuantity <= 0) {
      newErrors.totalQuantity = 'Số lượng voucher phải lớn hơn 0';
    }

    if (!formData.minPurchaseAmount || formData.minPurchaseAmount < 0) {
      newErrors.minPurchaseAmount = 'Giá trị đơn hàng tối thiểu không hợp lệ';
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        isDraft: isDraft
      };

      await fetchUtils.post('/voucher-store', submitData, true)

      setSuccess(true);
      setError(null);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSuccess(false);
        if (!isDraft) {
          // Redirect to voucher list or reset form
          resetForm();
        }
      }, 3000);

    } catch (err) {
      console.error('Error creating voucher:', err);
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo voucher');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      totalQuantity: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      applicableCategories: [],
      restrictions: {
        newUsersOnly: false,
        oneTimeUse: false,
        minOrderValue: '',
        maxUsagePerUser: 1
      }
    });
    setErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          {/* Header */}
          <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
            <Toolbar>
              <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigator('/store/voucherManagement')}>
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Tạo Voucher Mới
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tạo voucher giảm giá cho khách hàng
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  Lưu nháp
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo voucher'}
                </Button>
              </Stack>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Tạo voucher thành công!
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thông tin cơ bản
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Mã voucher"
                          value={formData.code}
                          onChange={handleInputChange('code')}
                          error={!!errors.code}
                          helperText={errors.code}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button size="small" onClick={generateVoucherCode}>
                                  Tạo mã
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Mô tả voucher"
                          multiline
                          rows={3}
                          value={formData.description}
                          onChange={handleInputChange('description')}
                          error={!!errors.description}
                          helperText={errors.description}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Loại giảm giá</InputLabel>
                          <Select
                            value={formData.discountType}
                            label="Loại giảm giá"
                            onChange={handleInputChange('discountType')}
                          >
                            <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                            <MenuItem value="fixed">Số tiền cố định (VND)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={formData.discountType === 'percentage' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VND)'}
                          type="number"
                          value={formData.discountValue}
                          onChange={handleInputChange('discountValue')}
                          error={!!errors.discountValue}
                          helperText={errors.discountValue}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {formData.discountType === 'percentage' ? <PercentIcon /> : <MoneyIcon />}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Giá trị đơn hàng tối thiểu"
                          type="number"
                          value={formData.minPurchaseAmount}
                          onChange={handleInputChange('minPurchaseAmount')}
                          error={!!errors.minPurchaseAmount}
                          helperText={errors.minPurchaseAmount}
                        />
                      </Grid>

                      {formData.discountType === 'percentage' && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Giá trị giảm tối đa (VND)"
                            type="number"
                            value={formData.maxDiscountAmount}
                            onChange={handleInputChange('maxDiscountAmount')}
                            helperText="Để trống nếu không giới hạn"
                          />
                        </Grid>
                      )}

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Số lượng voucher"
                          type="number"
                          value={formData.totalQuantity}
                          onChange={handleInputChange('totalQuantity')}
                          error={!!errors.totalQuantity}
                          helperText={errors.totalQuantity}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Time Settings */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thời gian áp dụng
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Ngày bắt đầu"
                          value={formData.startDate}
                          onChange={handleDateChange('startDate')}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Ngày kết thúc"
                          value={formData.endDate}
                          onChange={handleDateChange('endDate')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.endDate}
                              helperText={errors.endDate}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Category Settings */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Danh mục áp dụng
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel>Chọn danh mục</InputLabel>
                      <Select
                        multiple
                        value={formData.applicableCategories}
                        onChange={handleCategoryChange}
                        label="Chọn danh mục"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const category = categories.find(cat => cat._id === value);
                              return (
                                <Chip key={value} label={category?.name || value} size="small" />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            <Checkbox checked={formData.applicableCategories.includes(category._id)} />
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Để trống nếu áp dụng cho tất cả danh mục</FormHelperText>
                    </FormControl>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <CardContent>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Cài đặt nâng cao</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.restrictions.newUsersOnly}
                                  onChange={handleRestrictionChange('newUsersOnly')}
                                />
                              }
                              label="Chỉ dành cho khách hàng mới"
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.restrictions.oneTimeUse}
                                  onChange={handleRestrictionChange('oneTimeUse')}
                                />
                              }
                              label="Chỉ sử dụng một lần"
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Số lần sử dụng tối đa mỗi khách"
                              type="number"
                              value={formData.restrictions.maxUsagePerUser}
                              onChange={handleRestrictionChange('maxUsagePerUser')}
                              disabled={formData.restrictions.oneTimeUse}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>

              {/* Preview/Summary */}
              <Grid item xs={12} md={4}>
                <Card sx={{ position: 'sticky', top: 20 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Xem trước voucher
                    </Typography>
                    
                    <Box sx={{ p: 2, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2, mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                        {formData.code || 'MÃ VOUCHER'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formData.description || 'Mô tả voucher'}
                      </Typography>
                      <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                        {formData.discountType === 'percentage' 
                          ? `${formData.discountValue || 0}% OFF`
                          : `${formatCurrency(formData.discountValue)}`
                        }
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Đơn tối thiểu: {formatCurrency(formData.minPurchaseAmount)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Số lượng:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formData.totalQuantity || 0}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Thời gian:</Typography>
                        <Typography variant="body2">
                          {formData.startDate?.toLocaleDateString('vi-VN')} - {formData.endDate?.toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Trạng thái:</Typography>
                        <Chip 
                          label={formData.isActive ? 'Hoạt động' : 'Tạm dừng'} 
                          color={formData.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isActive}
                            onChange={handleSwitchChange('isActive')}
                          />
                        }
                        label="Kích hoạt voucher"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default AddVoucher;