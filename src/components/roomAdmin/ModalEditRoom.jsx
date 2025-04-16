import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { message } from "antd";
import { updateRoom } from "../../services/RoomService";

const EditRoomDialog = ({ open, onClose, roomData, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    room_number: "",
    type: "",
    price: "",
    capacity: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    if (roomData) {
      console.log("roomData received:", roomData);
      setFormData(roomData);
    }
  }, [roomData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("name update", event.target.value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await updateRoom(roomData._id, formData);
      if (response) {
        message.success("Cập nhật phòng thành công!");
        onEditSuccess();
        onClose();
      } else {
        message.error("Cập nhật phòng thất bại!");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      message.error("Có lỗi xảy ra khi cập nhật phòng!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa phòng</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Số phòng"
          name="room_number"
          fullWidth
          value={formData.room_number}
          onChange={handleChange}
          disabled
        />
        <TextField
          margin="dense"
          select
          label="Kiểu phòng"
          name="type"
          fullWidth
          value={formData.type}
          onChange={handleChange}
        >
          <MenuItem value="single">Phòng đơn</MenuItem>
          <MenuItem value="double">Phòng đôi</MenuItem>
          <MenuItem value="suite">Phòng suite</MenuItem>
          <MenuItem value="family">Phòng gia đình</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          label="Giá"
          name="price"
          fullWidth
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Sức chứa"
          name="capacity"
          fullWidth
          type="number"
          value={formData.capacity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          select
          label="Trạng thái"
          name="status"
          fullWidth
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="available">Có sẵn</MenuItem>
          <MenuItem value="booked">Đã đặt</MenuItem>
          <MenuItem value="maintenance">Bảo trì</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Mô tả"
          name="description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoomDialog;
