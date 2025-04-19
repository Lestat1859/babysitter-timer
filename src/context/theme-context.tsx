import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { colors } from '../theme';

interface ThemeContextProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

// Creating the context with default values
export const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleColorMode: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get stored theme preference or default to 'light'
  const storedTheme = localStorage.getItem('themeMode') as PaletteMode | null;
  const [mode, setMode] = useState<PaletteMode>(storedTheme || 'dark');

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create the theme based on current mode
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: colors.blue[500],
          light: colors.blue[400],
          dark: colors.blue[600],
          contrastText: '#ffffff',
          lighter: alpha(colors.blue[500], mode === 'light' ? 0.12 : 0.15),
        },
        secondary: {
          main: colors.gray[500],
          light: colors.gray[400],
          dark: colors.gray[600],
          contrastText: '#ffffff',
          lighter: alpha(colors.gray[500], mode === 'light' ? 0.12 : 0.15),
        },
        error: {
          main: colors.red[500],
          light: colors.red[400],
          dark: colors.red[600],
          lighter: alpha(colors.red[500], mode === 'light' ? 0.12 : 0.15),
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
          lighter: alpha(colors.blue[500], mode === 'light' ? 0.12 : 0.15),
        },
        success: {
          main: colors.green[500],
          light: colors.green[400],
          dark: colors.green[600],
          lighter: alpha(colors.green[500], mode === 'light' ? 0.12 : 0.15),
        },
        background: {
          default: mode === 'light' ? colors.gray[50] : colors.gray[900],
          paper: mode === 'light' ? '#ffffff' : colors.gray[800],
        },
        text: {
          primary: mode === 'light' ? colors.gray[800] : colors.gray[100],
          secondary: mode === 'light' ? colors.gray[600] : colors.gray[300],
          disabled: mode === 'light' ? colors.gray[400] : colors.gray[600],
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
              boxShadow: mode === 'light' 
                ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
              border: mode === 'light' 
                ? '1px solid rgba(229, 231, 235, 1)' // gray-200 from Tailwind
                : '1px solid rgba(55, 65, 81, 1)', // gray-700 from Tailwind
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
              boxShadow: mode === 'light'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
              background: mode === 'light'
                ? `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`
                : `linear-gradient(145deg, ${alpha(colors.blue[600], 0.8)}, ${alpha(colors.blue[800], 0.9)})`,
              color: '#ffffff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              '&.MuiAvatar-colorPrimary': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.blue[600], 0.8)}, ${alpha(colors.blue[800], 0.9)})`,
              },
              '&.MuiAvatar-colorSecondary': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.gray[400], 0.8)}, ${alpha(colors.gray[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.gray[600], 0.8)}, ${alpha(colors.gray[800], 0.9)})`,
              },
              '&.MuiAvatar-colorSuccess': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.green[400], 0.8)}, ${alpha(colors.green[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.green[600], 0.8)}, ${alpha(colors.green[800], 0.9)})`,
              },
              '&.MuiAvatar-colorError': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.red[400], 0.8)}, ${alpha(colors.red[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.red[600], 0.8)}, ${alpha(colors.red[800], 0.9)})`,
              },
              '&.MuiAvatar-colorInfo': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.blue[400], 0.8)}, ${alpha(colors.blue[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.blue[600], 0.8)}, ${alpha(colors.blue[800], 0.9)})`,
              },
              '&.MuiAvatar-colorWarning': {
                background: mode === 'light'
                  ? `linear-gradient(145deg, ${alpha(colors.amber[400], 0.8)}, ${alpha(colors.amber[600], 0.9)})`
                  : `linear-gradient(145deg, ${alpha(colors.amber[600], 0.8)}, ${alpha(colors.amber[800], 0.9)})`,
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
                backgroundColor: mode === 'light' 
                  ? alpha(colors.blue[500], 0.08)
                  : alpha(colors.blue[500], 0.16),
              },
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              borderRadius: 8,
              boxShadow: mode === 'light'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
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
                backgroundColor: mode === 'light' 
                  ? alpha(colors.blue[500], 0.08)
                  : alpha(colors.blue[500], 0.16),
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
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              minHeight: '100vh', // Ensure html covers full viewport height
            },
            body: {
              scrollbarWidth: 'thin',
              backgroundImage: mode === 'light' 
                ? 'url("/images/background-light.png")'
                : 'url("/images/background-dark.png")',
              backgroundRepeat: 'repeat',
              backgroundSize: '480px 480px',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              minHeight: '100vh', // Ensure body covers full viewport height
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: mode === 'light' ? colors.gray[100] : colors.gray[800],
              },
              '&::-webkit-scrollbar-thumb': {
                background: mode === 'light' ? colors.gray[300] : colors.gray[600],
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: mode === 'light' ? colors.gray[400] : colors.gray[500],
              },
            },
          },
        },
      },
    });
  }, [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
