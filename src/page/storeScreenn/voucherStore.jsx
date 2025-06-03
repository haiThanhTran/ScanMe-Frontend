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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  LinearProgress,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Fab,
  Tooltip,
  Stack,
  Divider,
  Pagination,
  TableFooter,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  // Activity as ActivityIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

function VoucherStore() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVouchers, setSelectedVouchers] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVouchers();
  }, [currentPage, itemsPerPage, searchTerm, filterStatus]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized: No token found');
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await fetchUtils.get(`/voucher-store?${params}`, true);

      setVouchers(response.vouchers || []);
      setTotalVouchers(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setError(err?.response?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    setSelectedVouchers([]); // Clear selections when changing page
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing items per page
    setSelectedVouchers([]); // Clear selections
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedVouchers([]); // Clear selections
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedVouchers([]); // Clear selections
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

  const toggleVoucherSelection = (voucherId) => {
    setSelectedVouchers(prev =>
      prev.includes(voucherId)
        ? prev.filter(id => id !== voucherId)
        : [...prev, voucherId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on vouchers:`, selectedVouchers);
    // Implement bulk actions here
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedVouchers(vouchers.map(v => v._id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handleEditVoucher = (voucherId) => {
    navigate(`/store/voucherManagement/${voucherId}`);
  };

  const confirmDeleteVoucher = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setOpenDialog(true);
  };

  const handleDeleteVoucher = async () => {
    try {

      await fetchUtils.remove(`/voucher-store/${selectedVoucherId}`, true);
      await fetchVouchers();
    } catch (err) {
      console.error('Error deleting voucher:', err);
    } finally {
      setOpenDialog(false);
      setSelectedVoucherId(null);
    }
  };



  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Đang tải dữ liệu...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  const activeVouchers = vouchers.filter(v => v.isActive && !isExpired(v.endDate)).length;
  const totalUsage = vouchers.reduce((sum, v) => sum + v.usedQuantity, 0);
  const totalRevenue = vouchers.reduce((sum, v) => sum + (v.usedQuantity * v.discountValue), 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Quản lý Voucher
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Quản lý các voucher giảm giá của cửa hàng
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
              onClick={() => navigate('/store/voucherManagement/create')}
            >
              Tạo voucher mới
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
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
                      {/* <ActivityIcon sx={{ color: 'primary.main' }} /> */}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Tổng voucher
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {totalVouchers}
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
                        Đang hoạt động
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {activeVouchers}
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
                        Lượt sử dụng
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {totalUsage}
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
                        {formatCurrency(totalRevenue)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm voucher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ flexGrow: 1, maxWidth: 400 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Trạng thái"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="expired">Hết hạn</MenuItem>
                    <MenuItem value="inactive">Tạm dừng</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Hiển thị</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label="Hiển thị"
                    onChange={handleItemsPerPageChange}
                  >
                    <MenuItem value={5}>5 / trang</MenuItem>
                    <MenuItem value={10}>10 / trang</MenuItem>
                    <MenuItem value={20}>20 / trang</MenuItem>
                    <MenuItem value={50}>50 / trang</MenuItem>
                  </Select>
                </FormControl>

                {selectedVouchers.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleBulkAction('activate')}
                    >
                      Kích hoạt ({selectedVouchers.length})
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleBulkAction('deactivate')}
                    >
                      Tạm dừng ({selectedVouchers.length})
                    </Button>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Voucher Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedVouchers.length > 0 && selectedVouchers.length < vouchers.length}
                        checked={vouchers.length > 0 && selectedVouchers.length === vouchers.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Voucher</TableCell>
                    <TableCell>Giảm giá</TableCell>
                    <TableCell>Sử dụng</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow
                      key={voucher._id}
                      hover
                      selected={selectedVouchers.includes(voucher._id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedVouchers.includes(voucher._id)}
                          onChange={() => toggleVoucherSelection(voucher._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {voucher.code}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 300 }}>
                            {voucher.description}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {voucher.applicableCategories?.map(cat => cat.name).join(', ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {getDiscountDisplay(voucher)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Tối thiểu: {formatCurrency(voucher.minPurchaseAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.usedQuantity}/{voucher.totalQuantity}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getUsagePercentage(voucher.usedQuantity, voucher.totalQuantity)}
                          sx={{ width: 100, mt: 0.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(voucher.startDate)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          đến {formatDate(voucher.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(voucher)}
                        <Box sx={{ mt: 0.5 }}>
                          {voucher.restrictions?.newUsersOnly && (
                            <Chip label="Khách mới" size="small" variant="outlined" color="primary" sx={{ mr: 0.5, fontSize: '0.7rem' }} />
                          )}
                          {voucher.restrictions?.oneTimeUse && (
                            <Chip label="1 lần" size="small" variant="outlined" color="warning" sx={{ fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => handleEditVoucher(voucher._id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={() => navigate(`/store/voucherManagement/${voucher._id}`)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton size="small" color="error" onClick={() => confirmDeleteVoucher(voucher._id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Thêm">
                            <IconButton size="small">
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Info and Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalVouchers)} trong tổng số {totalVouchers} voucher
              </Typography>

              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              )}
            </Box>

            {vouchers.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  Không tìm thấy voucher nào
                </Typography>
              </Box>
            )}
          </Card>
        </Container>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa voucher này không?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={handleDeleteVoucher} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

export default VoucherStore;