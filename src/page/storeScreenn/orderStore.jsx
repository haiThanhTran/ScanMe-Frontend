import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Container,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Collapse,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Person,
  LocalShipping,
  Payment,
  ShoppingCart,
  Phone,
  Email,
  LocationOn,
  Refresh,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import fetchUtils from '../../utils/fetchUtils';

function OrderStore() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    orderId: null,
    action: null,
    title: '',
    message: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API usually expects 1-based page
        limit: rowsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      });

const response = await fetchUtils.get(`/order-store?${params.toString()}`, true);
      setOrders(response.orders || []);
      setTotalOrders(response.total || 0);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(0);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleRefresh = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('');
    setPage(0);
    fetchOrders();
  };

  const showConfirmDialog = (orderId, action) => {
    const dialogConfig = {
      confirm: {
        title: 'Xác nhận đơn hàng',
        message: 'Bạn có chắc chắn muốn xác nhận đơn hàng này không?',
        action: 'confirmed'
      },
      cancel: {
        title: 'Hủy đơn hàng',
        message: 'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
        action: 'cancelled'
      }
    };

    const config = dialogConfig[action];
    setConfirmDialog({
      open: true,
      orderId,
      action: config.action,
      title: config.title,
      message: config.message
    });
  };

  const handleConfirmAction = async () => {
    const { orderId, action } = confirmDialog;
    
    try {
      setActionLoading(prev => ({ ...prev, [orderId]: true }));
      const response = await fetchUtils.patch(`/order-store/${orderId}/status`, { status: action }, true);

      await response;
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, status: action }
          : order
      ));
      
      setSnackbar({
        open: true,
        message: `Đơn hàng đã được ${action === 'confirmed' ? 'xác nhận' : 'hủy'} thành công!`,
        severity: 'success'
      });
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Lỗi khi cập nhật trạng thái đơn hàng: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
      setConfirmDialog({ open: false, orderId: null, action: null, title: '', message: '' });
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'processing': 'info',
      'confirmed': 'primary',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'confirmed': 'Đã xác nhận',
      'shipped': 'Đã giao',
      'delivered': 'Đã nhận',
      'cancelled': 'Đã hủy'
    };
    return statusLabels[status] || status;
  };

  const canConfirm = (status) => {
    return status === 'pending';
  };

  const canCancel = (status) => {
    return status === 'pending'; // Chỉ cho phép hủy khi đơn hàng đang chờ xác nhận
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
        Quản lý đơn hàng
      </Typography>
      
      {/* Filters and Search */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Tìm kiếm đơn hàng"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Mã đơn hàng, tên khách hàng..."
                size="small"
                variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#d32f2f',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#d32f2f',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Lọc theo trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Lọc theo trạng thái"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                  <MenuItem value="processing">Đang xử lý</MenuItem>
                  <MenuItem value="shipped">Đã giao</MenuItem>
                  <MenuItem value="delivered">Đã nhận</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                onClick={handleSearchSubmit}
                fullWidth
                size="small"
                sx={{ 
                  height: 40,
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#c62828',
                  }
                }}
              >
                Tìm kiếm
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                fullWidth
                size="small"
                sx={{ 
                  height: 40,
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    borderColor: '#c62828',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  }
                }}
              >
                Làm mới
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Tổng số đơn hàng: <strong style={{ color: '#d32f2f' }}>{totalOrders}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#d32f2f' }}>
              <TableCell width={50} sx={{ fontWeight: 'bold', color: 'white' }}></TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Mã đơn hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tổng tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress sx={{ color: '#d32f2f' }} />
                  <Typography variant="body2" sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Alert severity="info">Không tìm thấy đơn hàng nào.</Alert>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  {/* Main Row */}
                  <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(order._id)}
                        sx={{ 
                          backgroundColor: expandedRows[order._id] ? '#d32f2f' : 'transparent',
                          color: expandedRows[order._id] ? 'white' : '#d32f2f',
                          '&:hover': {
                            backgroundColor: expandedRows[order._id] ? '#c62828' : 'rgba(211, 47, 47, 0.08)',
                          }
                        }}
                      >
                        {expandedRows[order._id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="#d32f2f">
                        #{order.orderCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#d32f2f' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {order.userId?.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.userId?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.items.length} sản phẩm
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="#2e7d32">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(order.status)} 
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        {canConfirm(order.status) && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => showConfirmDialog(order._id, 'confirm')}
                            disabled={actionLoading[order._id]}
                            sx={{ 
                              minWidth: 120,
                              backgroundColor: '#2e7d32',
                              '&:hover': {
                                backgroundColor: '#1b5e20',
                              }
                            }}
                          >
                            Xác nhận
                          </Button>
                        )}
                        {canCancel(order.status) && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => showConfirmDialog(order._id, 'cancel')}
                            disabled={actionLoading[order._id]}
                            sx={{ 
                              minWidth: 120,
                              backgroundColor: '#d32f2f',
                              '&:hover': {
                                backgroundColor: '#c62828',
                              }
                            }}
                          >
                            Hủy đơn
                          </Button>
                        )}
                        {!canConfirm(order.status) && !canCancel(order.status) && (
                          <Typography variant="caption" color="text.secondary">
                            Không thể thao tác
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0 }}>
                      <Collapse in={expandedRows[order._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 1, m: 1 }}>
                          <Grid container spacing={3}>
                            {/* Shipping Info */}
                            {order.shippingInfo && order.status === 'confirmed' && (
                              <Grid item xs={12} md={4}>
                                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                  <Box display="flex" alignItems="center" mb={2}>
                                    <LocalShipping sx={{ mr: 1, color: '#d32f2f' }} />
                                    <Typography variant="h6" color="#d32f2f">Thông tin giao hàng</Typography>
                                  </Box>
                                  <Typography variant="body2" gutterBottom>
                                    <strong>Tên:</strong> {order.shippingInfo.name}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Phone sx={{ mr: 0.5, fontSize: 16 }} />
                                    {order.shippingInfo.phone}
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <LocationOn sx={{ mr: 0.5, fontSize: 16, mt: 0.2 }} />
                                    {order.shippingInfo.address}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}

                            {/* Payment Details */}
                            <Grid item xs={12} md={order.shippingInfo ? 4 : 6}>
                              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <Payment sx={{ mr: 1, color: '#d32f2f' }} />
                                  <Typography variant="h6" color="#d32f2f">Chi tiết thanh toán</Typography>
                                </Box>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Phương thức:</strong> {order.paymentMethod}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Tiền hàng:</strong> {formatCurrency(order.subTotal)}
                                </Typography>
                                {order.totalDiscount > 0 && (
                                  <Typography variant="body2" color="#2e7d32" gutterBottom>
                                    <strong>Giảm giá:</strong> -{formatCurrency(order.totalDiscount)}
                                  </Typography>
                                )}
                                <Typography variant="body2" gutterBottom>
                                  <strong>Phí ship:</strong> {formatCurrency(order.shippingFee)}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body1" fontWeight="bold" color="#2e7d32">
                                  <strong>Tổng cộng:</strong> {formatCurrency(order.totalAmount)}
                                </Typography>
                              </Paper>
                            </Grid>

                            {/* Order Items */}
                            <Grid item xs={12} md={order.shippingInfo ? 4 : 6}>
                              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, maxHeight: 300, overflow: 'auto' }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <ShoppingCart sx={{ mr: 1, color: '#d32f2f' }} />
                                  <Typography variant="h6" color="#d32f2f">
                                    Sản phẩm ({order.items.length})
                                  </Typography>
                                </Box>
                                <List dense>
                                  {order.items.map((item, index) => (
                                    <ListItem key={index} divider={index < order.items.length - 1} sx={{ px: 0 }}>
                                      <ListItemAvatar>
                                        <Avatar
                                          src={item.productId.images?.[0]}
                                          alt={item.productName}
                                          sx={{ width: 48, height: 48 }}
                                        />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" fontWeight="bold">
                                            {item.productName}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box>
                                            <Typography variant="body2" color="text.secondary">
                                              SL: {item.quantity} × {formatCurrency(item.unitPrice)}
                                            </Typography>
                                            {item.discountApplied > 0 && (
                                              <Typography variant="body2" color="#2e7d32">
                                                Giảm: -{formatCurrency(item.discountApplied)}
                                                {item.appliedVoucherInfo && (
                                                  <Chip
                                                    label={item.appliedVoucherInfo.code}
                                                    size="small"
                                                    color="success"
                                                    sx={{ ml: 1 }}
                                                  />
                                                )}
                                              </Typography>
                                            )}
                                            <Typography variant="body2" fontWeight="bold" color="#d32f2f">
                                              Thành tiền: {formatCurrency(item.finalSubTotal)}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            '.MuiTablePagination-toolbar': {
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 1
            }
          }}
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            color="inherit"
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleConfirmAction}
            color={confirmDialog.action === 'cancelled' ? 'error' : 'success'}
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: confirmDialog.action === 'cancelled' ? '#d32f2f' : '#2e7d32',
              '&:hover': {
                backgroundColor: confirmDialog.action === 'cancelled' ? '#c62828' : '#1b5e20',
              }
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default OrderStore;