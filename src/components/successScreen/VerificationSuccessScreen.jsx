import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Card = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "450px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  textAlign: "center",
}));

const VerificationSuccessScreen = ({ type }) => {
  const navigate = useNavigate();
  const title =
    type === "waiting" ? "Vui lòng xác nhận tài khoản !" : "Email is Verified!";
  const message =
    type === "waiting"
      ? "Chúng tôi đã gửi email xác minh đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết để xác minh email của bạn."
      : `Your email has been successfully verified. You can now go back to the login page to access the platform.`;
  const buttonText = type === "waiting" ? "Đăng nhập ngay" : "Go to Login";

  const handleButtonClick = () => {
    navigate("/login"); // Navigate to login page after successful verification
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "lightblue", // Placeholder for loading circle or success icon
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {type === "waiting" ? <CircularProgress size={50} /> : "✅"}{" "}
          {/* Placeholder icon */}
        </Box>
        <Typography variant="h5" fontWeight="bold" color="#2988BC">
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
        <Button
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
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
      </Card>
    </Box>
  );
};

export default VerificationSuccessScreen;
