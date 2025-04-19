import { createTheme, alpha } from '@mui/material/styles';

// Define custom color palette
export const colors = {
  blue: {
    50: '#eef6ff',
    100: '#d8eafe',
    200: '#b9dafd',
    300: '#8ac3fb',
    400: '#55a5f8',
    500: '#3b82f6', // Primary main
    600: '#2563eb', // Primary dark
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280', // Secondary main
    600: '#4b5563', // Secondary dark
    700: '#374151',
    800: '#1f2937', // Text primary
    900: '#111827',
  },
  green: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399', // Light
    500: '#10b981', // Main
    600: '#059669', // Dark
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171', // Light
    500: '#ef4444', // Main
    600: '#dc2626', // Dark
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    800: '#92400e',
  }
};

// Augment the theme palette
declare module '@mui/material/styles' {
  interface Palette {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue[500],
      light: colors.blue[400],
      dark: colors.blue[600],
      contrastText: '#ffffff',
      lighter: alpha(colors.blue[500], 0.12),
    },
    secondary: {
      main: colors.gray[500],
      light: colors.gray[400],
      dark: colors.gray[600],
      contrastText: '#ffffff',
      lighter: alpha(colors.gray[500], 0.12),
    },
    error: {
      main: colors.red[500],
      light: colors.red[400],
      dark: colors.red[600],
      lighter: alpha(colors.red[500], 0.12),
    },
    warning: {
      main: colors.amber[500],
      light: colors.amber[400],
      dark: colors.amber[600],
    },
    info: {
      main: colors.blue[500],
      light: colors.blue[400],
      dark: colors.blue[600],
      lighter: alpha(colors.blue[500], 0.12),
    },
    success: {
      main: colors.green[500],
      light: colors.green[400],
      dark: colors.green[600],
      lighter: alpha(colors.green[500], 0.12),
    },
    background: {
      default: colors.gray[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.gray[800],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
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
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        sizeLarge: {
          padding: '0.75rem 1.5rem',
        },
        sizeMedium: {
          padding: '0.625rem 1.25rem',
        },
        sizeSmall: {
          padding: '0.375rem 0.75rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid rgba(229, 231, 235, 1)', // gray-200 from Tailwind
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        root: {
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          background: `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`,
          color: '#ffffff',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&.MuiAvatar-colorPrimary': {
            background: `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`,
          },
          '&.MuiAvatar-colorSecondary': {
            background: `linear-gradient(145deg, ${alpha(colors.gray[400], 0.8)}, ${alpha(colors.gray[600], 0.9)})`,
          },
          '&.MuiAvatar-colorSuccess': {
            background: `linear-gradient(145deg, ${alpha(colors.green[400], 0.8)}, ${alpha(colors.green[600], 0.9)})`,
          },
          '&.MuiAvatar-colorError': {
            background: `linear-gradient(145deg, ${alpha(colors.red[400], 0.8)}, ${alpha(colors.red[600], 0.9)})`,
          },
          '&.MuiAvatar-colorInfo': {
            background: `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`,
          },
          '&.MuiAvatar-colorWarning': {
            background: `linear-gradient(145deg, ${alpha(colors.amber[400], 0.8)}, ${alpha(colors.amber[600], 0.9)})`,
          }
        }
      }
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: alpha(colors.blue[500], 0.08),
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '2px 8px',
          paddingTop: 8,
          paddingBottom: 8,
          '&:hover': {
            backgroundColor: alpha(colors.blue[500], 0.08),
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
});

export default theme;
