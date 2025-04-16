import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState } from "react";

const CreateRoomDialog = ({ open, onClose, onCreate }) => {
  const [newRoom, setNewRoom] = useState({
    hotel_id: "67cb316af7e7d8fb1c4d7945",
    room_number: "",
    type: "",
    price: "",
    capacity: "",
    status: "available",
    description: "",
    facility: "67c7cbc042f9dd129474ae58",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let errors = {};
    if (!newRoom.room_number) errors.room_number = "Vui lòng nhập số phòng";
    if (!newRoom.type) errors.type = "Vui lòng chọn kiểu phòng";
    if (!newRoom.price || isNaN(newRoom.price))
      errors.price = "Giá phải là số hợp lệ";
    if (!newRoom.capacity || isNaN(newRoom.capacity))
      errors.capacity = "Sức chứa phải là số hợp lệ";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onCreate(newRoom);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo phòng mới</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số phòng"
              name="room_number"
              value={newRoom.room_number}
              onChange={handleChange}
              error={!!formErrors.room_number}
              helperText={formErrors.room_number}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.type}>
              <InputLabel>Kiểu phòng</InputLabel>
              <Select
                name="type"
                value={newRoom.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="double">Double</MenuItem>
                <MenuItem value="suite">Suite</MenuItem>
                <MenuItem value="family">Family</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giá (VND)"
              name="price"
              type="number"
              value={newRoom.price}
              onChange={handleChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sức chứa"
              name="capacity"
              type="number"
              value={newRoom.capacity}
              onChange={handleChange}
              error={!!formErrors.capacity}
              helperText={formErrors.capacity}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={newRoom.status}
                onChange={handleChange}
              >
                <MenuItem value="available">Có sẵn</MenuItem>
                <MenuItem value="booked">Đã đặt</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              multiline
              rows={3}
              value={newRoom.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Tạo phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomDialog;
