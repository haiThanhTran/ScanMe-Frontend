import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {useLocation, useNavigate} from "react-router-dom";
import { notifyError, notifySuccess } from '../notification/ToastNotification';
import authService from '../../services/AuthService';
import { Box } from '@mui/material';

const mainListItems = [
    {text: 'Trang chủ', icon: <HomeRoundedIcon/>, path: "homeStore"},
    {text: 'Quản trị voucher', icon: <LocalOfferRoundedIcon/>, path: "voucherManagement"},
    {text: 'Quản trị sản phẩm', icon: <ShoppingBagRoundedIcon/>, path: "productManagement"},
    {text: 'Quản trị cửa hàng', icon: <StorefrontRoundedIcon/>, path: "storeManagement"},
    {text: 'Quản trị đơn hàng', icon: <ShoppingBagRoundedIcon/>, path: "orderManagement"},
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "Log out", icon: <LogoutRoundedIcon /> },
];

const StyledListItemButton = styled(ListItemButton)(({ theme, isSelected }) => ({
  borderRadius: '12px',
  margin: '2px 8px',
  padding: '8px 16px',
  transition: theme.transitions.create(['background-color', 'color', 'box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  position: 'relative',
  overflow: 'hidden',
  
  // Normal state
  backgroundColor: 'transparent',
  
  // Selected state
  ...(isSelected && {
    background: `linear-gradient(90deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#f44336', 0.05)} 100%)`,
    color: '#f44336',
    boxShadow: `0 2px 6px ${alpha('#f44336', 0.15)}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      background: 'linear-gradient(to bottom, #f44336, #e91e63)',
      borderRadius: '0 2px 2px 0',
    },
  }),
  
  // Hover state
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.default, 0.7),
    transform: 'translateX(4px)',
    boxShadow: isSelected ? `0 4px 10px ${alpha('#f44336', 0.2)}` : '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  
  // Active state (clicking)
  '&:active': {
    transform: 'translateX(2px) scale(0.98)',
    boxShadow: 'none',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, isSelected }) => ({
  color: isSelected ? '#f44336' : alpha(theme.palette.text.primary, 0.7),
  minWidth: '42px',
  transition: theme.transitions.create(['color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '& svg': {
    fontSize: '1.4rem',
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.shorter,
    }),
  },
  '.MuiListItemButton-root:hover &': {
    '& svg': {
      transform: 'scale(1.1)',
    },
  },
}));

const MenuContent = ({ onMenuItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    try{
      const res = await authService.logout();
      if(res.status === 200){
        notifySuccess("Logged out successfully");
        navigate('/');
      }
    }catch (e) {
      notifyError("Failed to logout");
      console.log(e);
    }
  }
  
  return (
    <Stack sx={{ 
      flexGrow: 1, 
      px: 1, 
      py: 2,
      justifyContent: "space-between",
      '& .MuiList-root': {
        padding: '4px 0',
      }
    }}>
      <List>
        {mainListItems.map((item, index) => {
          const isSelected = location.pathname.includes(item.path);
          return (
            <ListItem
              key={index}
              disablePadding
              sx={{ 
                display: "block",
                mb: 0.5,
              }}
              onClick={() => item.path && onMenuItemClick(item.path)}
            >
              <StyledListItemButton isSelected={isSelected}>
                <StyledListItemIcon isSelected={isSelected}>
                  {item.icon}
                </StyledListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.9rem',
                      letterSpacing: isSelected ? '0.3px' : 'normal',
                      transition: 'all 0.2s ease-in-out',
                    }
                  }}
                />
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      pointerEvents: 'none',
                      opacity: 0.03,
                      background: 'radial-gradient(circle at right center, #f44336 0%, transparent 70%)',
                    }}
                  />
                )}
              </StyledListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <List>
        {secondaryListItems.map((item, index) => {
          return (
            <ListItem 
              key={index} 
              disablePadding 
              sx={{ 
                display: "block",
                mb: 0.5,
              }}
            >
              <StyledListItemButton 
                onClick={() => item.text === "Log out" ? handleLogOut() : console.log('Settings clicked')}
                isSelected={false}
              >
                <StyledListItemIcon isSelected={false}>
                  {item.icon}
                </StyledListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.85rem',
                      fontWeight: 400,
                    }
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

export default MenuContent;