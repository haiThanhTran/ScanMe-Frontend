import * as React from "react";
import { useFormik } from "formik";
import Joi from "joi";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import VerificationSuccessScreen from "../components/successScreen/VerificationSuccessScreen.jsx";
import {
  notifySuccess,
  notifyError,
} from "../components/notification/ToastNotification.jsx";
import Loading from "../components/loading/Loading.jsx";
// Các styled components giữ nguyên
const Card = styled("div")(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "450px",
  maxHeight: "90vh",
  overflowY: "auto",
  animation: `${keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `} 0.5s ease-in-out`,
  zIndex: 10,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "12px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  background: "linear-gradient(90deg, #2988BC 0%, #2F496E 100%)",
  "&:hover": {
    background: "linear-gradient(90deg, #2F496E 0%, #2988BC 100%)",
  },
  transition: "all 0.3s ease",
}));
const BlurBackground = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "url(https://wallpapers.com/images/hd/hotel-background-bppf56oip6k5puj0.jpg) center/cover no-repeat",
  filter: "blur(5px)",
  opacity: 0.6,
  zIndex: 1,
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  // Custom messages cho Joi validation
  const joiMessages = {
    "string.empty": "Trường này không được để trống",
    "string.min": "Phải có ít nhất {#limit} ký tự",
    "string.email": "Email không hợp lệ",
    "any.only": "Mật khẩu xác nhận không khớp",
  };

  // Validation Schema
  const validationSchema = Joi.object({
    username: Joi.string().min(3).required().messages(joiMessages),
    email: Joi.string().email({ tlds: false }).required().messages(joiMessages),
    password: Joi.string().min(6).required().messages(joiMessages),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages(joiMessages),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const { error } = validationSchema.validate(values, {
        abortEarly: false,
      });
      if (error) {
        console.log("Validation Errors:", error.details);
      }
      return error?.details.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message,
        }),
        {}
      );
    },
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true when form is submitted
      try {
        const response = await axios.post(
          "http://localhost:9999/api/register/account",
          values
        );
        console.log("Response:", response);
        // Kiểm tra nếu đăng ký thành công (giả sử server trả về { success: true })
        if (response.status) {
          notifySuccess("Đăng ký thành công!");
          setRegistrationSuccess(true);
        } else {
          notifyError(
            "Đăng ký thất bại: " +
              (response.data.message || "Lỗi không xác định")
          );
        }
      } catch (error) {
        notifyError(error.response.data.message);
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after API call (success or error)
      }
    },
  });

  if (registrationSuccess) {
    return <VerificationSuccessScreen type="waiting" email="" />; // Render success screen after registration
  }
  // Các styles chung cho TextField
  const textFieldSx = {
    "& .MuiFormHelperText-root": {
      minHeight: "1.2rem",
      transition: "all 0.2s",
    },
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: 2,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <Loading />}
      <BlurBackground />
      <Card>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#2988BC", textAlign: "center", mb: 2 }}
        >
          Đăng ký tài khoản
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 3, color: "#666" }}
        >
          Tạo tài khoản để bắt đầu trải nghiệm dịch vụ của chúng tôi
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={!!formik.errors.username}
              helperText={formik.errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">👤</InputAdornment>
                ),
                sx: { borderRadius: "8px" },
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">✉️</InputAdornment>
                ),
                sx: { borderRadius: "8px" },
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={!!formik.errors.password}
              helperText={formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🔒</InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "🔍"}
                  </IconButton>
                ),
                sx: { borderRadius: "8px" },
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={!!formik.errors.confirmPassword}
              helperText={formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🔒</InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "🔍"}
                  </IconButton>
                ),
                sx: { borderRadius: "8px" },
              }}
              sx={textFieldSx}
            />
            <StyledButton
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#2988BC",
                "&:hover": { bgcolor: "#1e5f8d" },
                borderRadius: "8px",
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                mt: 1,
              }}
              type="submit"
            >
              Đăng ký
            </StyledButton>
          </Box>
        </form>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            variant="body2"
            sx={{ color: "#2988BC", fontWeight: 600 }}
          >
            Đăng nhập
          </Link>
        </Typography>
      </Card>
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          bottom: 20,
          color: "white",
          opacity: 0.8,
          zIndex: 10,
        }}
      >
        © 2024 LuxStay. Tất cả các quyền được bảo lưu.
      </Typography>
    </Stack>
  );
};

export default Register;
