import { Chip, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  TablePagination,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
  Divider,
  alpha,
  Snackbar,
  Alert,
  FormHelperText,
  Stack,
  InputAdornment,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    //   backgroundColor: theme.palette.common.black,
    //   color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#e8e8e8 !important", // 🔥 Màu vàng khi hover
    transition: "background-color 0.3s ease", // Hiệu ứng chuyển đổi mượt
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Hàm chọn màu theo trạng thái
const getStatusChip = (status) => {
  switch (status) {
    case "available":
      return (
        <Chip
          label="available"
          style={{ backgroundColor: "#2e7d32", color: "white" }}
        />
      );
    case "maintenance":
      return (
        <Chip
          label="maintenance"
          style={{ backgroundColor: "#f57c00", color: "white" }}
        />
      );
    case "booked":
      return (
        <Chip
          label="booked"
          style={{ backgroundColor: "#d32f2f", color: "white" }}
        />
      );
    default:
      return <Chip label="Không xác định" />;
  }
};

const StatsCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: bgcolor,
  color: "#fff",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "30%",
    height: "100%",
    backgroundColor: alpha("#fff", 0.1),
    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    },
  },
}));

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

export {
  getStatusChip,
  StyledTableCell,
  StyledTableRow,
  StatsCard,
  SearchField,
  StyledCard,
};
