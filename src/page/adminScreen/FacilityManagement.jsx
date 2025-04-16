import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import FacilityService from "../../services/FacilityService";
import Loading from "../../components/loading/Loading.jsx";
import {notifyError, notifySuccess} from "../../components/notification/ToastNotification.jsx";
const FacilityModal = ({ open, onClose, onSubmit, facility }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Điền dữ liệu vào form nếu là chỉnh sửa
  useEffect(() => {
    if (facility) {
      setName(facility.name);
      setDescription(facility.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [facility]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
  };
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {facility ? "Chỉnh sửa vật tư" : "Thêm vật tư"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên vật tư"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            {facility ? "Cập nhật" : "Thêm"}
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

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const facilities = await FacilityService.getAllFacilities();
        setFacilities(facilities);
      } catch (error) {
        notifyError(error.message);
        console.error("Lỗi khi lấy danh sách vật tư:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Lọc vật tư dựa trên từ khóa tìm kiếm
  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (facility.description &&
        facility.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số lượng vật tư mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Xử lý xóa vật tư
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật tư này?")) {
      try {
        await FacilityService.deleteFacility(id);
        setFacilities(facilities.filter((facility) => facility._id !== id));
        notifySuccess("Xóa vật tư thành công");
      } catch (error) {
        notifyError(error.message);
        console.error("Lỗi khi xóa vật tư:", error.message);
      }
    }
  };

  // Xử lý mở modal
  const handleOpenModal = (facility = null) => {
    setSelectedFacility(facility);
    setModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFacility(null);
  };

  // Xử lý submit form trong modal
  const handleSubmit = async (facilityData) => {
    try {
      if (selectedFacility) {
        const updatedFacility = await FacilityService.updateFacility(
          selectedFacility._id,
          facilityData
        );
        setFacilities(
          facilities.map((f) =>
            f._id === selectedFacility._id ? updatedFacility : f
          )
        );
        notifySuccess("Cập nhật vật tư thành công");
      } else {
        const newFacility = await FacilityService.createFacility(facilityData);
        setFacilities([...facilities, newFacility]);
        
        notifySuccess("Tạo mới vật tư thành công");

      }
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu vật tư:", error.message);
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
          Quản lý vật tư
        </Typography>
      </Box>

      <StyledCard sx={{ mt: 10 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Danh sách vật tư
            </Typography>
          }
          action={
            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              onClick={() => handleOpenModal()}
            >
              Thêm vật tư
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
              placeholder="Tìm kiếm vật tư..."
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

          {/* Bảng vật tư */}
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
                  <TableCell sx={{ fontWeight: 600 }}>Tên vật tư</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFacilities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((facility) => (
                    <TableRow
                      key={facility._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#3f51b5", 0.04),
                        },
                      }}
                    >
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>
                        {facility.description || "Không có"}
                      </TableCell>
                      <TableCell>
                        {new Date(facility.created_at).toLocaleDateString()}
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
                            onClick={() => handleOpenModal(facility)}
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
                            onClick={() => handleDelete(facility._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredFacilities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Không tìm thấy vật tư nào
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
            count={filteredFacilities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Vật tư mỗi trang:"
            sx={{
              ".MuiTablePagination-select": {
                borderRadius: 2,
                mr: 1,
              },
            }}
          />
        </CardContent>
      </StyledCard>

      {/* Modal cho thêm và chỉnh sửa vật tư */}
      <FacilityModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        facility={selectedFacility}
      />
    </Container>
  );
};

export default FacilityManagement;
