import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
  Slider,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  TextField, // Import TextField for price input
} from "@mui/material";
import {
  Pool as PoolIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  Restaurant as RestaurantIcon,
  Tv as TvIcon,
  LocalParking as ParkingIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Header from "../../components/homePage/header";
import Footer from "../../components/homePage/footer";
import Loading from "../../components/loading/Loading.jsx";

// Styled components - Điều chỉnh lại một số styled components để giống ảnh gốc hơn
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  position: "relative",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transform: "translateY(-4px)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  },
}));

const StyledCardMedia = styled(CardMedia)({
  width: 380,
  height: 250,
  objectFit: "cover",
});

const VipBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 10,
  left: 10,
  background: "#2c3e50",
  color: "white",
  padding: "4px 8px",
  borderRadius: theme.spacing(0.5),
  fontSize: 12,
  fontWeight: "bold",
  zIndex: 1,
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 10,
  left: 10,
  background: "#e74c3c",
  color: "white",
  padding: "4px 10px",
  borderRadius: theme.spacing(0.5),
  fontSize: 14,
  fontWeight: "bold",
  zIndex: 1,
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 10,
  right: 10,
  color: "#e74c3c",
  background: "rgba(255,255,255,0.8)",
  "&:hover": {
    background: "rgba(255,255,255,0.9)",
  },
  zIndex: 1,
}));

const ViewMapButtonLink = styled("a")(({ theme }) => ({
  display: "block",
  width: "100%",
  height: 150,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  color: "#777",
  fontWeight: "bold",
  textDecoration: "none",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));

const MapOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: "1rem",
  fontWeight: "bold",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  borderRadius: theme.spacing(1),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      transition: "border-color 0.3s ease", // Smooth border color transition on hover
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: 1, // Keep border width consistent when focused
    },
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4, // Thinner track
  "& .MuiSlider-thumb": {
    width: 10, // Thinner thumb
    height: 10, // Thinner thumb
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit", // Remove default shadow on focus/hover
    },
  },
  "& .MuiSlider-track": {
    height: 4, // Thinner track
  },
  "& .MuiSlider-rail": {
    height: 4, // Thinner track
    color: "#d3d3d3", // Light grey rail color
    opacity: 1, // Make rail opaque
  },
}));

// Style for removing bullet points in Select
const NoBulletMenuItem = styled(MenuItem)(() => ({
  listStyleType: "none",
}));

