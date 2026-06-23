import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0F52BA', // Sapphire Blue
      light: '#4A81D4',
      dark: '#0A3B85',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#12B76A', // Medical Green
      light: '#32D583',
      dark: '#039855',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB', // Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D2939',
      secondary: '#475467',
    },
    error: {
      main: '#D92D20',
    },
    success: {
      main: '#12B76A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(15, 82, 186, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 12px rgba(16, 24, 40, 0.06)',
          border: '1px solid #EAECF0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
