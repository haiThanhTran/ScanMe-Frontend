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

// Hình ảnh Pizza Boy (sử dụng ảnh từ ảnh mẫu)
const PIZZA_BOY_IMAGE_URL =
  "https://png.pngtree.com/png-clipart/20250128/original/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";
// Sử dụng URL bạn cung cấp: "https://png.pngtree.com/png-clipart/20230424/ourmid/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";
// const PIZZA_BOY_IMAGE_URL = "https://png.pngtree.com/png-clipart/20230424/ourmid/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";

// Background Image URL (Use the same as Register for consistency)
const BACKGROUND_IMAGE_URL =
  "https://media.istockphoto.com/id/1020383084/vi/anh/n%E1%BB%81n-m%C3%A0u-cam-pastel-gi%E1%BA%A5y-m%E1%BA%ABu-h%C3%ACnh-h%E1%BB%8Dc-kh%C3%A1i-ni%E1%BB%87m-t%C3%B3i-thi%E1%BB%83u-n%E1%BA%B1m-ph%E1%BA%B3ng-t%E1%BA%A7m-nh%C3%ACn-tr%C3%AAn-c%C3%B9ng-gi%E1%BA%A5y-m%C3%A0u.jpg?s=612x612&w=0&k=20&c=qjaGyU2sjZjYJ4_V8JMWhREtOEmVtwRAx3GOh2a8E6k=";

const Login = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

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
      const resData = await AuthService.login(data); // AuthService.login expects FormData
      if (resData.status === 200) {
        const decode = jwtDecode(resData.data); // Assuming resData.data contains the token string
        localStorage.setItem("token", resData.data); // Store token
        localStorage.setItem("role", decode.role);
        localStorage.setItem("username", username); // Store entered username
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
        // Assuming backend returns an error structure with message
        notifyError(
          resData.data?.message ||
            "Login failed! Please check your credentials."
        );
      }
    } catch (e) {
      // Handle API errors
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "An error occurred during login.";
      notifyError(errorMessage);
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <ThemeProvider theme={pizzaTheme}>
      <CssBaseline />
      {isLoading && <Loading />} {/* Loading component */}
      <Box
        sx={{
          minHeight: "100vh",
          // Use background image
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          overflow: "auto",
        }}
      >
        <Grid
          container
              sx={{
            bgcolor: "background.paper", // White background for the central box
            borderRadius: "20px", // Rounded corners for the box
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)", // Shadow
            overflow: "hidden", // Hide overflow from rounded corners
            maxWidth: "900px", // Max width of the central box
            width: "100%",
            minHeight: { xs: "auto", md: "500px" }, // Min height, adjust as needed
          }}
        >
          {/* Left Side - Image */}
          <Grid
            item
            xs={12}
            sm={5} // Adjust column ratio if needed
            sx={{
              bgcolor: "background.default", // White background for image side
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              // Optional: hide image section on very small screens
              // [theme.breakpoints.down('sm')]: { display: 'none' },
            }}
          >
            <img
              src={PIZZA_BOY_IMAGE_URL} // Your pizza boy image
              alt="Illustration"
              style={{
                maxWidth: "100%",
                maxHeight: "100%", // Use 100% to fit within the Grid item height
                objectFit: "contain",
                height: "auto", // Maintain aspect ratio
              }}
            />
          </Grid>

          {/* Right Side - Form */}
          <Grid
            item
            xs={12}
            sm={7} // Remaining columns for the form
            sx={{
              bgcolor: "primary.main", // Orange background for form side
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", // Center form vertically
              padding: { xs: 1.5, sm: 3, md: 4 }, // Adjusted padding
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
                maxWidth: "380px", // Max width for form content within the column
                gap: 1,
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
                Sign In
              </Typography>

              {/* Form Fields */}
              <FormControl fullWidth margin="normal" size="small">
              <TextField
                id="username"
                name="username"
                  placeholder="Email or Username *"
                autoComplete="username"
                autoFocus
              />
            </FormControl>
              <FormControl fullWidth margin="normal" size="small">
              <TextField
                  id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                  placeholder="Password *"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                          size="small" // Adjusted icon size
                      >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                  mt: 0.5, // Adjusted top margin
                  mb: 1, // Adjusted bottom margin
              }}
            >
              <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="default"
                      size="small" // Adjusted checkbox size
                    />
                  }
                label={
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                    >
                      Remember me
                    </Typography>
                }
              />
                <MuiLink
                  href="#"
                variant="body2"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem", // Adjusted font size
                  }}
              >
                  Forgot password?
                </MuiLink>
            </Box>

              {/* Sign In Button */}
              <Button
              type="submit"
              fullWidth
              variant="contained"
                color="secondary"
                disabled={isLoading}
                sx={{ mt: 1, paddingY: 1 }} // Adjusted margin and padding
            >
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Button>

              {/* Sign Up Link */}
            <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  alignSelf: "center",
                  mt: 1,
                  fontSize: "0.8rem", // Adjusted font size
                }}
              >
                Don't have an account?{" "}
                <MuiLink
                  href="/register"
                  variant="body2"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem", // Adjusted font size
                }}
              >
                  Sign Up
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