const RoomListing = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floor, setFloor] = useState("");
  const [originalRooms, setOriginalRooms] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2500000]);
  const [minPriceInput, setMinPriceInput] = useState(0);
  const [maxPriceInput, setMaxPriceInput] = useState(2500000);
  const [availableFloors, setAvailableFloors] = useState([]);
  const [allFloors, setAllFloors] = useState([]);
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [maxSliderPrice, setMaxSliderPrice] = useState(2500000);
  const [allFacilities, setAllFacilities] = useState([]);
  const [facilityIconMap, setFacilityIconMap] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const roomTypeLabels = {
    single: "Phòng Đơn",
    double: "Phòng Đôi",
    suite: "Phòng Suite",
    family: "Phòng Gia Đình",
  };

  const defaultFacilities = [
    { icon: <WifiIcon />, label: "Wifi", name: "Wifi" },
    { icon: <AcIcon />, label: "Điều hòa", name: "Điều hòa" },
    { icon: <PoolIcon />, label: "Hồ bơi", name: "Bể bơi ngoài trời" },
    { icon: <RestaurantIcon />, label: "Nhà hàng", name: "Nhà hàng" },
    { icon: <TvIcon />, label: "TV", name: "TV" },
    { icon: <ParkingIcon />, label: "Bãi đỗ xe", name: "Bãi đỗ xe" },
    { icon: <AcIcon />, label: "Máy sấy", name: "máy sấy" },
  ];

  const hotelAddress =
    "Khách sạn Hotels, Thạch Hòa, Thạch Thất, Hà Nội, Việt Nam";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hotelAddress
  )}`;

  const formatPrice = (price) => {
    // Moved formatPrice function definition here
    return price.toLocaleString("vi-VN");
  };

  useEffect(() => {
    const validTypes = ["single", "double", "suite", "family"];
    if (!validTypes.includes(type)) {
      navigate("/");
      return;
    }

    const fetchRoomsAndFacilities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const roomsResponse = await axios.get("http://localhost:9999/api/room");
        const roomsData = roomsResponse.data.data; // Directly use rooms data

        // Extract all unique facilities from rooms data
        const facilitiesFromRooms = [];
        roomsData.forEach((room) => {
          room.facility_id.forEach((facility) => {
            const existingFacility = facilitiesFromRooms.find(
              (f) => f._id === facility._id
            );
            if (!existingFacility) {
              facilitiesFromRooms.push(facility);
            }
          });
        });
        setAllFacilities(facilitiesFromRooms);

        const iconMap = {};
        defaultFacilities.forEach((defaultFacility) => {
          const matchingFacility = facilitiesFromRooms.find(
            (f) => f.name === defaultFacility.name
          );
          if (matchingFacility) {
            iconMap[matchingFacility._id] = defaultFacility.icon;
          }
        });
        setFacilityIconMap(iconMap);

        const filteredRooms = roomsData.filter((room) => room.type === type);

        const enhancedRooms = filteredRooms.map((room) => ({
          ...room,
          room_number: room.room_number || "N/A",
          price: room.price || 0,
          description: room.description || "",
          status: room.status || "unavailable",
          rating: (Math.random() * 2 + 8).toFixed(1),
          reviewCount: Math.floor(Math.random() * 500) + 100,
          discount:
            Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0,
          vip: Math.random() > 0.7,
          facilities: room.facility_id.map((facilityId) => {
            const facility = facilitiesFromRooms.find(
              (facility) => facility._id === facilityId._id
            );
            return facility || { _id: facilityId, name: "Unknown Facility" };
          }),
        }));

        setRooms(enhancedRooms);
        setOriginalRooms(enhancedRooms);

        // Calculate dynamic max price for slider
        const prices = enhancedRooms.map((room) => room.price);
        const calculatedMaxPrice =
          prices.length > 0 ? Math.max(...prices) : 2500000;
        setMaxSliderPrice(calculatedMaxPrice);
        setPriceRange([0, calculatedMaxPrice]);
        setMaxPriceInput(calculatedMaxPrice);

        // Extract available floors
        const floorsWithRooms = [
          ...new Set(
            enhancedRooms.map((room) =>
              Math.floor(parseInt(room.room_number) / 100)
            )
          ),
        ].sort((a, b) => a - b);
        setAvailableFloors(floorsWithRooms);

        // Determine all possible floors
        let maxFloor = 0;
        enhancedRooms.forEach((room) => {
          const floorNumber = Math.floor(parseInt(room.room_number) / 100);
          if (floorNumber > maxFloor) {
            maxFloor = floorNumber;
          }
        });
        const allPossibleFloors = [];
        for (let i = 1; i <= maxFloor; i++) {
          allPossibleFloors.push(i);
        }
        setAllFloors(allPossibleFloors);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
        setError(
          "Có lỗi xảy ra khi tải danh sách phòng. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomsAndFacilities();
  }, [type, navigate]);

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortBy(value);

    let sortedRooms = [...rooms];
    switch (value) {
      case "price_asc":
        sortedRooms.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedRooms.sort((a, b) => b.price - a.price);
        break;
      default:
        sortedRooms = [...originalRooms];
    }
    setRooms(sortedRooms);
  };

  const handleFloorChange = (event) => {
    const selectedFloor = event.target.value;
    setFloor(selectedFloor);

    if (selectedFloor === "") {
      setRooms(originalRooms);
    } else {
      const filteredRooms = originalRooms.filter(
        (room) =>
          Math.floor(parseInt(room.room_number) / 100) ===
          parseInt(selectedFloor)
      );
      setRooms(filteredRooms);
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPriceInput(newValue[0]);
    setMaxPriceInput(newValue[1]);

    // Apply price filter directly on slider change
    const filteredByPrice = originalRooms.filter(
      (room) => room.price >= newValue[0] && room.price <= newValue[1]
    );
    setRooms(filteredByPrice);
  };

  const handleMinPriceInputChange = (event) => {
    const newMinPrice =
      event.target.value === "" ? 0 : Number(event.target.value);
    setMinPriceInput(newMinPrice);
    setPriceRange([newMinPrice, priceRange[1]]);

    const filteredByPrice = originalRooms.filter(
      (room) => room.price >= newMinPrice && room.price <= priceRange[1]
    );
    setRooms(filteredByPrice);
  };

  const handleMaxPriceInputChange = (event) => {
    const newMaxPrice =
      event.target.value === "" ? maxSliderPrice : Number(event.target.value); // Default to maxSliderPrice if empty
    setMaxPriceInput(newMaxPrice);
    setPriceRange([priceRange[0], newMaxPrice]);

    const filteredByPrice = originalRooms.filter(
      (room) => room.price >= priceRange[0] && room.price <= newMaxPrice
    );
    setRooms(filteredByPrice);
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const toggleFavorite = (event, roomId) => {
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const calculateOriginalPrice = (price, discount) => {
    if (!discount) return null;
    return Math.round(price / (1 - discount / 100));
  };

  const handleNextImage = (event, roomImages) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === roomImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = (event, roomImages) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? roomImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {isLoading && (
        <>
          <Loading />
        </>
      )}
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            {/* View in a map Button as a Link */}
            <ViewMapButtonLink
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsMapHovered(true)}
              onMouseLeave={() => setIsMapHovered(false)}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 150,
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src="https://www.google.com/maps/vt/data=m6LpuNPtJfLVmuw171Clwl-2SB7ou8JR_ckIrZNijlrSOq0xrL7rpFsl3rh7R43JjvqajEtDdr6_EAn_pgEtag9AUhW_q8SXe4znUH9siTdXEZTEo7alKN6ncpCujrig_CmXVx1CkIHMzVU3ERpVp61kDUnezlL85A39f0UDh2XDurIFQ5D44-A3G61Ozmp4exyEbEgLfnfZKaodlrHiJfUf48gRC7hqAfY9sdcsFKbSHqbHijoZg5xyAE2Z"
                  alt="Map of Hotels"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <MapOverlay style={{ opacity: isMapHovered ? 1 : 0 }}>
                  View in a map
                </MapOverlay>
              </Box>
              <MapIcon style={{ display: "none" }} />{" "}
              {/* Hide the icon from default display */}
            </ViewMapButtonLink>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Bộ lọc tìm kiếm
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Sắp xếp theo giá
                </Typography>
                <StyledFormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                    variant="outlined" // Use outlined variant for Select
                  >
                    <MenuItem value="">
                      <em>Mặc định</em>
                    </MenuItem>
                    <NoBulletMenuItem value="price_asc">
                      Giá thấp đến cao
                    </NoBulletMenuItem>
                    <NoBulletMenuItem value="price_desc">
                      Giá cao đến thấp
                    </NoBulletMenuItem>
                  </Select>
                </StyledFormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Chọn tầng
                </Typography>
                <StyledFormControl fullWidth size="small">
                  <Select
                    value={floor}
                    onChange={handleFloorChange}
                    displayEmpty
                    variant="outlined" // Use outlined variant for Select
                  >
                    <MenuItem value="">Tất cả các tầng</MenuItem>
                    {allFloors.map((floorNumber) => (
                      <MenuItem
                        key={floorNumber}
                        value={floorNumber}
                        disabled={
                          !originalRooms.some(
                            (room) =>
                              Math.floor(parseInt(room.room_number) / 100) ===
                              floorNumber
                          )
                        }
                        sx={{ listStyle: "none" }} // Thêm dòng này
                      >
                        Tầng {floorNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Khoảng giá (VNĐ)
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
                >
                  <TextField
                    label="Min"
                    size="small"
                    type="number"
                    value={formatPrice(minPriceInput)}
                    onChange={(e) =>
                      setMinPriceInput(e.target.value.replace(/\D/g, ""))
                    }
                    sx={{ width: "48%" }}
                    disabled={true}
                    variant="outlined" // Use outlined variant for TextField
                  />
                  <TextField
                    label="Max"
                    size="small"
                    type="number"
                    value={formatPrice(maxPriceInput)}
                    onChange={(e) =>
                      setMaxPriceInput(e.target.value.replace(/\D/g, ""))
                    }
                    sx={{ width: "48%" }}
                    disabled={true}
                    variant="outlined" // Use outlined variant for TextField
                    placeholder={formatPrice(maxSliderPrice)} // Added placeholder
                  />
                </Box>

                <StyledSlider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={maxSliderPrice} // Use dynamic max price here
                  step={100000}
                  valueLabelFormat={(value) => `${formatPrice(value)}đ`}
                  marks={[]}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                {roomTypeLabels[type]}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <LocationIcon
                  sx={{ fontSize: 16, verticalAlign: "text-bottom", mr: 0.5 }}
                />
                {hotelAddress}
              </Typography>
            </Box>

            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography variant="body1">
                Tìm thấy <strong>{rooms.length}</strong>{" "}
                {roomTypeLabels[type].toLowerCase()}
              </Typography>
            </Paper>

            {rooms.length === 0 ? (
              <Alert severity="info">
                Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {rooms.map((room) => (
                  <Grid
                    item
                    xs={12}
                    key={room._id}
                    onClick={() => handleRoomClick(room._id)}
                  >
                    <StyledCard>
                      {room.vip && <VipBadge>VIP Access</VipBadge>}
                      <Box position="relative">
                        <StyledCardMedia
                          component="img"
                          image={room.images[currentImageIndex]}
                          alt={`Phòng ${room.room_number}`}
                          sx={{ height: "100%" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            px: 1,
                            transform: "translateY(-50%)",
                            zIndex: 2,
                          }}
                        >
                          <IconButton
                            onClick={(e) => handlePrevImage(e, room.images)}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.8)",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                            }}
                          >
                            <ArrowBackIcon />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleNextImage(e, room.images)}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.8)",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                            }}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </Box>

                        {/* Indicators */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            zIndex: 2,
                          }}
                        >
                          {room.images.map((_, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor:
                                  index === currentImageIndex
                                    ? "white"
                                    : "rgba(255,255,255,0.5)",
                              }}
                            />
                          ))}
                        </Box>

                        <FavoriteButton
                          onClick={(e) => toggleFavorite(e, room._id)}
                        >
                          {favorites[room._id] ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </FavoriteButton>
                        {room.discount > 0 && (
                          <DiscountBadge>Giảm {room.discount}%</DiscountBadge>
                        )}
                      </Box>
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              gutterBottom
                              fontWeight="bold"
                            >
                              Phòng {room.room_number} -{" "}
                              {roomTypeLabels[room.type]}
                            </Typography>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Box
                                sx={{
                                  bgcolor: "#2c8a5f",
                                  color: "white",
                                  borderRadius: 1,
                                  px: 1,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  width: "fit-content",
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {room.rating}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                ml={1}
                                fontWeight="medium"
                              >
                                Tuyệt vời
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                ml={1}
                              >
                                ({room.reviewCount} đánh giá)
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={
                              room.status === "available"
                                ? "Còn trống"
                                : "Đã đặt"
                            }
                            color={
                              room.status === "available" ? "success" : "error"
                            }
                            sx={{ ml: 2 }}
                          />
                        </Box>

                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {room.description ||
                            "Phòng sang trọng với đầy đủ tiện nghi hiện đại, tầm nhìn đẹp, không gian thoáng đãng và yên tĩnh."}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          {room.facilities.map((facility, index) => {
                            const facilityIcon = facilityIconMap[facility._id];
                            const matchedDefaultFacility =
                              defaultFacilities.find(
                                (f) => f.name === facility.name
                              );

                            return facilityIcon && matchedDefaultFacility ? (
                              <Tooltip
                                title={matchedDefaultFacility.label}
                                key={index}
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    border: "1px solid #e0e0e0",
                                    "&:hover": {
                                      backgroundColor: "#f5f5f5",
                                    },
                                  }}
                                >
                                  {facilityIcon}
                                </IconButton>
                              </Tooltip>
                            ) : facility ? (
                              <Chip
                                label={facility.name}
                                key={index}
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ) : null;
                          })}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Box>
                            {room.discount > 0 && (
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                {calculateOriginalPrice(
                                  room.price,
                                  room.discount
                                ).toLocaleString("vi-VN")}
                                đ/đêm
                              </Typography>
                            )}
                            <Typography
                              variant="h5"
                              color="primary"
                              fontWeight="bold"
                            >
                              {formatPrice(room.price)} đ/đêm
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Đã bao gồm thuế & phí
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={room.status !== "available"}
                            size="large"
                            sx={{
                              px: 3,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          >
                            {room.status === "available"
                              ? "Đặt ngay"
                              : "Hết phòng"}
                          </Button>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default RoomListing;
