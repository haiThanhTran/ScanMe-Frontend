import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import {
  getStatusChip,
  SearchField,
  StatsCard,
  StyledCard,
  StyledTableCell,
  StyledTableRow,
} from "../../components/function/RoomCss";
import {
  Typography,
  Container,
  CardContent,
  Box,
  Grid,
  // CircularProgress,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  // Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Hotel as HotelIcon,
  CalendarMonth as CalendarMonthIcon,
  // Person as PersonIcon,
  Add as AddIcon,
  // FileDownload as FileDownloadIcon,
  // DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  createRoom,
  deleteRoom,
  getRoomList,
} from "../../services/RoomService";
import CreateRoomDialog from "../../components/roomAdmin/ModalCreateRoom";
import { message, Popconfirm } from "antd";
import { showMessage } from "../../components/notification/Message";
import EditRoomDialog from "../../components/roomAdmin/ModalEditRoom";

const RoomManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [searchRoom, setSearchRoom] = useState(rooms);
  const [messageApi, contextHolder] = message.useMessage();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setSearchRoom(rooms);
      return;
    }

    // Lọc danh sách theo tất cả các trường
    const filteredRooms = rooms.filter((room) =>
      Object.values(room).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );

    setSearchRoom(filteredRooms);
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };
  // Handle opening create booking dialog
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    booked: 0,
    maintenance: 0,
  });

  const fetchDataRooms = async () => {
    try {
      const response = await getRoomList();
      if (response) {
        console.log("response", response);
        setRooms(response);
        setSearchRoom(response);
        const roomStatus = {
          total: response.length,
          available: response.filter((item) => item.status == "available")
            .length,
          booked: response.filter((item) => item.status == "booked").length,
          maintenance: response.filter((item) => item.status == "maintenance")
            .length,
        };
        setStats(roomStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataRooms();
  }, []);

  const handleCreateRoom = async (data) => {
    try {
      const response = await createRoom(data);
      if (response) {
        fetchDataRooms();
        success();
      } else {
        error();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const response = await deleteRoom(id);
      if (response) {
        showMessage("success", "Delete room successfully", messageApi);
        fetchDataRooms();
      } else {
        showMessage("error", "Fail to delete room", messageApi);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirm = (id) => {
    handleDeleteRoom(id);
    message.success("Click on Yes");
  };
  const cancel = () => {
    message.error("Click on No");
  };

  const handleOpenEditDialog = (room) => {
    setSelectedRoom(room);
    setOpenEditDialog(true);
  };

  return (
    <Container maxWidth="xl">
      {contextHolder}
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1a237e" }}
        >
          Quản lý phòng
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Quản lý tất cả các loại phòng của khách sạn
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#4caf50">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Tổng số phòng của khách sạn
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {stats.total}
              </Typography>
            </Box>
            <HotelIcon sx={{ fontSize: 50, opacity: 0.8 }} />
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#2196f3">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Phòng có sẵn
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {stats.available}
              </Typography>
            </Box>
            <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.8 }} />
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#ff9800">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Phòng đã đặt
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {stats.booked}
              </Typography>
            </Box>
            <CalendarMonthIcon sx={{ fontSize: 50, opacity: 0.8 }} />
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#f44336">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Phòng bảo trì
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {stats.maintenance}
              </Typography>
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
                placeholder="Tìm kiếm theo số phòng, kiểu phòng, giá, hoặc trạng thái..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {/* <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{ borderRadius: 3 }}
                >
                  Lọc
                </Button> */}
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateDialog}
                  sx={{ borderRadius: 3 }}
                >
                  Thêm mới
                </Button>
                {/* <Button
                  variant="contained"
                  color="info"
                  startIcon={
                    exportLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <FileDownloadIcon />
                    )
                  }
                  disabled={exportLoading}
                  sx={{ borderRadius: 3 }}
                >
                  Xuất Excel
                </Button> */}
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  sx={{ borderRadius: 3 }}
                  onClick={() => {
                    setSearchRoom(rooms);
                    setSearchTerm("");
                  }}
                >
                  Làm mới
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Room table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Số phòng</StyledTableCell>
              <StyledTableCell align="center">Kiểu phòng</StyledTableCell>
              <StyledTableCell align="center">Giá</StyledTableCell>
              <StyledTableCell align="center">Khả năng</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">Mô tả</StyledTableCell>
              <StyledTableCell align="center">Thao Tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchRoom &&
              searchRoom.map((row) => (
                <StyledTableRow
                  key={row.room_number}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="center">
                    {row.room_number}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.type}</StyledTableCell>
                  <StyledTableCell align="center">{row.price}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.capacity}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getStatusChip(row.status)}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {row.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {/* <IconButton color="primary">
                      <VisibilityIcon />
                    </IconButton> */}
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenEditDialog(row)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      // onClick={() => handleDeleteRoom(row._id)}
                    >
                      <Popconfirm
                        title="Delete the room"
                        description="Are you sure to delete this room?"
                        onConfirm={() => confirm(row._id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteIcon />
                      </Popconfirm>
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create room dialog */}
      {openCreateDialog && (
        <CreateRoomDialog
          open={handleOpenCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {/* Edit room diaglog */}
      {openEditDialog && (
        <EditRoomDialog
          open={() => setOpenEditDialog(true)}
          onClose={() => setOpenEditDialog(false)}
          roomData={selectedRoom}
          onEditSuccess={fetchDataRooms}
        />
      )}
    </Container>
  );
};

export default RoomManagement;
