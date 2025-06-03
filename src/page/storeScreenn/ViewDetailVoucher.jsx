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
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  IconButton,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Divider,
  Stack,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

function ViewDetailVoucher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchaseAmount: 0,
    totalQuantity: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    restrictions: {
      newUsersOnly: false,
      oneTimeUse: false,
      maxDiscountAmount: 0
    },
    applicableCategories: []
  });

  useEffect(() => {
    if (id) {
      fetchVoucherDetail();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 1 && voucher) {
      fetchUsageHistory();
    }
  }, [activeTab, voucher]);

  const fetchVoucherDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized: No token found');
      }

      const response = await axios.get(`http://localhost:9999/api/voucher-store/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const voucherData = response.data;
      setVoucher(voucherData);
      
      // Set form data for editing
      setFormData({
        code: voucherData.code || '',
        description: voucherData.description || '',
        discountType: voucherData.discountType || 'percentage',
        discountValue: voucherData.discountValue || 0,
        minPurchaseAmount: voucherData.minPurchaseAmount || 0,
        totalQuantity: voucherData.totalQuantity || 0,
        startDate: voucherData.startDate ? new Date(voucherData.startDate).toISOString().split('T')[0] : '',
        endDate: voucherData.endDate ? new Date(voucherData.endDate).toISOString().split('T')[0] : '',
        isActive: voucherData.isActive !== undefined ? voucherData.isActive : true,
        restrictions: {
          newUsersOnly: voucherData.restrictions?.newUsersOnly || false,
          oneTimeUse: voucherData.restrictions?.oneTimeUse || false,
          maxDiscountAmount: voucherData.restrictions?.maxDiscountAmount || 0
        },
        applicableCategories: voucherData.applicableCategories || []
      });

    } catch (err) {
      console.error('Error fetching voucher detail:', err);
      setError(err?.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:9999/api/voucher-store/${id}/usage-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsageHistory(response.data.history || []);
    } catch (err) {
      console.error('Error fetching usage history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const updateData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await axios.patch(`http://localhost:9999/api/voucher-store/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh voucher data
      await fetchVoucherDetail();
      setEditMode(false);
      
    } catch (err) {
      console.error('Error updating voucher:', err);
      setError(err?.response?.data?.message || err.message || 'Error updating voucher');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDiscountDisplay = (voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}%`;
    }
    return formatCurrency(voucher.discountValue);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getStatusChip = (voucher) => {
    if (!voucher.isActive) {
      return <Chip label="Tạm dừng" color="default" size="small" />;
    }
    if (isExpired(voucher.endDate)) {
      return <Chip label="Hết hạn" color="error" size="small" />;
    }
    if (voucher.usedQuantity >= voucher.totalQuantity) {
      return <Chip label="Hết lượt" color="warning" size="small" />;
    }
    return <Chip label="Hoạt động" color="success" size="small" />;
  };

  const getUsagePercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(voucher.code);
  };

  const toggleVoucherStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:9999/api/voucher-store/${id}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchVoucherDetail();
    } catch (err) {
      console.error('Error toggling voucher status:', err);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Đang tải chi tiết voucher...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/store/voucherManagement')}
          >
            Quay lại danh sách
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  if (!voucher) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Không tìm thấy voucher
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/store/voucherManagement')}
          >
            Quay lại danh sách
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/store/voucherManagement')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                <Link color="inherit" onClick={() => navigate('/store/voucherManagement')}>
                  Quản lý Voucher
                </Link>
                <Typography color="text.primary">Chi tiết voucher</Typography>
              </Breadcrumbs>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {voucher.code}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {!editMode ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color={voucher.isActive ? "error" : "success"}
                    startIcon={voucher.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={toggleVoucherStatus}
                  >
                    {voucher.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setEditMode(false);
                      fetchVoucherDetail(); // Reset form data
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveChanges}
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: 'primary.light',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <ReceiptIcon sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Tổng lượt sử dụng
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {voucher.usedQuantity}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: 'success.light',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <TrendingUpIcon sx={{ color: 'success.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Tỷ lệ sử dụng
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {getUsagePercentage(voucher.usedQuantity, voucher.totalQuantity)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: 'info.light',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <PeopleIcon sx={{ color: 'info.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Còn lại
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {voucher.totalQuantity - voucher.usedQuantity}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: 'warning.light',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <CalendarIcon sx={{ color: 'warning.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Tổng giảm giá
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {formatCurrency(voucher.usedQuantity * voucher.discountValue)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content with Tabs */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Thông tin chi tiết" icon={<SettingsIcon />} iconPosition="start" />
                <Tab label="Lịch sử sử dụng" icon={<HistoryIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Tab 1: Voucher Details */}
            {activeTab === 0 && (
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Thông tin cơ bản
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Mã voucher"
                            value={editMode ? formData.code : voucher.code}
                            onChange={(e) => handleInputChange('code', e.target.value)}
                            disabled={!editMode}
                            InputProps={{
                              endAdornment: !editMode && (
                                <IconButton onClick={copyVoucherCode} size="small">
                                  <CopyIcon />
                                </IconButton>
                              )
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Mô tả"
                            multiline
                            rows={3}
                            value={editMode ? formData.description : voucher.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={!editMode}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <FormControl fullWidth disabled={!editMode}>
                            <InputLabel>Loại giảm giá</InputLabel>
                            <Select
                              value={editMode ? formData.discountType : voucher.discountType}
                              onChange={(e) => handleInputChange('discountType', e.target.value)}
                              label="Loại giảm giá"
                            >
                              <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                              <MenuItem value="fixed">Số tiền cố định</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Giá trị giảm"
                            type="number"
                            value={editMode ? formData.discountValue : voucher.discountValue}
                            onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value))}
                            disabled={!editMode}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Số lượng tổng"
                            type="number"
                            value={editMode ? formData.totalQuantity : voucher.totalQuantity}
                            onChange={(e) => handleInputChange('totalQuantity', parseInt(e.target.value))}
                            disabled={!editMode}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Đơn hàng tối thiểu"
                            type="number"
                            value={editMode ? formData.minPurchaseAmount : voucher.minPurchaseAmount}
                            onChange={(e) => handleInputChange('minPurchaseAmount', parseFloat(e.target.value))}
                            disabled={!editMode}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Ngày bắt đầu"
                            type="date"
                            value={editMode ? formData.startDate : voucher.startDate ? new Date(voucher.startDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Ngày kết thúc"
                            type="date"
                            value={editMode ? formData.endDate : voucher.endDate ? new Date(voucher.endDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Usage Progress */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Tiến độ sử dụng
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            Đã sử dụng: {voucher.usedQuantity}/{voucher.totalQuantity}
                          </Typography>
                          <Typography variant="body2">
                            {getUsagePercentage(voucher.usedQuantity, voucher.totalQuantity)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getUsagePercentage(voucher.usedQuantity, voucher.totalQuantity)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Trạng thái và điều kiện
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Trạng thái hiện tại
                          </Typography>
                          {getStatusChip(voucher)}
                        </Box>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={editMode ? formData.isActive : voucher.isActive}
                              onChange={(e) => handleInputChange('isActive', e.target.checked)}
                              disabled={!editMode}
                            />
                          }
                          label="Kích hoạt voucher"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={editMode ? formData.restrictions.newUsersOnly : voucher.restrictions?.newUsersOnly}
                              onChange={(e) => handleInputChange('restrictions.newUsersOnly', e.target.checked)}
                              disabled={!editMode}
                            />
                          }
                          label="Chỉ dành cho khách hàng mới"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={editMode ? formData.restrictions.oneTimeUse : voucher.restrictions?.oneTimeUse}
                              onChange={(e) => handleInputChange('restrictions.oneTimeUse', e.target.checked)}
                              disabled={!editMode}
                            />
                          }
                          label="Chỉ sử dụng một lần"
                        />

                        {voucher.discountType === 'percentage' && (
                          <TextField
                            fullWidth
                            label="Giảm giá tối đa"
                            type="number"
                            value={editMode ? formData.restrictions.maxDiscountAmount : voucher.restrictions?.maxDiscountAmount || 0}
                            onChange={(e) => handleInputChange('restrictions.maxDiscountAmount', parseFloat(e.target.value))}
                            disabled={!editMode}
                          />
                        )}
                      </Stack>
                    </Paper>

                    {/* Categories */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Danh mục áp dụng
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        {voucher.applicableCategories?.length > 0 ? (
                          voucher.applicableCategories.map((category, index) => (
                            <Chip
                              key={index}
                              label={category.name || category}
                              variant="outlined"
                              color="primary"
                            />
                          ))
                        ) : (
                          <Chip label="Áp dụng cho tất cả danh mục" variant="outlined" />
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            )}

            {/* Tab 2: Usage History */}
            {activeTab === 1 && (
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lịch sử sử dụng voucher
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {loadingHistory ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Khách hàng</TableCell>
                          <TableCell>Đơn hàng</TableCell>
                          <TableCell>Giá trị đơn</TableCell>
                          <TableCell>Giảm giá</TableCell>
                          <TableCell>Thời gian</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usageHistory.length > 0 ? (
                          usageHistory.map((usage, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                    {usage.customerName?.charAt(0) || 'U'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2">
                                      {usage.customerName || 'Khách hàng'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {usage.customerEmail || usage.customerId}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  #{usage.orderId || usage.orderNumber}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(usage.orderValue || 0)}
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                  -{formatCurrency(usage.discountAmount || 0)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formatDate(usage.usedAt || usage.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="textSecondary">
                                Voucher chưa được sử dụng
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            )}
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default ViewDetailVoucher;