import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';

// Styled components
const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5', // Light background
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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  width: '200px',
}));

const InfoContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f5f5f5', // Off-white background
  color: '#0071c2',
  textTransform: 'none',
  padding: '4px 12px',
  borderRadius: '4px',
  fontWeight: 500,
  fontSize: '13px',
  minWidth: '80px',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  const checkAuthStatus = async () => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastCheckTime < 2000) {
        return;
      }
      setLastCheckTime(currentTime);

      if (!authService.isAuthenticated()) {
        handleLogout(false);
        return;
      }

      const userData = await authService.getUser();
      if (userData && userData.data) {
        setUser(userData.data);
      } else {
        handleLogout(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (error.message.includes("Too Many Requests")) {
        return;
      }
      handleLogout(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (token && username) {
      setUser({ username: username });
      checkAuthStatus();
    }
  }, []);
  

  // State cho các modal
  const [openModal, setOpenModal] = useState({
    name: false,
    email: false,
    phone: false,
    dateOfBirth: false,
    gender: false,
    address: false
  });

  // State cho form data
  const [formData, setFormData] = useState({
    firstName: user?.firstName  || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    address: user?.address || "",
    avatar: user?.avatar || "",
    countryCode: '+84',
  });

  const [editingField, setEditingField] = useState(null);

  // State for image upload dialog and image preview
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  // Xử lý mở/đóng modal
  const handleOpenModal = (field) => {
    // Chuyển field name thành lowercase và loại bỏ khoảng trắng
    const modalField = field.toLowerCase().replace(/\s+/g, '');
    setOpenModal(prev => ({ ...prev, [modalField]: true }));
  };

  const handleCloseModal = (field) => {
    setOpenModal({ ...openModal, [field]: false });
  };

  // Xử lý lưu dữ liệu

  const handleCancel = () => {
    setEditingField(null);
    // Reset form data to original values
    setFormData({
      ...formData,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address
    });
  };

  // Handle opening the image dialog
  const handleOpenImageDialog = () => {
    setOpenImageDialog(true);
  };

  // Handle closing the image dialog
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    setSelectedImage(null);
  };

  // Handle saving the image
  const handleSaveImage = () => {
    // Logic to save the image
    console.log('Image saved:', selectedImage);
    handleCloseImageDialog();
  };

  const InfoItem = ({ label, value, verified, description, field }) => (
    <InfoRow>
      <InfoLabel variant="body1">
        {label}
      </InfoLabel>
      <InfoContent>
        {editingField === field ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              {/* Name Input */}
              {field === 'name' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" color="text.primary">
                        First name(s)
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          fontSize: '14px',
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" color="text.primary">
                        Last name(s)
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          fontSize: '14px',
                        }
                      }}
                    />
                  </Box>
                </Box>
              )}

              

              {/* Email Input */}
              {field === 'email' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.primary">
                      Email address
                    </Typography>
                    <Typography
                      component="span"
                      color="error.main"
                      sx={{ ml: 0.5, fontSize: '13px' }}
                    >
                      *
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        fontSize: '14px',
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: '13px'
                    }}
                  >
                    We'll send a verification link to your new email address – check your inbox.
                  </Typography>
                </Box>
              )}

              {/* Phone Input */}
              {field === 'phone' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={formData.countryCode || '+84'}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                        }
                      }}
                    >
                      <MenuItem value="+84">
                        <Box component="span" sx={{ mr: 1 }}>🇻🇳</Box> +84
                      </MenuItem>
                      <MenuItem value="+1">
                        <Box component="span" sx={{ mr: 1 }}>🇺🇸</Box> +1
                      </MenuItem>
                      <MenuItem value="+44">
                        <Box component="span" sx={{ mr: 1 }}>🇬🇧</Box> +44
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        fontSize: '14px',
                      }
                    }}
                  />
                </Box>
              )}

              {/* Date of Birth Input */}
              {field === 'dateofbirth' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(formData.dateOfBirth)}
                    onChange={(newValue) => setFormData({
                      ...formData,
                      dateOfBirth: newValue.format('YYYY-MM-DD')
                    })}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              )}

             {/* Email Input */}
             {field === 'address' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.primary">
                      Address
                    </Typography>
                    <Typography
                      component="span"
                      color="error.main"
                      sx={{ ml: 0.5, fontSize: '13px' }}
                    >
                      *
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        fontSize: '14px',
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: '13px'
                    }}
                  >
                    We'll send a verification link to your new email address – check your inbox.
                  </Typography>
                </Box>
              )}

              {/* Gender Select */}
              {field === 'gender' && (
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              )}

            
            </Box>

            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'flex-end',
              minWidth: '60px',
              mt: 0.5
            }}>
              <Button
                onClick={handleCancel}
                variant="contained"
                sx={{
                  backgroundColor: '#f5f5f5',
                  color: '#0071c2',
                  textTransform: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '13px',
                  minWidth: '80px',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSave(field)}
                sx={{
                  backgroundColor: '#0071c2',
                  color: '#fff',
                  textTransform: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '13px',
                  minWidth: '80px',
                  '&:hover': {
                    backgroundColor: '#005999'
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{value}</Typography>
              {verified && (
                <VerifiedIcon
                  sx={{
                    fontSize: 18,
                    color: '#0071c2'
                  }}
                />
              )}
            </Box>
            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 0.5,
                  fontSize: '13px'
                }}
              >
                {description}
              </Typography>
            )}
          </>
        )}
      </InfoContent>
      {!editingField && (
        <EditButton
          onClick={() => handleEdit(field)}
          sx={{
            color: '#0071c2',
            fontWeight: 500,
            fontSize: '13px',
            textTransform: 'none',
            padding: '4px 8px',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            }
          }}
        >
          Edit
        </EditButton>
      )}
    </InfoRow>
  );

  return (
    <ProfileContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Personal details
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Update your info and find out how it's used.
      </Typography>

      <ProfilePaper elevation={0} variant="outlined">
        <Box display="flex" justifyContent="center" position="relative">
          {selectedImage ? (
            <LargeAvatar src={selectedImage} />
          ) : (
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'grey.300' }}>
              <ImageIcon />
            </Avatar>
          )}
          <IconButton
            onClick={handleOpenImageDialog}
            sx={{
              position: 'absolute',
              right: -16,
              top: -16,
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
        </Box>

        {/* Image Upload Dialog */}
        <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
          <DialogTitle>Select an image to upload</DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box display="flex" justifyContent="center" mb={2}>
                <Avatar src={selectedImage} sx={{ width: 100, height: 100 }} />
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'block', margin: '20px 0' }}
            />
            {selectedImage && (
              <Button onClick={handleDeleteImage} color="secondary">
                Delete
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDialog} color="primary">
              Cancel
            </Button>
            {selectedImage && (
              <Button onClick={handleSaveImage} color="primary" variant="contained">
                Save
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <InfoItem
          label="Name"
          value={user?.lastName}
          field="name"
        />

        <InfoItem
          label="Display name"
          value={user?.displayName}
          field="displayname"
        />

        <InfoItem
          label="Email address"
          value={user?.email}
          verified={user?.emailVerified}
          description="This is the email address you use to sign in. It's also where we send your booking confirmations."
          field="email"
        />

        <InfoItem
          label="Phone number"
          value={user?.phone}
          description="Properties or attractions you book will use this number if they need to contact you."
          field="phone"
        />

        <InfoItem
          label="Date of birth"
          value={user?.dateOfBirth}
          field="dateofbirth"
        />

        <InfoItem
          label="Nationality"
          value={user?.nationality}
          field="nationality"
        />

        <InfoItem
          label="Gender"
          value={user?.gender}
          field="gender"
        />

        <InfoItem
          label="Password"
          value="********"
          onEdit={() => handleOpenModal('password')}
        />
      </ProfilePaper>
    </ProfileContainer>
  );
};

export default Profile; 