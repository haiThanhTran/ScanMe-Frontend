import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  PersonAdd as PersonAddIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import fetchUtil from "../../utils/fetchUtils";
import { useEffect, useState } from "react";
import Loading from "../../components/loading/Loading.jsx";
// Sample data for charts
const salesData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
  { name: "Jul", value: 4300 },
];

const visitorData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 2398 },
  { name: "Mar", value: 3800 },
  { name: "Apr", value: 4908 },
  { name: "May", value: 5800 },
  { name: "Jun", value: 4800 },
  { name: "Jul", value: 6300 },
];

// Sample data for recent transactions
const recentTransactions = [
  {
    id: 1,
    customer: "John Doe",
    amount: "$120.00",
    status: "completed",
    date: "2 hours ago",
    avatar: "J",
  },
  {
    id: 2,
    customer: "Jane Smith",
    amount: "$75.50",
    status: "pending",
    date: "5 hours ago",
    avatar: "S",
  },
  {
    id: 3,
    customer: "Robert Johnson",
    amount: "$250.75",
    status: "completed",
    date: "Yesterday",
    avatar: "R",
  },
  {
    id: 4,
    customer: "Emily Davis",
    amount: "$180.25",
    status: "cancelled",
    date: "Yesterday",
    avatar: "E",
  },
];

// Sample data for new users
const newUsers = [
  {
    id: 1,
    name: "Michael Brown",
    role: "Customer",
    date: "2 hours ago",
    avatar: "M",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Admin",
    date: "1 day ago",
    avatar: "S",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Customer",
    date: "2 days ago",
    avatar: "D",
  },
];

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  borderRadius: theme.spacing(2),
  backgroundColor: color,
  color: "#fff",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StatusAvatar = styled(Avatar)(({ theme, status }) => {
  const statusColors = {
    completed: "#4caf50",
    pending: "#ff9800",
    cancelled: "#f44336",
  };

  return {
    backgroundColor: statusColors[status] || theme.palette.grey[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "0.75rem",
  };
});

// Dashboard Home Component
const HomeAdmin = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUtil
      .get("/admin/dashboard-overview")
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Lỗi khi tải dữ liệu dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 8, color: "red" }}>Lỗi: {error}</Box>
    );
  if (!dashboard) return null;

  // Chuẩn hóa dữ liệu cho các mục
  const statCards = [
    {
      label: "Tổng người dùng",
      value: dashboard.totalUsers,
      icon: <PeopleIcon />,
      color: "#3f51b5",
      trend: "+12% tuần này",
      trendIcon: <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />,
    },
    {
      label: "Tổng đơn hàng",
      value: dashboard.totalOrders,
      icon: <ShoppingCartIcon />,
      color: "#f50057",
      trend: "+5% tuần này",
      trendIcon: <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />,
    },
    {
      label: "Doanh thu",
      value: dashboard.totalRevenue
        ? `${dashboard.totalRevenue.toLocaleString()} VNĐ`
        : "56,000 VNĐ",
      icon: <MoneyIcon />,
      color: "#00bcd4",
      trend: "+8% tháng này",
      trendIcon: <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />,
    },
    {
      label: "Khách hàng mới",
      value: dashboard.newCustomers,
      icon: <NotificationsIcon />,
      color: "#4caf50",
      trend: "-3% tuần này",
      trendIcon: <TrendingDownIcon sx={{ fontSize: "1rem", mr: 0.5 }} />,
    },
  ];

  // Sales Overview: chuyển về dạng [{name: '2024-01', value: ...}]
  const salesData = (dashboard.salesOverview || []).map((item) => ({
    name: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(
      item._id.day
    ).padStart(2, "0")}`,
    value: item.total,
  }));
  // Visitors: chuyển về dạng [{name: '2024-01', value: ...}]
  const visitorData = (dashboard.visitors || []).map((item) => ({
    name: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    value: item.count,
  }));
  // Recent Transactions: 4 đơn hàng mới nhất
  const recentTransactions = (dashboard.recentTransactions || []).map(
    (o, idx) => ({
      id: o._id || idx,
      customer: o.userId?.username || "Unknown",
      amount: o.totalAmount ? `$${o.totalAmount}` : "",
      status: o.status || "completed",
      date: o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
      avatar: o.userId?.username?.[0]?.toUpperCase() || "U",
    })
  );
  // New Users: 3 user mới nhất
  const newUsers = (dashboard.newUsers || []).map((u, idx) => ({
    id: u._id || idx,
    name: u.username,
    role: "Customer",
    date: u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
    avatar: u.username?.[0]?.toUpperCase() || "U",
  }));

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <StatCard color={card.color}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {card.value}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  {card.trendIcon}
                  <Typography variant="caption">{card.trend}</Typography>
                </Box>
              </Box>
              <Avatar
                sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
              >
                {card.icon}
              </Avatar>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardHeader
              title="Doanh Số Đơn Hàng Theo Ngày"
              subheader="Tổng tiền đơn hàng mỗi ngày"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ flexGrow: 1, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString("vi-VN") + " ₫"}
                  />
                  <RechartsTooltip
                    formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardHeader
              title="Lượt Tương Tác Web"
              subheader="Monthly User Traffic"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ flexGrow: 1, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardHeader
              title="Giao Dịch Gần Đây"
              subheader="Người dùng mua hàng gần đây"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ px: 0 }}>
              <List>
                {recentTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <StatusAvatar status={transaction.status}>
                          {transaction.avatar}
                        </StatusAvatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={transaction.customer}
                        secondary={transaction.date}
                        sx={{ flexGrow: 2 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}
                      >
                        {transaction.amount}
                      </Typography>
                      <ListItemSecondaryAction>
                        <Tooltip title={transaction.status}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor:
                                transaction.status === "completed"
                                  ? "success.main"
                                  : transaction.status === "pending"
                                  ? "warning.main"
                                  : "error.main",
                            }}
                          />
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < recentTransactions.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <StyledCard>
                <CardHeader
                  title="Người Dùng Mới"
                  subheader="Người Đăng Ký Gần Đây"
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <CardContent sx={{ px: 0 }}>
                  <List>
                    {newUsers.map((user, index) => (
                      <React.Fragment key={user.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>{user.avatar}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.name}
                            secondary={user.role}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {user.date}
                          </Typography>
                        </ListItem>
                        {index < newUsers.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item>
              <StyledCard>
                <CardHeader
                  title="Theo Dõi Hệ Thống"
                  subheader="Resource usage"
                />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    CPU Usage
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={70}
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />

                  <Typography variant="body2" gutterBottom>
                    Memory Usage
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={45}
                    color="secondary"
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />

                  <Typography variant="body2" gutterBottom>
                    Storage Usage
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={25}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeAdmin;
