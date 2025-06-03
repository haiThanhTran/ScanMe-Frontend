// theme.js
import { createTheme } from '@mui/material/styles';

export const pizzaTheme = createTheme({
  palette: {
    primary: {
      main: '#FE724C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E65100',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FEBDAB',
    },
    error: {
        main: '#FFCDD2',
        contrastText: '#D32F2F',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#FFFFFF',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    body1: {
      color: '#FFFFFF',
    },
    body2: {
      color: '#FEBDAB',
    }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          margin: theme.spacing(1.5, 0),
          '& .MuiFilledInput-root': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '12px',
            border: '1px solid transparent',
            '&:before, &:after': {
              borderBottom: 'none !important',
            },
            '&.Mui-focused': {
              backgroundColor: theme.palette.background.paper,
            },
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
            },
            '& input::placeholder': {
              color: '#A0A0A0',
              opacity: 1,
            },
            '&.Mui-error': {
                backgroundColor: theme.palette.error.main,
            },
            '&.Mui-error input::placeholder': {
                color: theme.palette.error.contrastText,
            },
          },
          '& .MuiFilledInput-input': {
            color: '#424242',
            '&.Mui-error': { // Sửa: Phải là '& .Mui-error' nếu class Mui-error nằm ở FilledInput-root
                // Nếu class Mui-error nằm trực tiếp trên thẻ input thì '&.Mui-error' là đúng
                // Thông thường, class Mui-error sẽ ở component cha (FilledInput-root)
                // nên không cần style riêng ở đây nếu đã style ở FilledInput-root.Mui-error
            }
          },
          '& .MuiFormHelperText-root': {
            color: theme.palette.background.paper,
            marginLeft: 0,
            fontSize: '0.8rem',
            position: 'relative',
            marginTop: '4px',
            '&.Mui-error': {
              color: theme.palette.error.main, // Màu chữ cho helper text khi lỗi
            }
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: '12px',
          padding: '12px 0',
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(1),
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-checked': {
            color: 'white',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.3rem'
          }
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.9rem',
          color: 'white',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: 60,
          height: 60,
          backgroundColor: theme.palette.background.paper,
          marginBottom: theme.spacing(2),
          '& .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
          }
        }),
      },
    },
    MuiLink: { // ĐÃ SỬA
      styleOverrides: {
        root: ({ theme }) => ({ // Cú pháp arrow function đúng
          fontWeight: 'bold',
          color: theme.palette.common.white,
          textDecorationColor: theme.palette.common.white,
          '&:hover': {
            textDecorationColor: theme.palette.text.secondary,
            color: theme.palette.text.secondary,
          }
        })
      }
    }
  },
});