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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VerificationSuccessScreen from "../components/successScreen/VerificationSuccessScreen.jsx";
import {
  notifySuccess,
  notifyError,
} from "../components/notification/ToastNotification.jsx";
import Loading from "../components/loading/Loading.jsx";
import { pizzaTheme } from "./theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";

const PIZZA_BOY_IMAGE_URL =
  "https://png.pngtree.com/png-clipart/20250128/original/pngtree-3d-pizza-boy-running-with-freshly-baked-png-image_20068701.png";
const BACKGROUND_IMAGE_URL =
  "https://img.freepik.com/free-vector/abstract-orange-background-with-lines-halftone-effect_1017-32107.jpg?semt=ais_hybrid&w=740";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [boxVisible, setBoxVisible] = useState(false);

  const joiMessages = {
    "string.empty": "Trường này là bắt buộc",
    "string.min": "Phải có ít nhất {#limit} ký tự",
    "string.email": "Định dạng email không hợp lệ",
    "any.only": "Mật khẩu không khớp",
    "any.required": "Trường này là bắt buộc",
    "boolean.base": "Bạn phải đồng ý với điều khoản",
    "object.unknown": "Trường không hợp lệ",
  };

  const validationSchema = Joi.object({
    username: Joi.string()
      .min(3)
      .required()
      .label("Họ và tên")
      .messages(joiMessages),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email")
      .messages(joiMessages), // Sửa tlds
    password: Joi.string()
      .min(6)
      .required()
      .label("Mật khẩu")
      .messages(joiMessages),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("Xác nhận mật khẩu")
      .messages(joiMessages),
    agreeTerms: Joi.boolean()
      .valid(true)
      .required()
      .label("Điều khoản")
      .messages(joiMessages),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    validate: (values) => {
      // Loại bỏ khoảng trắng ở đầu/cuối
      const cleanValues = {
        ...values,
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
      };
      const { error } = validationSchema.validate(cleanValues, {
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
        const apiPayload = {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };
        // Giả sử API đăng ký không trả về token ngay mà chỉ thông báo thành công
        const response = await axios.post(
          "http://localhost:9999/api/register/account", // Đảm bảo API endpoint đúng
          apiPayload
        );

        // Kiểm tra response.data vì axios bao bọc response trong data
        if (
          response.data &&
          (response.data.success ||
            response.status === 200 ||
            response.status === 201)
        ) {
          notifySuccess(
            response.data.message ||
              "Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
          );
          setRegistrationSuccess(true);
        } else {
          notifyError(
            response.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
          );
        }
      } catch (error) {
        notifyError(
          error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra trong quá trình đăng ký."
        );
        console.error("Registration error:", error.response || error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    setTimeout(() => setBoxVisible(true), 10);
  }, []);

  if (registrationSuccess) {
    return (
      <VerificationSuccessScreen type="waiting" email={formik.values.email} />
    );
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      height: 42, // Chiều cao cố định cho ô input
      borderRadius: "8px", // Bo tròn góc
      backgroundColor: "white", // Nền trắng cho input
      "& input": {
        padding: "10px 14px", // Padding bên trong cho text
        fontSize: "15px",
      },
      "&.Mui-focused fieldset": {
        borderColor: pizzaTheme.palette.secondary.main, // Màu border khi focus
      },
    },
    "& .MuiInputLabel-outlined": {
      // Style cho label nếu dùng
      transform: "translate(14px, 12px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
      },
    },
    "& .MuiFormHelperText-root": {
      // Style cho helper text (lỗi)
      marginLeft: 2,
      fontSize: "0.7rem",
    },
  };

  return (
    <ThemeProvider theme={pizzaTheme}>
      <CssBaseline />
      {loading && <Loading />}
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
              padding: { xs: 2, sm: 3, md: 4 }, // Tăng padding một chút
            }}
          >
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "360px", // Tăng max width cho form
              }}
            >
              <Avatar sx={{ bgcolor: "background.paper", m: 1 }}>
                <LockOutlinedIcon color="primary" fontSize="medium" />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                sx={{ color: "text.primary", fontWeight: 700, mb: 2 }}
              >
                Tạo tài khoản
              </Typography>

              {/* Sử dụng sx prop để kiểm soát margin và style */}
              <TextField
                fullWidth
                id="username"
                name="username"
                placeholder="Họ và tên *" // Đổi placeholder
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
                sx={{ ...textFieldStyles, mb: 1.5 }} // Áp dụng style chung và margin bottom
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                placeholder="Email *"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ ...textFieldStyles, mb: 1.5 }}
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu *"
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
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ ...textFieldStyles, mb: 1.5 }}
              />
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu *"
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
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ ...textFieldStyles, mb: 1 }} // Margin bottom nhỏ hơn cho trường cuối
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTerms"
                    checked={formik.values.agreeTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    color="default" // Hoặc primary/secondary tùy theme
                    size="small"
                    sx={{ padding: "6px" }} // Tăng vùng click cho checkbox
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    Tôi đồng ý với{" "}
                    <MuiLink
                      href="#"
                      sx={{
                        color: "#FEBDAB",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: "0.8rem",
                      }}
                    >
                      điều khoản dịch vụ
                    </MuiLink>{" "}
                    và{" "}
                    <MuiLink
                      href="#"
                      sx={{
                        color: "#FEBDAB",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: "0.8rem",
                      }}
                    >
                      chính sách bảo mật
                    </MuiLink>
                  </Typography>
                }
                sx={{ mt: 0.5, mb: formik.errors.agreeTerms ? 0 : 0.5 }}
              />
              {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "error.main",
                    display: "block",
                    mt: 0,
                    ml: 0.5,
                    fontSize: "0.7rem",
                  }}
                >
                  {formik.errors.agreeTerms}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{ mt: 2, mb: 1, paddingY: 1.2, fontWeight: 600 }}
              >
                {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  alignSelf: "center",
                  mt: 1,
                  fontSize: "0.8rem",
                }}
              >
                Đã có tài khoản?{" "}
                <MuiLink
                  href="/login"
                  sx={{
                    color: "#FEBDAB",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Đăng nhập
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
