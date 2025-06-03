import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"; // Sử dụng Material UI
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedIcon,
  Image as ImageIcon,
  Email,
} from "@mui/icons-material"; // Sử dụng Material UI icons
import { styled } from "@mui/material/styles";
import {
  UserOutlined
} from "@ant-design/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
// import authService from '../../services/AuthService'; // Sẽ thay thế bằng API call với fetchUtils
import {
  notifySuccess,
  notifyError,
} from "../../components/notification/ToastNotification"; // Sử dụng notification từ scanme-frontend
import fetchUtils from "../../utils/fetchUtils"; // Sử dụng fetchUtils cho API calls

// Styled components (có thể giữ nguyên nếu muốn sử dụng Material UI styled components)
const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: "#f5f5f5", // Light background
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  width: "200px",
}));

const InfoContent = styled(Box)({
  flex: 1,
});

const EditButton = styled(Button)({
  backgroundColor: "#f5f5f5", // Off-white background
  color: "#0071c2",
  textTransform: "none",
  padding: "4px 12px",
  borderRadius: "4px",
  fontWeight: 500,
  fontSize: "13px",
  minWidth: "80px",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
});

// Đổi tên component từ Profile thành ProfilePage
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Thêm state loading

  // State cho form data (khởi tạo từ user)
  const [formData, setFormData] = useState({
    fullName: "", // Sử dụng fullName theo schema scanme-backend
    email: "",
    phone: "",
    dateOfBirth: null, // Sử dụng null cho ngày tháng chưa có giá trị
    gender: "",
    address: "",
    avatar: "",
    // Các trường khác từ schema User của scanme-backend nếu cần
    username: "", // Chỉ hiển thị, không chỉnh sửa
    role: "", // Chỉ hiển thị, không chỉnh sửa
    createdAt: null,
  });

  // State cho các modal chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // State cho modal upload ảnh
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // File ảnh được chọn
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // URL để preview ảnh

  // Hàm fetch thông tin user
  const fetchUser = async () => {
    try {
      setLoading(true);
      // API: GET /api/user/profile (hoặc tương tự, cần tạo API này ở backend)
      // Sử dụng fetchUtils với requiresAuth: true
      const response = await fetchUtils.get("/user/profile", true);

      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        // Khởi tạo formData với dữ liệu user từ backend
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          dateOfBirth: userData.dateOfBirth
            ? dayjs(userData.dateOfBirth)
            : null, // Sử dụng dayjs cho DatePicker
          gender: userData.gender || "",
          address: userData.address || "",
          avatar: userData.avatar || "",
          username: userData.username || "",
          role: userData.role || "",
          createdAt: userData.createdAt || null,
        });
        setImagePreviewUrl(userData.avatar || ""); // Set ảnh preview ban đầu
      } else {
        // Xử lý trường hợp không lấy được user (ví dụ: redirect về login)
        notifyError(response.message || "Không thể lấy thông tin user");
        // navigate("/login"); // Tùy chọn: redirect nếu không auth
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      notifyError("Lỗi khi lấy thông tin user");
      // navigate("/login"); // Tùy chọn: redirect nếu có lỗi fetch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Fetch user khi component mount

  // Xử lý mở dialog chỉnh sửa
  const handleOpenEditDialog = (field) => {
    setEditingField(field);
    // Khởi tạo giá trị tạm thời từ formData
    if (field === "dateOfBirth") {
      setTempValue(formData[field]); // dayjs object
    } else {
      setTempValue(formData[field] || "");
    }
    setOpenEditDialog(true);
  };

  // Xử lý đóng dialog chỉnh sửa
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingField(null);
    setTempValue("");
  };

  // Xử lý thay đổi giá trị trong dialog
  const handleDialogInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleDateChange = (date) => {
    setTempValue(date);
  };

  const handleGenderChange = (e) => {
    setTempValue(e.target.value);
  };

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = async () => {
    if (!editingField) return;

    try {
      // API: PUT /api/user/profile (hoặc tương tự, cần tạo API này ở backend)
      // Gửi chỉ trường dữ liệu đã thay đổi
      const updateData = { [editingField]: tempValue };

      // Xử lý định dạng ngày tháng cho backend nếu cần
      if (editingField === "dateOfBirth" && tempValue) {
        updateData.dateOfBirth = tempValue.format("YYYY-MM-DD"); // Hoặc định dạng backend mong muốn
      }

      const response = await fetchUtils.put("/user/profile", updateData, true); // requiresAuth: true

      if (response.success) {
        notifySuccess("Cập nhật thông tin thành công");
        // Cập nhật state user và formData sau khi lưu thành công
        setUser((prevUser) => ({ ...prevUser, [editingField]: tempValue }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          [editingField]: tempValue,
        }));
        handleCloseEditDialog();
      } else {
        notifyError(response.message || "Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      notifyError("Lỗi khi cập nhật thông tin");
    }
  };

  // Xử lý mở dialog upload ảnh
  const handleOpenImageDialog = () => {
    setOpenImageDialog(true);
  };

  // Xử lý đóng dialog upload ảnh
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImageFile(null);
    // Không clear imagePreviewUrl ở đây để giữ ảnh user hiện tại
  };

  // Xử lý chọn ảnh
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      // Tạo URL tạm thời để preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý xóa ảnh (tạm thời clear preview, cần API backend để xóa thật)
  const handleDeleteImage = async () => {
    try {
      // API: DELETE /api/user/avatar (hoặc tương tự, cần tạo)
      // Gửi yêu cầu xóa avatar
      const response = await fetchUtils.remove("/user/avatar", true); // requiresAuth: true

      if (response.success) {
        notifySuccess("Xóa ảnh đại diện thành công");
        setUser((prevUser) => ({ ...prevUser, avatar: "" }));
        setFormData((prevFormData) => ({ ...prevFormData, avatar: "" }));
        setImagePreviewUrl("");
        handleCloseImageDialog();
      } else {
        notifyError(response.message || "Xóa ảnh đại diện thất bại");
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      notifyError("Lỗi khi xóa ảnh đại diện");
    }
  };

  // Xử lý lưu ảnh đại diện
  const handleSaveImage = async () => {
    if (!selectedImageFile) {
      notifyError("Vui lòng chọn ảnh để tải lên");
      return;
    }

    try {
      // API: POST /api/user/avatar (hoặc tương tự, cần tạo)
      // Sử dụng FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append("avatar", selectedImageFile);

      const response = await fetchUtils.post(
        "/user/avatar",
        formDataToSend,
        true,
        true
      ); // requiresAuth: true, isFormData: true

      if (response.success) {
        notifySuccess("Cập nhật ảnh đại diện thành công");
        // Cập nhật state user và formData với URL ảnh mới
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.avatarUrl,
        })); // Giả định API trả về avatarUrl
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: response.data.avatarUrl,
        }));
        handleCloseImageDialog();
      } else {
        notifyError(response.message || "Cập nhật ảnh đại diện thất bại");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notifyError("Lỗi khi tải ảnh đại diện");
    }
  };

  // Component con để hiển thị từng dòng thông tin
  const InfoItem = ({ label, value, verified, field, onEdit }) => (
    <InfoRow>
      <InfoLabel>{label}</InfoLabel>
      <InfoContent>
        <Typography>{value}</Typography>
        {verified && (
          <VerifiedIcon
            color="primary"
            style={{ fontSize: "16px", marginLeft: "4px" }}
          />
        )}
      </InfoContent>
      {onEdit &&
        // Không hiển thị nút Edit cho Username và Role nếu không cho phép chỉnh sửa
        field !== "username" &&
        field !== "role" &&
        field !== "createdAt" && (
          <EditButton onClick={() => onEdit(field)} size="small">
            Chỉnh sửa
          </EditButton>
        )}
    </InfoRow>
  );

  // Hàm render trường chỉnh sửa trong dialog
  const renderEditField = () => {
    switch (editingField) {
      case "fullName":
        return (
          <TextField
            autoFocus
            margin="dense"
            label="Họ và tên"
            type="text"
            fullWidth
            value={tempValue}
            onChange={handleDialogInputChange}
          />
        );
      case "email":
        return (
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={tempValue}
            onChange={handleDialogInputChange}
            disabled
          />
        ); // Email thường không cho chỉnh sửa
      case "phone":
        return (
          <TextField
            autoFocus
            margin="dense"
            label="Số điện thoại"
            type="tel"
            fullWidth
            value={tempValue}
            onChange={handleDialogInputChange}
          />
        );
      case "dateOfBirth":
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày sinh"
              value={tempValue ? dayjs(tempValue) : null} // Sử dụng dayjs object
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="dense" />
              )}
            />
          </LocalizationProvider>
        );
      case "gender":
        return (
          <FormControl fullWidth margin="dense">
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={tempValue}
              label="Giới tính"
              onChange={handleGenderChange}
            >
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
        );
      case "address":
        return (
          <TextField
            autoFocus
            margin="dense"
            label="Địa chỉ"
            type="text"
            fullWidth
            value={tempValue}
            onChange={handleDialogInputChange}
            multiline
            rows={3}
          />
        );
      // Thêm các case khác nếu có trường có thể chỉnh sửa
      default:
        return null;
    }
  };

  // Tiêu đề của dialog chỉnh sửa
  const getEditDialogTitle = () => {
    switch (editingField) {
      case "fullName":
        return "Chỉnh sửa Họ và tên";
      case "email":
        return "Chỉnh sửa Email";
      case "phone":
        return "Chỉnh sửa Số điện thoại";
      case "dateOfBirth":
        return "Chỉnh sửa Ngày sinh";
      case "gender":
        return "Chỉnh sửa Giới tính";
      case "address":
        return "Chỉnh sửa Địa chỉ";
      default:
        return "Chỉnh sửa";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {" "}
      {/* Bao bọc component để sử dụng DatePicker */}
      <ProfileContainer maxWidth="md">
        {" "}
        {/* Sử dụng ProfileContainer */}
        <ProfilePaper elevation={3}>
          {" "}
          {/* Sử dụng ProfilePaper */}
          <Grid container spacing={3} alignItems="center">
            {/* Cột trái: Avatar và upload */}
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box position="relative">
                <LargeAvatar
                  src={imagePreviewUrl || formData.avatar}
                  alt={formData.fullName || formData.username}
                >
                  {" "}
                  {/* Sử dụng LargeAvatar, hiển thị preview hoặc avatar hiện tại */}
                  {!imagePreviewUrl && !formData.avatar && (
                    <UserOutlined style={{ fontSize: 60 }} />
                  )}{" "}
                  {/* Icon mặc định nếu không có ảnh */}
                </LargeAvatar>
                {/* Nút upload ảnh */}
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  onClick={handleOpenImageDialog} // Mở dialog upload ảnh
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" gutterBottom>
                {formData.fullName || formData.username}
              </Typography>{" "}
              {/* Tên/Username */}
              <Typography variant="body2" color="text.secondary">
                {formData.role}
              </Typography>{" "}
              {/* Vai trò */}
            </Grid>

            {/* Cột phải: Thông tin chi tiết */}
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {/* Các dòng thông tin */}
              {/* Email (thường không cho chỉnh sửa) */}
              <InfoItem
                label="Email"
                value={formData.email}
                verified={user.verified}
                field="email"
                onEdit={handleOpenEditDialog}
              />
              {/* Username (thường không cho chỉnh sửa) */}
              <InfoItem
                label="Username"
                value={formData.username}
                field="username"
              />{" "}
              {/* Không có onEdit */}
              {/* Ngày tham gia (chỉ hiển thị) */}
              <InfoItem
                label="Ngày tham gia"
                value={
                  formData.createdAt
                    ? dayjs(formData.createdAt).format("DD/MM/YYYY")
                    : "-"
                }
                field="createdAt"
              />{" "}
              {/* Không có onEdit */}
              {/* Các trường có thể chỉnh sửa */}
              <InfoItem
                label="Họ và tên"
                value={formData.fullName}
                field="fullName"
                onEdit={handleOpenEditDialog}
              />
              <InfoItem
                label="Số điện thoại"
                value={formData.phone}
                field="phone"
                onEdit={handleOpenEditDialog}
              />
              {/* Ngày sinh */}
              <InfoItem
                label="Ngày sinh"
                value={
                  formData.dateOfBirth
                    ? dayjs(formData.dateOfBirth).format("DD/MM/YYYY")
                    : "-"
                }
                field="dateOfBirth"
                onEdit={handleOpenEditDialog}
              />
              <InfoItem
                label="Giới tính"
                value={formData.gender}
                field="gender"
                onEdit={handleOpenEditDialog}
              />
              <InfoItem
                label="Địa chỉ"
                value={formData.address}
                field="address"
                onEdit={handleOpenEditDialog}
              />
              {/* Thêm các InfoItem khác cho các trường thông tin khác nếu có */}
            </Grid>
          </Grid>
        </ProfilePaper>
      </ProfileContainer>
      {/* Dialog chỉnh sửa thông tin */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{getEditDialogTitle()}</DialogTitle>{" "}
        {/* Tiêu đề dialog */}
        <DialogContent>{renderEditField()}</DialogContent>{" "}
        {/* Render trường chỉnh sửa */}
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog upload ảnh đại diện */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        aria-labelledby="image-upload-dialog-title"
      >
        <DialogTitle id="image-upload-dialog-title">
          Cập nhật ảnh đại diện
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            {/* Preview ảnh */}
            {imagePreviewUrl ? (
              <Avatar src={imagePreviewUrl} sx={{ width: 100, height: 100 }} />
            ) : formData.avatar ? (
              <Avatar src={formData.avatar} sx={{ width: 100, height: 100 }} />
            ) : (
              <ImageIcon
                sx={{ width: 100, height: 100, color: "text.secondary" }}
              />
            )}

            {/* Nút chọn ảnh */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-avatar-file"
              type="file"
              onChange={handleImageSelect}
            />
            <label htmlFor="upload-avatar-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
              >
                Chọn ảnh
              </Button>
            </label>

            {/* Nút xóa ảnh (chỉ hiển thị nếu có ảnh) */}
            {(imagePreviewUrl || formData.avatar) && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<EditIcon />}
                onClick={handleDeleteImage}
              >
                Xóa ảnh
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveImage}
            color="primary"
            disabled={!selectedImageFile && !formData.avatar}
          >
            Lưu ảnh
          </Button>{" "}
          {/* Disable nếu chưa chọn ảnh và không có ảnh cũ */}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

// Export component với tên mới
export default ProfilePage;
