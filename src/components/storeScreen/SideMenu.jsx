import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent.jsx';

const drawerWidth = 240;

// Define a gradient for a more sophisticated look
const headerGradient = 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)';

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderRight: 'none',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
    transition: theme.transitions.create(['width', 'box-shadow'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: headerGradient,
  padding: theme.spacing(2.5),
  textAlign: 'center',
  color: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
    pointerEvents: 'none',
  }
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  opacity: 0.6,
  margin: '0',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
}));

const FooterStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.8),
  gap: theme.spacing(1.5),
  alignItems: 'center',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  background: headerGradient,
  color: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at bottom left, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
  },
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    boxShadow: `0 -4px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  backgroundColor: alpha('#ffffff', 0.92),
  color: '#e91e63',
  border: '2px solid rgba(255, 255, 255, 0.7)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  fontSize: '1rem',
  fontWeight: 600,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  }),
  '&:hover': {
    transform: 'scale(1.05) translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.12)',
    cursor: 'pointer'
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 0),
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.standard,
  }),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.divider, 0.2),
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  },
}));

export default function SideMenu({onMenuItemClick}) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      <HeaderBox>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            letterSpacing: '0.5px',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            mb: 0.5,
            animation: 'fadeIn 0.6s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-10px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          STORE DASHBOARD
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.85,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            animation: 'fadeIn 0.6s ease-out 0.3s backwards',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(5px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          Welcome Back
        </Typography>
      </HeaderBox>
      
      <StyledDivider />
      
      <ContentBox>
        <MenuContent onMenuItemClick={onMenuItemClick}/>
      </ContentBox>
      
      <FooterStack direction="row">
        <StyledAvatar
          alt="Store"
          src="/static/images/avatar/7.jpg"
        >
          S
        </StyledAvatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '0.2px',
              mb: 0.3
            }}
          >
            Store
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.7rem',
              letterSpacing: '0.1px'
            }}
          >
            store@gmail.com
          </Typography>
        </Box>
      </FooterStack>
    </Drawer>
  );
}