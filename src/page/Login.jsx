import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  Checkbox,
  FormControlLabel,
  Grid,
  Avatar,
  ThemeProvider,
  CssBaseline,
  InputAdornment,
  IconButton,
  FormControl,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"; // Icon for username/email - Not used in final UI, keeping for reference
import Visibility from "@mui/icons-material/Visibility"; // Icon for password visibility
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Icon for password visibility
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading/Loading.jsx";
import {
  notifySuccess,
  notifyError,
} from "../components/notification/ToastNotification.jsx";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/AuthService.jsx";
import { pizzaTheme } from "./theme";
import { useEffect, useState } from "react";

// Hình ảnh Pizza Boy (sử dụng ảnh từ ảnh mẫu)
const PIZZA_BOY_IMAGE_URL =
  "https://png.pngtree.com/png-clipart/20250128/original/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";
// Sử dụng URL bạn cung cấp: "https://png.pngtree.com/png-clipart/20230424/ourmid/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";
// const PIZZA_BOY_IMAGE_URL = "https://png.pngtree.com/png-clipart/20230424/ourmid/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";

// Background Image URL (Use the same as Register for consistency)
const BACKGROUND_IMAGE_URL =
  "https://img.freepik.com/free-vector/abstract-orange-background-with-lines-halftone-effect_1017-32107.jpg?semt=ais_hybrid&w=740";

const Login = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [boxVisible, setBoxVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setBoxVisible(true), 10);
  }, []);

  // Keeping the existing handleSubmit logic
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username"); // API uses username (or email)
    const password = data.get("password");

    if (!username || !password) {
      notifyError("Email/Username and Password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const resData = await AuthService.login(data); // AuthService.login nhận FormData
      if (resData.status === 200) {
        const decode = jwtDecode(resData.data);
        localStorage.setItem("token", resData.data); // Lưu token
        localStorage.setItem("role", decode.role);
        localStorage.setItem("username", username); // Lưu username đã nhập
        notifySuccess("Login successful!");
        const redirectUrl = localStorage.getItem("redirectUrl");
        if (redirectUrl) {
          localStorage.removeItem("redirectUrl");
          navigate(redirectUrl);
        } else {
          if (decode.role === "SUPER_ADMIN") navigate("/admin/homeAdmin");
          else if (decode.role === "GUEST_ROLE_MEMBER") navigate("/");
          else navigate("/403");
        }
      } else {
         notifyError(resData.data?.message || "Login failed! Please check your credentials.");
      }
    } catch (e) {
      notifyError(e.response?.data?.message || e.message || "An error occurred during login.");
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      height: "55px",
      borderRadius: "10px",
      backgroundColor: "white",
      marginBottom: "10px",
      "& input": {
        padding: "16px 22px",
        fontSize: "16px",
      },
      "&.Mui-focused fieldset": {
        borderColor: pizzaTheme.palette.secondary.main,
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 2,
      fontSize: "0.7rem",
    },
  };

  return (
    <ThemeProvider theme={pizzaTheme}>
      <CssBaseline />
      {isLoading && <Loading />} {/* Loading component */}
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        {/* Background image + blur overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.15)",
              zIndex: 1,
            },
          }}
        />
        {/* Nội dung chính */}
        <Grid
          container
          sx={{
            position: "relative",
            zIndex: 2,
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
            overflow: "hidden",
            maxWidth: "900px",
            width: "100%",
            minHeight: { xs: "auto", md: "500px" },
            transform: boxVisible ? "translateY(0)" : "translateY(60px)",
            opacity: boxVisible ? 1 : 0.7,
            transition:
              "transform 0.5s cubic-bezier(.4,1.3,.6,1), opacity 0.5s cubic-bezier(.4,1.3,.6,1)",
          }}
        >
          {/* Left Side - Image */}
          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              bgcolor: "background.default",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: { xs: 2, sm: 3 },
            }}
          >
            <img
              src={PIZZA_BOY_IMAGE_URL}
              alt="Minh họa"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                height: "auto",
              }}
            />
          </Grid>
          {/* Right Side - Form */}
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              bgcolor: "primary.main",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: 1, sm: 2, md: 2.5 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "340px",
                gap: 0.5,
              }}
            >
              {/* Lock Icon Avatar */}
              <Avatar sx={{ bgcolor: "background.paper", m: 0.5 }}>
                <LockOutlinedIcon color="primary" fontSize="large" />
              </Avatar>
              {/* Title */}
              <Typography
                component="h1"
                variant="h5"
                sx={{ color: "text.primary", fontWeight: 700, mb: 0.5 }}
              >
                Đăng nhập
              </Typography>
              {/* Form Fields */}
              <FormControl fullWidth margin="none" size="small">
                <TextField
                  id="username"
                  name="username"
                  placeholder="Tên đăng nhập *"
                  autoComplete="username"
                  autoFocus
                  size="small"
                  sx={textFieldStyles}
                  InputProps={{
                    style: {
                      height: 55,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 16,
                      padding: "0 10px",
                    },
                  }}
                  inputProps={{
                    style: {
                      padding: 0,
                      textAlign: "left",
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth margin="none" size="small">
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu *"
                  autoComplete="current-password"
                  size="small"
                  sx={textFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      height: 55,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 16,
                      padding: "0 10px",
                    },
                  }}
                  inputProps={{
                    style: {
                      padding: 0,
                      textAlign: "left",
                    },
                  }}
                />
              </FormControl>
              {/* Remember me & Forgot Password */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mt: 0.5,
                  mb: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="default"
                      size="small"
                      sx={{ padding: "6px" }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                    >
                      Ghi nhớ đăng nhập
                    </Typography>
                  }
                />
                {/* <MuiLink
                  href="#"
                  variant="body2"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Quên mật khẩu?
                </MuiLink> */}
              </Box>
              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isLoading}
                sx={{ mt: 1, paddingY: 1 }}
              >
                {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </Button>
              {/* Sign Up Link */}
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  alignSelf: "center",
                  mt: 1,
                  fontSize: "0.8rem",
                }}
              >
                Chưa có tài khoản?{" "}
                <MuiLink
                  href="/register"
                  variant="body2"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Đăng ký
                </MuiLink>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
