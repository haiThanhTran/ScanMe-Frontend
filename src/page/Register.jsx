import * as React from "react";
import { useFormik } from "formik";
import Joi from "joi";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; // Material UI icon
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VerificationSuccessScreen from "../components/successScreen/VerificationSuccessScreen.jsx";
import {
  notifySuccess,
  notifyError,
} from "../components/notification/ToastNotification.jsx";
import Loading from "../components/loading/Loading.jsx";
import { pizzaTheme } from "./theme"; // Giả sử bạn lưu theme.js cùng cấp
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Hình ảnh Pizza Boy
const PIZZA_BOY_IMAGE_URL =
  "https://png.pngtree.com/png-clipart/20250128/original/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";

// Background Image URL
const BACKGROUND_IMAGE_URL =
  "https://media.istockphoto.com/id/1020383084/vi/anh/n%E1%BB%81n-m%C3%A0u-cam-pastel-gi%E1%BA%A5y-m%E1%BA%ABu-h%C3%ACnh-h%E1%BB%8Dc-kh%C3%A1i-ni%E1%BB%87m-t%C3%B3i-thi%E1%BB%83u-n%E1%BA%B1m-ph%E1%BA%B3ng-t%E1%BA%A7m-nh%C3%ACn-tr%C3%AAn-c%C3%B9ng-gi%E1%BA%A5y-m%C3%A0u.jpg?s=612x612&w=0&k=20&c=qjaGyU2sjZjYJ4_V8JMWhREtOEmVtwRAx3GOh2a8E6k=";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const joiMessages = {
    "string.empty": "This field is required",
    "string.min": "Must have at least {#limit} characters",
    "string.email": "Invalid email format",
    "any.only": "Passwords do not match",
    "any.required": "This field is required",
    "boolean.base": "You must agree to the terms", // Cho agreeTerms
    "object.unknown": "Field not allowed",
  };

  const validationSchema = Joi.object({
    // API của bạn dùng 'username' cho tên. Ảnh 1 có 'Full Name'.
    // Chúng ta sẽ map 'Full Name' của UI vào 'username' của API.
    username: Joi.string()
      .min(3)
      .required()
      .label("Full Name")
      .messages(joiMessages),
    // Ảnh 1 có 'Phone Number', nhưng API hiện tại không có. Tạm thời bỏ qua.
    // phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).required().label("Phone Number").messages({...joiMessages, "string.pattern.base": "Invalid phone number"}),
    email: Joi.string()
      .email({ tlds: false })
      .required()
      .label("Email")
      .messages(joiMessages),
    password: Joi.string()
      .min(6)
      .required()
      .label("Password")
      .messages(joiMessages),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm Password")
      .messages(joiMessages),
    agreeTerms: Joi.boolean()
      .valid(true)
      .required()
      .label("Terms agreement")
      .messages(joiMessages),
  });

  const formik = useFormik({
    initialValues: {
      username: "", // For Full Name
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    validate: (values) => {
      const { error } = validationSchema.validate(values, {
        abortEarly: false,
      });
      if (!error) return {};
      return error.details.reduce((acc, current) => {
        acc[current.path[0]] = current.message;
        return acc;
      }, {});
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // API endpoint của bạn chỉ nhận username, email, password
        const apiPayload = {
          username: values.username, // "Full Name" từ UI
          email: values.email,
          password: values.password,
        };
        const response = await axios.post(
          "http://localhost:9999/api/register/account",
          apiPayload
        );
        if (response.status === 200 || response.status === 201) {
          // Hoặc các status code thành công khác
          notifySuccess(
            "Registration successful! Please check your email to verify."
          );
          setRegistrationSuccess(true); // Để chuyển sang màn hình chờ verify
        } else {
          notifyError(
            "Registration failed: " +
              (response.data?.message || "Unknown error")
          );
        }
      } catch (error) {
        notifyError(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during registration."
        );
        console.error("Registration error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (registrationSuccess) {
    // Chuyển email đã đăng ký sang màn hình success
    return (
      <VerificationSuccessScreen type="waiting" email={formik.values.email} />
    );
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  return (
    <ThemeProvider theme={pizzaTheme}>
      <CssBaseline />
      {loading && <Loading />}
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
            sm={5} // Adjust column ratio if needed (e.g., sm={4} or md={6})
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
              src={PIZZA_BOY_IMAGE_URL}
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
              padding: { xs: 1.5, sm: 3, md: 4 }, // Further reduced padding
            }}
        >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "380px", // Max width for form content within the column
                gap: 1, // Further reduced gap
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
                Create Account
        </Typography>

              {/* Form Fields */}
              {/* Full Name (mapped to username) */}
              <FormControl fullWidth margin="normal" size="small">
            <TextField
                  id="username"
              name="username"
                  placeholder="Full Name *"
              value={formik.values.username}
              onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </FormControl>
              {/* Phone Number (omitted as per API) */}
              {/* <TextField fullWidth placeholder="Phone Number *" type="tel" /> */}

              {/* Email */}
              <FormControl fullWidth margin="normal" size="small">
            <TextField
                  id="email"
                  name="email"
              type="email"
                  placeholder="Email *"
              value={formik.values.email}
              onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </FormControl>

              {/* Password */}
              <FormControl fullWidth margin="normal" size="small">
            <TextField
                  id="password"
                  name="password"
              type={showPassword ? "text" : "password"}
                  placeholder="Password *"
              value={formik.values.password}
              onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
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
              }}
            />
              </FormControl>

              {/* Confirm Password */}
              <FormControl fullWidth margin="normal" size="small">
            <TextField
                  id="confirmPassword"
                  name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password *"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
              InputProps={{
                endAdornment: (
                      <InputAdornment position="end">
                  <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          size="small"
                  >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                  </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              {/* Terms Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTerms"
                    checked={formik.values.agreeTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    color="default" // Checkbox color is styled in theme.js MuiCheckbox
                    size="small" // Reduced checkbox size
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    I accept the{" "}
                    <MuiLink
                      href="#"
                      sx={{
                        color: "#FEBDAB",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: "0.8rem", // Reduced font size
                      }}
                    >
                      terms of service
                    </MuiLink>{" "}
                    and{" "}
                    <MuiLink
                      href="#"
              sx={{
                        color: "#FEBDAB",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: "0.8rem", // Reduced font size
              }}
                    >
                      privacy policy
                    </MuiLink>
                  </Typography>
                }
                sx={{ mt: 0.5, mb: formik.errors.agreeTerms ? 0 : 0.5 }} // Further reduced margin
              />
              {formik.touched.agreeTerms && formik.errors.agreeTerms && (
        <Typography
                  variant="caption"
                  sx={{
                    color: "error.main",
                    display: "block",
                    mt: 0,
                    ml: 0.5,
                    fontSize: "0.7rem", // Reduced font size
                  }}
                >
                  {formik.errors.agreeTerms}
                </Typography>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary" // Button color from theme
                disabled={loading}
                sx={{ mt: formik.errors.agreeTerms ? 0 : 1, paddingY: 1 }} // Adjusted margin and padding
              >
                {loading ? "Processing..." : "SIGN UP"}
              </Button>

              {/* Sign In Link */}
      <Typography
        variant="body2"
        sx={{
                  color: "text.secondary",
                  alignSelf: "center",
                  mt: 1,
                  fontSize: "0.8rem",
                }} // Reduced margin and font size
              >
                Already have an account?{" "}
                <MuiLink
                  href="/login"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem", // Reduced font size
        }}
      >
                  Sign In
                </MuiLink>
      </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
