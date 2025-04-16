import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Divider,
  Tooltip,
  alpha,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../components/loading/Loading.jsx";
import { notifyError, notifySuccess } from "../../components/notification/ToastNotification.jsx";
import AdminDiscountService from '../../services/DiscountService.js';
const DiscountModal = ({ open, onClose, onSubmit, discount }) => {
  const [code, setCode] = useState("");
  const [discount_percentage, setPercentage] = useState(0);
  const [valid_from, setValidfrom] = useState(new Date());
  const [valid_to, setValidto] = useState(new Date());
  const [status, setStatus] = useState("");
  // Điền dữ liệu vào form nếu là chỉnh sửa
  useEffect(() => {
    if (discount) {
      setCode(discount.code);
      setPercentage(discount.discount_percentage || 0);
      setValidfrom(discount.valid_from || new Date());
      setValidto(discount.valid_to || new Date());
      setStatus(discount.status || "");
    } else {
      setCode("");
      setPercentage(0);
      setValidfrom(new Date());
      setValidto(new Date());
      setStatus("");
    }
  }, [discount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ code, discount_percentage, valid_from, valid_to, status });
  };
  useEffect(() => {
    if (!open) {
      setCode("");
      setPercentage(0);
      setValidfrom(new Date());
      setValidto(new Date());
      setStatus("");
    }
  }, [open]);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: '80vh',
          overflowY: 'auto',
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {discount ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Mã giảm giá"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="phần trăm giảm giá"
            value={discount_percentage}
            onChange={(e) => setPercentage(e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <DatePicker
                label="Mã giảm giá được áp dụng từ ngày"
                value={valid_from ? dayjs(valid_from) : null}
                onChange={(newValue) => setValidfrom(newValue ? newValue.toISOString() : "")}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DatePicker
                label="Ngày hết hạn mã giảm giá"
                value={valid_to ? dayjs(valid_to) : null}
                onChange={(newValue) => setValidto(newValue ? newValue.toISOString() : "")}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth margin="normal">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              style={{ listStyleType: 'none' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
            </Select>
          </FormControl>


         
          <Button type="submit" variant="contained" color="primary">
            {discount ? "Cập nhật" : "Thêm"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  width: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: "8px 16px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  },
}));

// Basic statistics

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setIsLoading(true);
        const discounts = await AdminDiscountService.getDiscount();
        setDiscounts(discounts);
      } catch (error) {
        notifyError(error.message);
        console.error("Lỗi khi lấy danh sách mã giảm giá:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscount();
  }, []);

  // Lọc mã giảm giá dựa trên từ khóa tìm kiếm
  const filteredDiscount = discounts.filter(
    (discount) =>
      discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số lượng mã giảm giá mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Xử lý xóa mã giảm giá
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa discount này?")) {
      try {
        await AdminDiscountService.deleteDiscount(id);
        setDiscounts(discounts.filter((discount) => discount._id !== id));
        notifySuccess("Xóa mã giảm giá thành công");
      } catch (error) {
        notifyError(error.message);
        console.error("Lỗi khi xóa mã giảm giá:", error.message);
      }
    }
  };

  // Xử lý mở modal
  const handleOpenModal = (discount = null) => {
    setSelectedDiscount(discount);
    setModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDiscount(null);
  };

  // Xử lý submit form trong modal
  const handleSubmit = async (discountData) => {
    try {
      if (selectedDiscount) {
        const updatedDiscount = await AdminDiscountService.updateDiscount(
          selectedDiscount._id,
          discountData
        );
        setDiscounts(
          discounts.map((f) =>
            f._id === selectedDiscount._id ? updatedDiscount : f
          )
        );
        notifySuccess("Cập nhật mã giảm giá thành công");
      } else {
        const newDiscount = await AdminDiscountService.createDiscount(discountData);
        setDiscounts([...discounts, newDiscount]);
        notifySuccess("Tạo mới mã giảm giá thành công");

      }
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu mã giảm giá:", error.message);
    }
  };

  

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        {isLoading && (
          <>
            <Loading />
          </>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý mã giảm giá
        </Typography>
      </Box>

      <StyledCard sx={{ mt: 10 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Danh sách mã giảm giá
            </Typography>
          }
          action={
            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              onClick={() => handleOpenModal()}
            >
              Thêm vật mã giảm giá
            </ActionButton>
          }
          sx={{ px: 3, py: 2.5 }}
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          {/* Thanh tìm kiếm */}
          <Box sx={{ display: "flex", mb: 4 }}>
            <SearchField
              size="small"
              placeholder="Tìm kiếm mã giảm giá..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
              fullWidth
              sx={{ mr: 2, maxWidth: 300 }}
            />
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 2,
                borderWidth: 1.5,
              }}
            >
              Lọc
            </Button>
          </Box>

          {/* Bảng mã giảm giá */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              mb: 2,
              width: "100%",
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Mã giảm giá</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phần trăm giảm giá</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date from</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date to</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiscount
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((discount) => (
                    <TableRow
                      key={discount._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#3f51b5", 0.04),
                        },
                      }}
                    >
                      <TableCell>{discount.code}</TableCell>
                      <TableCell>
                        {discount.discount_percentage || 0}
                      </TableCell>
                      <TableCell>
                        {new Date(discount.valid_from).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(discount.valid_to).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {discount.status}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            sx={{
                              mr: 1,
                              color: "primary.main",
                              bgcolor: alpha("#3f51b5", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#3f51b5", 0.2),
                              },
                            }}
                            onClick={() => handleOpenModal(discount)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            sx={{
                              color: "error.main",
                              bgcolor: alpha("#f44336", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#f44336", 0.2),
                              },
                            }}
                            onClick={() => handleDelete(discount._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredDiscount.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Không tìm thấy mã giảm giá nào
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDiscount.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Mã giảm giá mỗi trang:"
            sx={{
              ".MuiTablePagination-select": {
                borderRadius: 2,
                mr: 1,
              },
            }}
          />
        </CardContent>
      </StyledCard>

      {/* Modal cho thêm và chỉnh sửa mã giảm giá */}
      <DiscountModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        discount={selectedDiscount}
      />
    </Container>
  );
};

export default DiscountManagement;