import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  People,
  Inventory,
  LocalShipping,
  Star,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';

function HomeStore() {
  const [timeFilter, setTimeFilter] = useState('7days');

  // Static data for charts
  const revenueData = [
    { name: 'T2', revenue: 12000000, orders: 45 },
    { name: 'T3', revenue: 19000000, orders: 67 },
    { name: 'T4', revenue: 15000000, orders: 52 },
    { name: 'T5', revenue: 25000000, orders: 89 },
    { name: 'T6', revenue: 22000000, orders: 78 },
    { name: 'T7', revenue: 28000000, orders: 95 },
    { name: 'CN', revenue: 31000000, orders: 102 }
  ];

  const salesByCategory = [
    { name: 'Điện tử', value: 35, revenue: 45000000, color: '#8884d8' },
    { name: 'Thời trang', value: 25, revenue: 32000000, color: '#82ca9d' },
    { name: 'Nhà cửa', value: 20, revenue: 26000000, color: '#ffc658' },
    { name: 'Sách', value: 12, revenue: 15000000, color: '#ff7300' },
    { name: 'Khác', value: 8, revenue: 10000000, color: '#0088fe' }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 156, revenue: 390000000, trend: 'up' },
    { name: 'Samsung Galaxy S24', sales: 134, revenue: 268000000, trend: 'up' },
    { name: 'MacBook Air M3', sales: 89, revenue: 267000000, trend: 'down' },
    { name: 'iPad Pro 12.9', sales: 76, revenue: 190000000, trend: 'up' },
    { name: 'AirPods Pro 2', sales: 203, revenue: 101500000, trend: 'up' }
  ];

  const monthlyGrowth = [
    { month: 'T1', revenue: 180000000, growth: 12.5 },
    { month: 'T2', revenue: 195000000, growth: 8.3 },
    { month: 'T3', revenue: 220000000, growth: 12.8 },
    { month: 'T4', revenue: 235000000, growth: 6.8 },
    { month: 'T5', revenue: 260000000, growth: 10.6 },
    { month: 'T6', revenue: 285000000, growth: 9.6 }
  ];

  const customerStats = {
    totalCustomers: 12847,
    newCustomers: 342,
    returningCustomers: 8956,
    customerGrowth: 15.6
  };

  const orderStats = {
    totalOrders: 1523,
    pendingOrders: 89,
    processingOrders: 156,
    shippedOrders: 234,
    completedOrders: 1044
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' && <TrendingUp color="success" sx={{ mr: 0.5 }} />}
                {trend === 'down' && <TrendingDown color="error" sx={{ mr: 0.5 }} />}
                <Typography
                  variant="body2"
                  color={trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary'}
                >
                  {subtitle}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Store Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            label="Time Period"
          >
            <MenuItem value="7days">7 ngày</MenuItem>
            <MenuItem value="30days">30 ngày</MenuItem>
            <MenuItem value="3months">3 tháng</MenuItem>
            <MenuItem value="1year">1 năm</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng Doanh Thu"
            value={formatCurrency(152000000)}
            subtitle="+12.5% so với tuần trước"
            icon={<AttachMoney />}
            trend="up"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn Hàng"
            value="1,523"
            subtitle="+8.2% so với tuần trước"
            icon={<ShoppingCart />}
            trend="up"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách Hàng"
            value="12,847"
            subtitle="+15.6% khách hàng mới"
            icon={<People />}
            trend="up"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sản Phẩm"
            value="2,456"
            subtitle="89 sản phẩm mới"
            icon={<Inventory />}
            trend="up"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} mb={4}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="h6">Xu Hướng Doanh Thu & Đơn Hàng</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(value), 'Doanh thu'];
                      } else if (name === 'orders') {
                        return [value, 'Đơn hàng'];
                      } else {
                        return [value, name];
                      }
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Đơn hàng" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="Doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by Category */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PieChart sx={{ mr: 1 }} />
                <Typography variant="h6">Doanh Số Theo Danh Mục</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(value), 'Doanh thu'];
                      } else {
                        return [`${value}%`, 'Tăng trưởng'];
                      }
                    }}
                  />

                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} mb={4}>
        {/* Monthly Growth */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BarChart sx={{ mr: 1 }} />
                <Typography variant="h6">Tăng Trưởng Hàng Tháng</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(value), 'Doanh thu'];
                      } else {
                        return [`${value}%`, 'Tăng trưởng'];
                      }
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography variant="h6">Trạng Thái Đơn Hàng</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {orderStats.pendingOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chờ xử lý
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {orderStats.processingOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đang xử lý
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="primary.main">
                      {orderStats.shippedOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đang giao
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      {orderStats.completedOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hoàn thành
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Top Products */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Star sx={{ mr: 1 }} />
                <Typography variant="h6">Sản Phẩm Bán Chạy</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đã bán</TableCell>
                      <TableCell align="right">Doanh thu</TableCell>
                      <TableCell align="center">Xu hướng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {product.sales}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="primary">
                            {formatCurrency(product.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {product.trend === 'up' ? (
                            <Chip
                              icon={<TrendingUp />}
                              label="Tăng"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<TrendingDown />}
                              label="Giảm"
                              color="error"
                              size="small"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Insights */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People sx={{ mr: 1 }} />
                <Typography variant="h6">Thống Kê Khách Hàng</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Tổng khách hàng"
                    secondary={customerStats.totalCustomers.toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Khách hàng mới"
                    secondary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" component="span">
                          {customerStats.newCustomers.toLocaleString()}
                        </Typography>
                        <Chip
                          label={`+${customerStats.customerGrowth}%`}
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Khách hàng quay lại"
                    secondary={customerStats.returningCustomers.toLocaleString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomeStore;