import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Tooltip,
  Zoom,
  TablePagination,
  useTheme,
  alpha,
  Fab,
  Grow,
  InputAdornment,
  OutlinedInput,
  Switch,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import HttpIcon from '@mui/icons-material/Http';
import RouteIcon from '@mui/icons-material/Route';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import SystemService from '../../services/SystemService';
import {notifySuccess, notifyError, notifyInfo} from "../../components/notification/ToastNotification.jsx";
import Loading from "../../components/loading/Loading.jsx";

const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', '*'];

export default function RouteManagement() {
  const theme = useTheme();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({ 
    id: null, 
    path: '', 
    method: 'GET', 
    requireToken: false, 
    status: '01' 
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try{
      setIsLoading(true);
      const resData = await SystemService.getAllRouter();
      if(resData.status === 200){
        setRoutes(resData.data);
        setFilteredRoutes(resData.data);
      }
    }catch(e){
      notifyError(e.message);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let result = routes;
    
    if (searchTerm) {
      result = result.filter(route => 
        route.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (methodFilter) {
      result = result.filter(route => route.method === methodFilter);
    }
    
    setFilteredRoutes(result);
    setPage(0); 
  }, [routes, searchTerm, methodFilter]);

  const handleClickOpen = () => {
    setEditMode(false);
    setCurrentRoute({ 
      id: null, 
      path: '', 
      method: 'GET', 
      requireToken: false, 
      status: '01' 
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (route) => {
    console.log(route, 'route');
    setEditMode(true);
    setCurrentRoute({ ...route });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRoutes(routes.filter(route => route.id !== id));
    showSnackbar('Route deleted successfully', 'success');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: checked });
  };

  const handleSubmit = async () => {
    if (!currentRoute.path || !currentRoute.method) {
      showSnackbar('Path and Method are required', 'error');
      return;
    }

    if (editMode) {
      
    } else {
      try{
        setIsLoading(true);
        const resData = await SystemService.createNewRoute(currentRoute);
        if(resData.status === 200){
          notifySuccess(resData.message);
          fetchRoutes();
        }else{
          notifyError(resData.message);
        }
      }catch(e){
        notifyError(e.message);
      }finally{
        setIsLoading(false);
      }
    }
    handleClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMethodFilterChange = (method) => {
    setMethodFilter(prevMethod => prevMethod === method ? '' : method);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMethodFilter('');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return theme.palette.info.main;
      case 'POST':
        return theme.palette.success.main;
      case 'PUT':
        return theme.palette.warning.main;
      case 'DELETE':
        return theme.palette.error.main;
      case '*':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {isLoading &&
                <>
                    <Loading/>
                </>}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                Route Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add, edit, and manage API routes with different HTTP methods
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Tooltip title="Add New Route" arrow>
                <Fab 
                  color="primary" 
                  aria-label="add" 
                  onClick={handleClickOpen}
                  sx={{ 
                    boxShadow: theme.shadows[8],
                    '&:hover': {
                      boxShadow: theme.shadows[12],
                    }
                  }}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <OutlinedInput
                  placeholder="Search routes by path..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="clear search"
                          onClick={() => setSearchTerm('')}
                          edge="end"
                          size="small"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} /> Filter:
                </Typography>
                {methodOptions.map((method) => (
                  <Chip
                    key={method}
                    label={method}
                    size="small"
                    onClick={() => handleMethodFilterChange(method)}
                    color={methodFilter === method ? 'primary' : 'default'}
                    variant={methodFilter === method ? 'filled' : 'outlined'}
                    sx={{ 
                      borderColor: getMethodColor(method),
                      ...(methodFilter !== method && { color: getMethodColor(method) })
                    }}
                  />
                ))}
                {(searchTerm || methodFilter) && (
                  <Chip
                    label="Clear Filters"
                    size="small"
                    onClick={clearFilters}
                    icon={<ClearIcon fontSize="small" />}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
          <Table stickyHeader sx={{ minWidth: 500 }} aria-label="route management table">
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.08) }}>
                <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Path</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Require Token</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoutes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((route, index) => (
                <TableRow 
                  key={route._id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RouteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {route.path}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={route.method}
                      size="small"
                      sx={{
                        backgroundColor: getMethodColor(route.method),
                        color: '#fff',
                        fontWeight: 'bold',
                        minWidth: '70px',
                      }}
                      icon={<HttpIcon sx={{ color: '#fff !important' }} />}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={route.requireToken ? "Required" : "Not Required"}
                      size="small"
                      color={route.requireToken ? "secondary" : "default"}
                      variant={route.requireToken ? "filled" : "outlined"}
                      icon={<VpnKeyIcon fontSize="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={route.status === '01' ? "Active" : "Inactive"}
                      size="small"
                      color={route.status === '01' ? "success" : "error"}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Route" arrow>
                      <IconButton 
                        aria-label="edit" 
                        onClick={() => handleEdit(route)}
                        color="primary"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          mr: 1,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Route" arrow>
                      <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDelete(route.id)}
                        color="error"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.2),
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoutes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No routes found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredRoutes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Route Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            {editMode ? 'Edit Route' : 'Add New Route'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {editMode ? 'Modify the existing route details' : 'Create a new API route with HTTP method'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="path"
                label="Path"
                placeholder="e.g. /api/users/:id"
                type="text"
                fullWidth
                variant="outlined"
                value={currentRoute.path}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RouteIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="method-select-label">Method</InputLabel>
                <Select
                  labelId="method-select-label"
                  id="method-select"
                  name="method"
                  value={currentRoute.method}
                  label="Method"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <HttpIcon sx={{ color: getMethodColor(currentRoute.method) }} />
                    </InputAdornment>
                  }
                >
                  {methodOptions.map((method) => (
                    <MenuItem key={method} value={method}>
                      <Chip
                        label={method}
                        size="small"
                        sx={{
                          backgroundColor: getMethodColor(method),
                          color: '#fff',
                          fontWeight: 'bold',
                          minWidth: '60px',
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentRoute.requireToken}
                    onChange={handleSwitchChange}
                    name="requireToken"
                    color="secondary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VpnKeyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>Require Token</Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="status"
                label="Status"
                type="text"
                fullWidth
                variant="outlined"
                value={currentRoute.status}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: !editMode,
                }}
                helperText={!editMode ? "Status is set to '01' (Active) by default" : ""}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: theme.shadows[3],
            }}
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Grow}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: theme.shadows[6] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
