import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Pagination,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Container,
  Stack,
  TablePagination,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ModelEditProduct from './modelEditProduct';
import axios from 'axios';
import fetchUtils from '../../utils/fetchUtils';

// Tạo theme với màu chủ đạo đỏ trắng
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#ffffff',
      dark: '#f5f5f5',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
});

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 8px 32px rgba(211, 47, 47, 0.1)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:hover': {
    backgroundColor: '#ffebee',
    transform: 'scale(1.001)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    padding: '12px 16px',
  },
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  '& .MuiChip-label': {
    padding: '8px 12px',
  },
}));

const StoreBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px',
}));

function ProductStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // MUI Pagination starts from 0
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };


  const handleEdit = async (id) => {
    try {
      const response = await fetchUtils.get(`/products-store/${id}`, true);
      setDataDetail(response);
      setOpenModal(true);
    } catch (error) {
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      console.error('Failed to fetch product detail:', error);
    } finally {
      setLoading(false);
    }
    handleClose();
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await fetchUtils.remove(`/products-store/${deleteId}`, true);

      if (response) {
        setProducts(products.filter(product => product._id !== deleteId));
        setTotal(total - 1);
        setError(null);
      }
    } catch (error) {
      setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      console.error('Failed to delete product detail:', error);
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setDeleteId(null);
      handleClose();
    }
  };

  const handleView = (id) => {
    navigate(`/store/productManagement/${id}`);
    handleClose();
  };

  const fetchProducts = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      const data = await fetchUtils.get(`/products-store?page=${currentPage}&limit=${rowsPerPage}`, true);

      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / rowsPerPage));

    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page + 1);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={60} color="primary" />
              <Typography variant="h6" color="text.secondary">
                Đang tải danh sách sản phẩm...
              </Typography>
            </Stack>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Lỗi khi tải dữ liệu</Typography>
            <Typography>{error}</Typography>
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 2
            }}
          >
            📋 Danh Sách Sản Phẩm
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3, textTransform: 'none', fontSize: '1rem' }}
          onClick={() => {
            console.log('Add new product');
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }} onClick={() => navigate('/store/productManagement/create')}>+ Thêm Sản Phẩm Mới</Typography>
        </Button>

        {/* Table */}
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }} aria-label="products table">
            <StyledTableHead>
              <TableRow>
                <TableCell align="center">Thao tác</TableCell>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center">Danh mục</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="center">Tồn kho</TableCell>
                {/* <TableCell>Cửa hàng</TableCell> */}
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {products.map((product, index) => (
                <StyledTableRow key={product._id}>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleClick(e, product._id)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem onClick={() => { handleEdit(selectedProductId); handleClose(); }}>
                        <EditIcon sx={{ mr: 1 }} />
                        Sửa
                      </MenuItem>
                      <MenuItem onClick={() => { confirmDelete(selectedProductId); handleClose(); }}>
                        <DeleteIcon sx={{ mr: 1 }} />
                        Xóa
                      </MenuItem>
                      <MenuItem onClick={() => { handleView(selectedProductId); handleClose(); }}>
                        <VisibilityIcon sx={{ mr: 1 }} />
                        Xem
                      </MenuItem>

                    </Menu>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Avatar
                      src={product.images[0]}
                      alt={product.name}
                      sx={{
                        width: 60,
                        height: 60,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        margin: '0 auto'
                      }}
                      variant="rounded"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ mb: 0.5 }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {product._id.slice(-8)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}
                    >
                      {product.description}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {product.categories && product.categories.length > 0 && (
                      <Chip
                        label={product.categories[0].name}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <PriceChip
                      label={formatPrice(product.price)}
                      size="medium"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Badge
                      badgeContent={product.inventory}
                      color={product.inventory > 10 ? "success" : product.inventory > 5 ? "warning" : "error"}
                      max={999}
                    >
                      <Chip
                        label="Kho"
                        variant="outlined"
                        size="small"
                        color={product.inventory > 10 ? "success" : product.inventory > 5 ? "warning" : "error"}
                      />
                    </Badge>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(product.createdAt)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={product.isActive ? "Hoạt động" : "Tạm dừng"}
                      color={product.isActive ? "success" : "error"}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{
              borderTop: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: 'grey.50',
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 3,
                paddingRight: 3,
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '1rem',
                fontWeight: 500,
              },
              '& .MuiTablePagination-actions button': {
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              },
            }}
          />
        </StyledTableContainer>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              📦 Không có sản phẩm nào
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Hiện tại chưa có sản phẩm nào trong cửa hàng.
            </Typography>
          </Box>
        )}
      </Container>
      <ModelEditProduct
        dataDetail={dataDetail}
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataProducts={fetchProducts}
      />
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>


    </ThemeProvider>
  );
}

export default ProductStore;