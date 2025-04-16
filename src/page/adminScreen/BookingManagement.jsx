import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Card,
    CardContent,
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
    Chip,
    Box,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    CircularProgress,
    Divider,
    alpha,
    Snackbar,
    Alert,
    FormHelperText,
    Stack,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    Hotel as HotelIcon,
    CalendarMonth as CalendarMonthIcon,
    Person as PersonIcon,
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import BookingService from '../../services/BookingService';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    }
}));

const StatsCard = styled(Paper)(({ theme, bgcolor }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    backgroundColor: bgcolor,
    color: '#fff',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        backgroundColor: alpha('#fff', 0.1),
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
    }
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(3),
        backgroundColor: alpha(theme.palette.common.white, 0.9),
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s',
        '&:hover': {
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }
    }
}));

const BookingManagement = () => {
    // State variables
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0
    });
    
    // New state variables for creating booking
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [newBooking, setNewBooking] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        status: 'PENDING'
    });
    const [formErrors, setFormErrors] = useState({});
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // Mock data for statistics (in a real app, this would come from the API)
    useEffect(() => {
        const mockStats = {
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
            pending: bookings.filter(b => b.status === 'PENDING').length,
            cancelled: bookings.filter(b => b.status === 'CANCELLED').length
        };
        setStats(mockStats);
    }, [bookings]);

    // Fetch bookings
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await BookingService.getAllBookings(page, rowsPerPage, searchTerm);
            // Assuming the API returns { content: [...bookings], totalElements: number }
            // If your API has a different structure, adjust accordingly
            setBookings(response.content || []);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi tải dữ liệu đặt phòng',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchBookings();
    }, [page, rowsPerPage, searchTerm]);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    // Open dialog to update status
    const handleOpenStatusDialog = (booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBooking(null);
    };

    // Update booking status
    const handleUpdateStatus = async () => {
        if (!selectedBooking || !newStatus) return;

        try {
            await BookingService.updateBookingStatus(selectedBooking.id, newStatus);
            setSnackbar({
                open: true,
                message: 'Cập nhật trạng thái đặt phòng thành công',
                severity: 'success'
            });
            fetchBookings(); // Refresh data
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating booking status:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi cập nhật trạng thái đặt phòng',
                severity: 'error'
            });
        }
    };

    // Delete booking
    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đặt phòng này không?')) return;

        try {
            await BookingService.deleteBooking(id);
            setSnackbar({
                open: true,
                message: 'Xóa đặt phòng thành công',
                severity: 'success'
            });
            fetchBookings(); // Refresh data
        } catch (error) {
            console.error('Error deleting booking:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi xóa đặt phòng',
                severity: 'error'
            });
        }
    };

    // Handle snackbar close
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Get status chip color
    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Mock data for development (remove in production)
    useEffect(() => {
        // This is just for demonstration purposes
        const mockData = [
            {
                id: 1,
                customerName: 'Nguyễn Văn A',
                customerEmail: 'nguyenvana@example.com',
                customerPhone: '0901234567',
                roomName: 'Deluxe King Room',
                checkInDate: '2023-06-15T14:00:00',
                checkOutDate: '2023-06-18T12:00:00',
                totalPrice: 3500000,
                status: 'CONFIRMED',
                createdAt: '2023-06-01T09:23:45'
            },
            {
                id: 2,
                customerName: 'Trần Thị B',
                customerEmail: 'tranthib@example.com',
                customerPhone: '0912345678',
                roomName: 'Superior Twin Room',
                checkInDate: '2023-06-20T15:00:00',
                checkOutDate: '2023-06-22T11:00:00',
                totalPrice: 2200000,
                status: 'PENDING',
                createdAt: '2023-06-05T14:12:33'
            },
            {
                id: 3,
                customerName: 'Lê Văn C',
                customerEmail: 'levanc@example.com',
                customerPhone: '0923456789',
                roomName: 'Executive Suite',
                checkInDate: '2023-06-10T13:00:00',
                checkOutDate: '2023-06-12T12:00:00',
                totalPrice: 4800000,
                status: 'CANCELLED',
                createdAt: '2023-05-28T11:45:22'
            },
            {
                id: 4,
                customerName: 'Phạm Thị D',
                customerEmail: 'phamthid@example.com',
                customerPhone: '0934567890',
                roomName: 'Family Room',
                checkInDate: '2023-07-05T14:00:00',
                checkOutDate: '2023-07-10T12:00:00',
                totalPrice: 7500000,
                status: 'CONFIRMED',
                createdAt: '2023-06-10T16:33:21'
            },
            {
                id: 5,
                customerName: 'Hoàng Văn E',
                customerEmail: 'hoangvane@example.com',
                customerPhone: '0945678901',
                roomName: 'Standard Double Room',
                checkInDate: '2023-06-25T15:00:00',
                checkOutDate: '2023-06-27T11:00:00',
                totalPrice: 1800000,
                status: 'PENDING',
                createdAt: '2023-06-12T10:15:44'
            }
        ];
        
        setBookings(mockData);
        setTotalElements(mockData.length);
        
        const mockStats = {
            total: mockData.length,
            confirmed: mockData.filter(b => b.status === 'CONFIRMED').length,
            pending: mockData.filter(b => b.status === 'PENDING').length,
            cancelled: mockData.filter(b => b.status === 'CANCELLED').length
        };
        setStats(mockStats);
    }, []);

    // Fetch available rooms
    const fetchAvailableRooms = async () => {
        setLoadingRooms(true);
        try {
            const response = await BookingService.getAllRooms();
            setAvailableRooms(response.content || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi tải dữ liệu phòng',
                severity: 'error'
            });
        } finally {
            setLoadingRooms(false);
        }
    };

    // Handle opening create booking dialog
    const handleOpenCreateDialog = () => {
        fetchAvailableRooms();
        setOpenCreateDialog(true);
        setFormErrors({});
        setNewBooking({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            roomId: '',
            checkInDate: '',
            checkOutDate: '',
            status: 'PENDING'
        });
    };

    // Handle closing create booking dialog
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    // Handle input change for new booking form
    const handleNewBookingChange = (event) => {
        const { name, value } = event.target;
        setNewBooking({
            ...newBooking,
            [name]: value
        });
        
        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    };

    // Validate booking form
    const validateBookingForm = () => {
        const errors = {};
        
        if (!newBooking.customerName.trim()) {
            errors.customerName = 'Tên khách hàng không được để trống';
        }
        
        if (!newBooking.customerEmail.trim()) {
            errors.customerEmail = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(newBooking.customerEmail)) {
            errors.customerEmail = 'Email không hợp lệ';
        }
        
        if (!newBooking.customerPhone.trim()) {
            errors.customerPhone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(newBooking.customerPhone)) {
            errors.customerPhone = 'Số điện thoại không hợp lệ';
        }
        
        if (!newBooking.roomId) {
            errors.roomId = 'Vui lòng chọn phòng';
        }
        
        if (!newBooking.checkInDate) {
            errors.checkInDate = 'Vui lòng chọn ngày nhận phòng';
        }
        
        if (!newBooking.checkOutDate) {
            errors.checkOutDate = 'Vui lòng chọn ngày trả phòng';
        } else if (newBooking.checkInDate && new Date(newBooking.checkOutDate) <= new Date(newBooking.checkInDate)) {
            errors.checkOutDate = 'Ngày trả phòng phải sau ngày nhận phòng';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Create new booking
    const handleCreateBooking = async () => {
        if (!validateBookingForm()) return;
        
        try {
            await BookingService.createBooking(newBooking);
            setSnackbar({
                open: true,
                message: 'Tạo đặt phòng mới thành công',
                severity: 'success'
            });
            fetchBookings(); // Refresh data
            handleCloseCreateDialog();
        } catch (error) {
            console.error('Error creating booking:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi tạo đặt phòng mới: ' + error.message,
                severity: 'error'
            });
        }
    };

    // Export bookings to Excel
    const handleExportToExcel = async () => {
        setExportLoading(true);
        try {
            const blob = await BookingService.exportBookingsToExcel();
            
            // Create a download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            setSnackbar({
                open: true,
                message: 'Xuất dữ liệu thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error exporting bookings:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi xuất dữ liệu: ' + error.message,
                severity: 'error'
            });
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <Container maxWidth="xl">
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Quản lý đặt phòng
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Quản lý tất cả các đơn đặt phòng trong hệ thống
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard bgcolor="#4caf50">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Tổng đơn đặt phòng</Typography>
                            <Typography variant="h3" fontWeight="bold">{stats.total}</Typography>
                        </Box>
                        <HotelIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard bgcolor="#2196f3">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Đã xác nhận</Typography>
                            <Typography variant="h3" fontWeight="bold">{stats.confirmed}</Typography>
                        </Box>
                        <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard bgcolor="#ff9800">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Đang chờ</Typography>
                            <Typography variant="h3" fontWeight="bold">{stats.pending}</Typography>
                        </Box>
                        <CalendarMonthIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard bgcolor="#f44336">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Đã hủy</Typography>
                            <Typography variant="h3" fontWeight="bold">{stats.cancelled}</Typography>
                        </Box>
                        <CancelIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Search and Filter */}
            <StyledCard sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <SearchField
                                fullWidth
                                placeholder="Tìm kiếm theo tên khách hàng, email, số điện thoại hoặc tên phòng..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Lọc
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenCreateDialog}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Thêm mới
                                </Button>
                                <Button
                                    variant="contained"
                                    color="info"
                                    startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
                                    onClick={handleExportToExcel}
                                    disabled={exportLoading}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Xuất Excel
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => fetchBookings()}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Làm mới
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </StyledCard>

            {/* Bookings Table */}
            <StyledCard>
                <CardContent>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Khách hàng</TableCell>
                                        <TableCell>Phòng</TableCell>
                                        <TableCell>Ngày nhận phòng</TableCell>
                                        <TableCell>Ngày trả phòng</TableCell>
                                        <TableCell>Tổng tiền</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <TableRow key={booking.id} hover>
                                                <TableCell>{booking.id}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {booking.customerName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {booking.customerEmail}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {booking.customerPhone}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{booking.roomName}</TableCell>
                                                <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                                                <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(booking.totalPrice)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={booking.status === 'CONFIRMED' ? 'Đã xác nhận' : 
                                                               booking.status === 'PENDING' ? 'Đang chờ' : 'Đã hủy'}
                                                        color={getStatusColor(booking.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton size="small" color="primary">
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cập nhật trạng thái">
                                                            <IconButton 
                                                                size="small" 
                                                                color="secondary"
                                                                onClick={() => handleOpenStatusDialog(booking)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa">
                                                            <IconButton 
                                                                size="small" 
                                                                color="error"
                                                                onClick={() => handleDeleteBooking(booking.id)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                <Typography variant="body1" sx={{ py: 3 }}>
                                                    Không tìm thấy dữ liệu đặt phòng
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalElements}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Số hàng mỗi trang:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                        />
                    </TableContainer>
                </CardContent>
            </StyledCard>

            {/* Status Update Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Cập nhật trạng thái đặt phòng</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {selectedBooking && (
                            <>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Khách hàng:</strong> {selectedBooking.customerName}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Phòng:</strong> {selectedBooking.roomName}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                            </>
                        )}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={newStatus}
                                label="Trạng thái"
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                                <MenuItem value="PENDING">Đang chờ</MenuItem>
                                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleUpdateStatus} variant="contained" color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Booking Dialog */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
                <DialogTitle>Tạo đặt phòng mới</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tên khách hàng"
                                    name="customerName"
                                    value={newBooking.customerName}
                                    onChange={handleNewBookingChange}
                                    error={!!formErrors.customerName}
                                    helperText={formErrors.customerName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="customerEmail"
                                    type="email"
                                    value={newBooking.customerEmail}
                                    onChange={handleNewBookingChange}
                                    error={!!formErrors.customerEmail}
                                    helperText={formErrors.customerEmail}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="customerPhone"
                                    value={newBooking.customerPhone}
                                    onChange={handleNewBookingChange}
                                    error={!!formErrors.customerPhone}
                                    helperText={formErrors.customerPhone}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!formErrors.roomId} required>
                                    <InputLabel>Phòng</InputLabel>
                                    <Select
                                        name="roomId"
                                        value={newBooking.roomId}
                                        label="Phòng"
                                        onChange={handleNewBookingChange}
                                    >
                                        {loadingRooms ? (
                                            <MenuItem disabled>Đang tải...</MenuItem>
                                        ) : (
                                            availableRooms.map((room) => (
                                                <MenuItem key={room.id} value={room.id}>
                                                    {room.name} - {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(room.price)}/đêm
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {formErrors.roomId && <FormHelperText>{formErrors.roomId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày nhận phòng"
                                    name="checkInDate"
                                    type="datetime-local"
                                    value={newBooking.checkInDate}
                                    onChange={handleNewBookingChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!formErrors.checkInDate}
                                    helperText={formErrors.checkInDate}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DateRangeIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày trả phòng"
                                    name="checkOutDate"
                                    type="datetime-local"
                                    value={newBooking.checkOutDate}
                                    onChange={handleNewBookingChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!formErrors.checkOutDate}
                                    helperText={formErrors.checkOutDate}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DateRangeIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newBooking.status}
                                        label="Trạng thái"
                                        onChange={handleNewBookingChange}
                                    >
                                        <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                                        <MenuItem value="PENDING">Đang chờ</MenuItem>
                                        <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog}>Hủy</Button>
                    <Button onClick={handleCreateBooking} variant="contained" color="primary">
                        Tạo đặt phòng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BookingManagement;
