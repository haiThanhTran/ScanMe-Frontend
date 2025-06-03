import React, { useState, useEffect } from 'react';
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
  Button
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
  Refresh
} from '@mui/icons-material';

function OrderStore() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token not found. Please login again.');
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API usually expects 1-based page
        limit: rowsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`http://localhost:9999/api/order-store?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalOrders(data.total || 0);
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setPage(0);
    fetchOrders();
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'paid': 'success',
      'failed': 'error'
    };
    return statusColors[status] || 'default';
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Store Management
      </Typography>
      
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Orders"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Order code, customer name..."
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status Filter"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                onClick={handleSearchSubmit}
                fullWidth
                size="small"
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                fullWidth
                size="small"
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total Orders: {totalOrders}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell width={50}></TableCell>
              <TableCell>Order Code</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Alert severity="info">No orders found.</Alert>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  {/* Main Row */}
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(order._id)}
                      >
                        {expandedRows[order._id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        #{order.orderCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {order.userId.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.userId.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.items.length} items
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.paymentStatus} 
                        color={getPaymentStatusColor(order.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0 }}>
                      <Collapse in={expandedRows[order._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: 'grey.25' }}>
                          <Grid container spacing={3}>
                            {/* Shipping Info */}
                            {order.status !== 'pending' && (
                              <Grid item xs={12} md={4}>
                                <Paper elevation={1} sx={{ p: 2 }}>
                                  <Box display="flex" alignItems="center" mb={2}>
                                    <LocalShipping sx={{ mr: 1 }} />
                                    <Typography variant="h6">Shipping</Typography>
                                  </Box>
                                  <Typography variant="body2" gutterBottom>
                                    <strong>Name:</strong> {order.shippingInfo.name}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    <Phone sx={{ mr: 0.5, fontSize: 16 }} />
                                    {order.shippingInfo.phone}
                                  </Typography>
                                  <Typography variant="body2">
                                    <LocationOn sx={{ mr: 0.5, fontSize: 16 }} />
                                    {order.shippingInfo.address}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}

                            {/* Payment Details */}
                            <Grid item xs={12} md={4}>
                              <Paper elevation={1} sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <Payment sx={{ mr: 1 }} />
                                  <Typography variant="h6">Payment</Typography>
                                </Box>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Method:</strong> {order.paymentMethod}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Subtotal:</strong> {formatCurrency(order.subTotal)}
                                </Typography>
                                {order.totalDiscount > 0 && (
                                  <Typography variant="body2" color="success.main" gutterBottom>
                                    <strong>Discount:</strong> -{formatCurrency(order.totalDiscount)}
                                  </Typography>
                                )}
                                <Typography variant="body2" gutterBottom>
                                  <strong>Shipping:</strong> {formatCurrency(order.shippingFee)}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body1" fontWeight="bold" color="primary">
                                  <strong>Total:</strong> {formatCurrency(order.totalAmount)}
                                </Typography>
                              </Paper>
                            </Grid>

                            {/* Order Items */}
                            <Grid item xs={12}>
                              <Paper elevation={1} sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <ShoppingCart sx={{ mr: 1 }} />
                                  <Typography variant="h6">Order Items ({order.items.length})</Typography>
                                </Box>
                                <List dense>
                                  {order.items.map((item, index) => (
                                    <ListItem key={index} divider={index < order.items.length - 1}>
                                      <ListItemAvatar>
                                        <Avatar
                                          src={item.productId.images?.[0]}
                                          alt={item.productName}
                                          sx={{ width: 48, height: 48 }}
                                        />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={item.productName}
                                        secondary={
                                          <Box>
                                            <Typography variant="body2" color="text.secondary">
                                              Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                                            </Typography>
                                            {item.discountApplied > 0 && (
                                              <Typography variant="body2" color="success.main">
                                                Discount: -{formatCurrency(item.discountApplied)}
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
                                            <Typography variant="body2" fontWeight="bold">
                                              Subtotal: {formatCurrency(item.finalSubTotal)}
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
      />
    </Container>
  );
}

export default OrderStore;