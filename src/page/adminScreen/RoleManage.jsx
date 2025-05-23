import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormGroup,
  FormControlLabel,
  Chip,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckCircleIcon,
  VisibilityOff as VisibilityOffIcon,
  Bookmark as BookmarkIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import {
  notifyError,
  notifySuccess,
} from "../../components/notification/ToastNotification.jsx";
import AdminService from "../../services/AdminService.jsx";
import Loading from "../../components/loading/Loading.jsx";
import RoleDialog from "../../components/dialog/RoleDialog.jsx";
import PermissionDialog from "../../components/dialog/PermissionDialog.jsx";
import { useNavigate } from "react-router-dom";

const RolePermissionManagement = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogRole, setOpenDialogRole] = useState(false);
  const [openDialogPermission, setOpenDialogPermission] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [roles, permissions, rolePermissions] = await Promise.all([
        AdminService.getRole(),
        AdminService.getPermission(),
        AdminService.getRolePermission(),
      ]);
      if (
        roles.status === 200 &&
        permissions.status === 200 &&
        rolePermissions.status === 200
      ) {
        setRoles(roles.data);
        setPermissions(permissions.data);
        setRolePermissions(rolePermissions.data);

        // Auto-select the first role if none is selected
        if (roles.data.length > 0 && !selectedRole) {
          setSelectedRole(roles.data[0]);
        }
      } else {
        notifyError("Error fetch data.");
      }
    } catch (e) {
      notifyError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (permissionId) => {
    if (!selectedRole) return;
    setRolePermissions((prevPermissions) => {
      const rolePermissionIndex = prevPermissions.findIndex(
        (rp) => rp.roleId === selectedRole._id
      );

      if (rolePermissionIndex === -1) {
        // Nếu role chưa có quyền nào, tạo mới
        return [
          ...prevPermissions,
          { roleId: selectedRole._id, permissionIds: [permissionId] },
        ];
      }

      const updatedPermissions = [...prevPermissions];
      const currentPermissions =
        updatedPermissions[rolePermissionIndex].permissionIds;

      if (currentPermissions.includes(permissionId)) {
        updatedPermissions[rolePermissionIndex].permissionIds =
          currentPermissions.filter((id) => id !== permissionId);
      } else {
        updatedPermissions[rolePermissionIndex].permissionIds.push(
          permissionId
        );
      }

      return updatedPermissions;
    });
  };

  const handleClose = () => {
    setOpenDialogRole(false);
    setOpenDialogPermission(false);
  };

  const handleOpenDialogRole = (role = null) => {
    setSelectedRole(role);
    setOpenDialogRole(true);
  };

  const handleOpenDialogPermission = (permission = null) => {
    setSelectedPermission(permission);
    setOpenDialogPermission(true);
  };

  const handleSaveRole = async (roleData) => {
    try {
      setIsLoading(true);
      if (selectedRole) {
      } else {
        const res = await AdminService.createRole(roleData);
        if (res.status === 200) {
          notifySuccess(res.message);
          fetchData();
        } else {
          notifyError(res.message);
        }
      }
    } catch (e) {
      notifyError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePermission = async (permissionData) => {
    try {
      setIsLoading(true);
      if (selectedPermission) {
      } else {
        const res = await AdminService.createPermission(permissionData);
        if (res.status === 200) {
          notifySuccess(res.message);
          fetchData();
        } else {
          notifyError(res.message);
        }
      }
    } catch (e) {
      notifyError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRolePermission = async (roleId) => {
    try {
      setIsLoading(true);
      const rolePermission = rolePermissions.find((rp) => rp.roleId === roleId);
      const dataReq = {
        id: rolePermission._id,
        permissions: rolePermission.permissionIds,
      };
      const res = await AdminService.updateRolePermission(dataReq);
      if (res.status === 200) {
        notifySuccess(res.message);
        fetchData();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        notifyError(res.message);
      }
    } catch (e) {
      notifyError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý các thao tác với roles
  const handleRoleActions = {
    select: (role) => setSelectedRole(role),
  };

  const getPermissionCount = (roleId) => {
    const rolePermission = rolePermissions.find((rp) => rp.roleId === roleId);
    return rolePermission && rolePermission.permissionIds
      ? rolePermission.permissionIds.length
      : 0;
  };

  // Group permissions by category (this is an example - you may need to adjust based on your actual data structure)
  const groupPermissions = () => {
    const groups = {};

    permissions.forEach((permission) => {
      // Extract category from permission code (assuming format like "user:read", "user:write")
      const category = permission.code.split(":")[0] || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  };

  const permissionGroups = groupPermissions();

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        p: { xs: 1, md: 2 },
        backgroundColor: "background.default",
      }}
    >
      {isLoading && <Loading />}

      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <SecurityIcon
          sx={{
            fontSize: 34,
            mr: 2,
            color: "primary.main",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý Role và Permission
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Danh sách Role */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              minHeight: 600,
              borderRadius: 2,
              overflow: "hidden",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BookmarkIcon
                    sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: 14,
                    }}
                  >
                    Danh sách vai trò
                  </Typography>
                </Box>
              }
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialogRole()}
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    boxShadow: 2,
                    fontSize: 12,
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  Thêm Role
                </Button>
              }
              sx={{
                p: 1.5,
                bgcolor: "background.paper",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            />
            <List
              sx={{
                overflow: "auto",
                height: "550px",
                pt: 0,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#a8a8a8",
                },
              }}
            >
              {roles.length === 0 ? (
                <Box
                  sx={{ p: 4, textAlign: "center", color: "text.secondary" }}
                >
                  <VisibilityOffIcon
                    sx={{ fontSize: 40, opacity: 0.5, mb: 2 }}
                  />
                  <Typography variant="body2">
                    Chưa có vai trò nào được tạo
                  </Typography>
                </Box>
              ) : (
                roles.map((role) => (
                  <ListItem
                    key={role._id}
                    disablePadding
                    divider
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          label={getPermissionCount(role._id)}
                          size="small"
                          sx={{
                            bgcolor: alpha(role.color, 0.9),
                            color: "white",
                            fontWeight: "bold",
                            height: 24,
                            fontSize: 11,
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            color: "primary.main",
                            p: 1,
                          }}
                          onClick={() => handleOpenDialogRole(role)}
                        >
                          <EditIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "error.main",
                            p: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    }
                    sx={{
                      transition: "all 0.2s",
                      pr: 1,
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <ListItemButton
                      selected={selectedRole && selectedRole?._id === role?._id}
                      onClick={() => handleRoleActions.select(role)}
                      sx={{
                        pr: 12,
                        py: 1.2,
                        borderLeft: "3px solid",
                        borderColor:
                          selectedRole && selectedRole._id === role._id
                            ? role.color
                            : "transparent",
                        transition: "all 0.2s",
                        "&.Mui-selected": {
                          backgroundColor: alpha(role.color, 0.08),
                          "&:hover": {
                            backgroundColor: alpha(role.color, 0.12),
                          },
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: role.color,
                          mr: 1.5,
                          width: 32,
                          height: 32,
                          fontSize: 14,
                        }}
                      >
                        {role.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight="500"
                            color={
                              selectedRole && selectedRole._id === role._id
                                ? "primary.main"
                                : "text.primary"
                            }
                            sx={{ fontSize: 13 }}
                          >
                            {role.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: 12,
                              maxWidth: "170px",
                            }}
                          >
                            {role.description}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Grid>

        {/* Danh sách Permission */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={2}
            sx={{
              minHeight: 600,
              borderRadius: 2,
              overflow: "hidden",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {selectedRole ? (
                    <Avatar
                      sx={{
                        bgcolor: selectedRole?.color,
                        mr: 1.5,
                        width: 32,
                        height: 32,
                        fontSize: 14,
                        boxShadow: `0 0 0 2px white, 0 0 0 3px ${selectedRole?.color}`,
                      }}
                    >
                      {selectedRole?.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <SecurityIcon
                      sx={{ mr: 1.5, color: "primary.main", fontSize: 22 }}
                    />
                  )}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: 14,
                    }}
                  >
                    {selectedRole ? (
                      <>
                        Permissions cho role:{" "}
                        <span style={{ color: selectedRole.color }}>
                          {selectedRole.name}
                        </span>
                      </>
                    ) : (
                      "Permissions"
                    )}
                  </Typography>
                </Box>
              }
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      borderRadius: "20px",
                      fontSize: 12,
                      px: 1.5,
                      py: 0.5,
                    }}
                    onClick={() => handleOpenDialogPermission()}
                  >
                    Thêm Permission
                  </Button>
                  <Button
                    variant="contained"
                    color={saveSuccess ? "success" : "primary"}
                    startIcon={saveSuccess ? <CheckCircleIcon /> : <SaveIcon />}
                    size="small"
                    sx={{
                      borderRadius: "20px",
                      boxShadow: 1,
                      fontSize: 12,
                      px: 1.5,
                      py: 0.5,
                    }}
                    onClick={() =>
                      selectedRole && handleSaveRolePermission(selectedRole._id)
                    }
                    disabled={!selectedRole}
                  >
                    {saveSuccess ? "Đã lưu" : "Lưu Thay Đổi"}
                  </Button>
                </Stack>
              }
              sx={{
                p: 1.5,
                bgcolor: "background.paper",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            />

            {/* Permission List */}
            <Box
              sx={{
                height: "550px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {!selectedRole ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 4,
                    color: "text.secondary",
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 50, opacity: 0.5, mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Vui lòng chọn một vai trò
                  </Typography>
                  <Typography
                    align="center"
                    sx={{ maxWidth: 400, mt: 1, fontSize: 13 }}
                  >
                    Chọn một vai trò từ danh sách bên trái để xem và quản lý
                    quyền
                  </Typography>
                </Box>
              ) : (
                <List
                  sx={{
                    overflow: "auto",
                    flexGrow: 1,
                    p: 0,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#a8a8a8",
                    },
                  }}
                >
                  {Object.entries(permissionGroups).map(([category, perms]) => (
                    <Box key={category}>
                      {perms.map((permission) => {
                        const rolePermission = rolePermissions.find(
                          (rp) => rp.roleId === selectedRole?._id
                        );
                        const isChecked =
                          rolePermission?.permissionIds?.includes(
                            permission._id
                          ) || false;

                        return (
                          <ListItem
                            key={permission._id}
                            divider
                            sx={{
                              transition: "background-color 0.2s",
                              py: 0.5,
                              "&:hover": {
                                bgcolor: alpha(
                                  selectedRole?.color || "#3f51b5",
                                  0.03
                                ),
                              },
                            }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                sx={{
                                  color: "primary.main",
                                  p: 1,
                                }}
                                onClick={() =>
                                  handleOpenDialogPermission(permission)
                                }
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            }
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() =>
                                    handlePermissionChange(permission._id)
                                  }
                                  sx={{
                                    color:
                                      selectedRole?.color || "primary.main",
                                    "&.Mui-checked": {
                                      color:
                                        selectedRole?.color || "primary.main",
                                    },
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 20,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: isChecked ? "bold" : "normal",
                                      color: isChecked
                                        ? selectedRole?.color || "primary.main"
                                        : "text.primary",
                                      fontSize: 13,
                                    }}
                                  >
                                    {permission.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontFamily: "monospace",
                                      bgcolor: "grey.100",
                                      p: 0.3,
                                      borderRadius: 0.5,
                                      fontSize: 11,
                                      display: "inline-block",
                                    }}
                                  >
                                    {permission.code}
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: "100%" }}
                            />
                          </ListItem>
                        );
                      })}
                    </Box>
                  ))}
                </List>
              )}
            </Box>

            <RoleDialog
              open={openDialogRole}
              selectedRole={selectedRole}
              onSave={handleSaveRole}
              onClose={handleClose}
            />
            <PermissionDialog
              open={openDialogPermission}
              selectPermission={selectedPermission}
              onSave={handleSavePermission}
              onClose={handleClose}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RolePermissionManagement;
