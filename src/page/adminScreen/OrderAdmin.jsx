import React, { useState, useEffect } from "react";
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
  IconButton,
  Collapse,
  Button,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  TablePagination,
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Person,
  Store,
  LocalOffer,
  Search,
  Download,
} from "@mui/icons-material";
import fetchUtils from "../../utils/fetchUtils.jsx";
import apiConfig from "../../configs/apiConfig.jsx";
import { saveAs } from "file-saver";

function formatCurrency(amount) {
  return amount?.toLocaleString("vi-VN") + " ₫";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("vi-VN");
}

function getStatusColor(status) {
  const statusColors = {
    confirmed: "success",
    cancelled: "error",
    pending: "warning",
    processing: "info",
    completed: "primary",
  };
  return statusColors[status] || "default";
}

function getStatusLabel(status) {
  const statusLabels = {
    confirmed: "Đã xác nhận",
    cancelled: "Đã hủy",
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
  };
  return statusLabels[status] || status;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  // Excel export menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportType, setExportType] = useState("all");
  const [dialog, setDialog] = useState({
    open: false,
    type: "",
    year: "",
    month: "",
    week: "",
    storeId: "",
  });

  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchUtils
      .get("/stores")
      .then((res) => {
        setStores(res);
      })
      .catch((err) => setStores([]));
  }, []);

  // Lấy dữ liệu mẫu từ API (bạn thay bằng fetch thực tế)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage,
      ...(search && { search }),
    });
    fetchUtils
      .get(`/admin/orders?${params.toString()}`, true)
      .then((data) => {
        setOrders(data.orders || []);
        setTotalOrders(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError("Lỗi khi tải đơn hàng: " + err.message);
        setLoading(false);
      });
  }, [page, rowsPerPage, search]);

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Search submit
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(0);
  };

  // Excel export
  const handleExport = async () => {
    try {
      const token = fetchUtils.getAuthToken();
      const params = new URLSearchParams({
        storeId: dialog.storeId || "",
        year: dialog.year || "",
        month: dialog.month || "",
        week: dialog.week || "",
      });
      const response = await fetch(
        apiConfig.baseUrl + "/admin/orders/export?" + params.toString(),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải file Excel");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "orders.xlsx";
      console.log("contentDisposition", contentDisposition);
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (err) {
      alert("Lỗi khi xuất Excel: " + err.message);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold" color="#d32f2f">
          Quản lý đơn hàng (Admin)
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={() => setDialog({ ...dialog, open: true })}
          sx={{ mr: 2 }}
        >
          Xuất Excel
        </Button>
      </Box>
      <Box mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm mã đơn, khách hàng, cửa hàng..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350, background: "#fff" }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </Box>
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body1">
            Tổng số đơn hàng: <b>{totalOrders}</b>
          </Typography>
        </CardContent>
      </Card>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#d32f2f" }}>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
              ></TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mã đơn hàng
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Khách hàng
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Cửa hàng
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tổng tiền
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Xem thêm
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress sx={{ color: "#d32f2f" }} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="info">Không có đơn hàng nào.</Alert>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(order._id)}
                        sx={{
                          backgroundColor: expandedRows[order._id]
                            ? "#d32f2f"
                            : "transparent",
                          color: expandedRows[order._id] ? "white" : "#d32f2f",
                        }}
                      >
                        {expandedRows[order._id] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="#d32f2f">
                        #{order.orderCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: "#d32f2f", mr: 1 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold">
                            {order.user?.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: "#1976d2", mr: 1 }}>
                          <Store />
                        </Avatar>
                        <Typography fontWeight="bold">
                          {order.store?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="#2e7d32">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>{formatDate(order.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleRowExpansion(order._id)}
                        sx={{
                          color: "#d32f2f",
                          borderColor: "#d32f2f",
                          "&:hover": {
                            backgroundColor: "#fbe9e7",
                            borderColor: "#c62828",
                          },
                        }}
                      >
                        {expandedRows[order._id] ? "Ẩn bớt" : "Xem thêm"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* Chi tiết đơn hàng */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, background: "#fafafa" }}>
                      <Collapse
                        in={expandedRows[order._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="h6"
                                color="#d32f2f"
                                gutterBottom
                              >
                                Sản phẩm trong đơn
                              </Typography>
                              <Divider sx={{ mb: 1 }} />
                              {order.items.map((item, idx) => (
                                <Box key={idx} sx={{ mb: 2, pl: 1 }}>
                                  <Typography fontWeight="bold">
                                    {item.productName}{" "}
                                    <span style={{ color: "#888" }}>
                                      x{item.quantity}
                                    </span>
                                  </Typography>
                                  <Typography variant="body2">
                                    Giá: {formatCurrency(item.unitPrice)} |
                                    Thành tiền:{" "}
                                    {formatCurrency(item.finalSubTotal)}
                                  </Typography>
                                  {item.voucher && (
                                    <Chip
                                      icon={<LocalOffer />}
                                      label={`Voucher: ${item.voucher.code} (${
                                        item.voucher.discountType === "fixed"
                                          ? formatCurrency(
                                              item.voucher.discountValue
                                            )
                                          : item.voucher.discountValue + "%"
                                      })`}
                                      color="success"
                                      size="small"
                                      sx={{ mt: 0.5 }}
                                    />
                                  )}
                                  {item.discountApplied > 0 && (
                                    <Typography variant="body2" color="#2e7d32">
                                      Giảm giá: -
                                      {formatCurrency(item.discountApplied)}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="h6"
                                color="#d32f2f"
                                gutterBottom
                              >
                                Thông tin đơn hàng
                              </Typography>
                              <Divider sx={{ mb: 1 }} />
                              <Typography>
                                <b>Tổng số lượng:</b> {order.totalQuantity}
                              </Typography>
                              <Typography>
                                <b>Tổng tiền hàng:</b>{" "}
                                {formatCurrency(order.subTotal)}
                              </Typography>
                              <Typography>
                                <b>Tổng giảm giá:</b>{" "}
                                {formatCurrency(order.totalDiscount)}
                              </Typography>
                              <Typography>
                                <b>Phí ship:</b>{" "}
                                {formatCurrency(order.shippingFee)}
                              </Typography>
                              <Typography>
                                <b>Tổng thanh toán:</b>{" "}
                                {formatCurrency(order.totalAmount)}
                              </Typography>
                              <Typography>
                                <b>Tổng voucher:</b>{" "}
                                {formatCurrency(order.totalVoucher)}
                              </Typography>
                              <Typography>
                                <b>Hoa hồng voucher (20%):</b>{" "}
                                {formatCurrency(order.voucherCommission)}
                              </Typography>
                              <Typography>
                                <b>Phương thức thanh toán:</b>{" "}
                                {order.paymentMethod}
                              </Typography>
                              <Typography>
                                <b>Trạng thái thanh toán:</b>{" "}
                                {order.paymentStatus}
                              </Typography>
                              <Typography>
                                <b>Ngày tạo:</b> {formatDate(order.createdAt)}
                              </Typography>
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
      <Box sx={{ mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Box>
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
      >
        <DialogTitle>Xuất Excel đơn hàng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cửa hàng</InputLabel>
            <Select
              value={dialog.storeId || ""}
              label="Cửa hàng"
              onChange={(e) =>
                setDialog({ ...dialog, storeId: e.target.value })
              }
            >
              <MenuItem value="">Tất cả</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store._id} value={store._id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Năm</InputLabel>
            <Select
              value={dialog.year || ""}
              label="Năm"
              onChange={(e) =>
                setDialog({
                  ...dialog,
                  year: e.target.value,
                  month: "",
                  week: "",
                })
              }
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tháng</InputLabel>
            <Select
              value={dialog.month || ""}
              label="Tháng"
              onChange={(e) =>
                setDialog({ ...dialog, month: e.target.value, week: "" })
              }
              disabled={!dialog.year}
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tuần</InputLabel>
            <Select
              value={dialog.week || ""}
              label="Tuần"
              onChange={(e) => setDialog({ ...dialog, week: e.target.value })}
              disabled={!dialog.year || !dialog.month}
            >
              {[1, 2, 3, 4, 5].map((w) => (
                <MenuItem key={w} value={w}>{`Tuần ${w}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleExport();
              setDialog({ ...dialog, open: false });
            }}
          >
            Xuất Excel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
