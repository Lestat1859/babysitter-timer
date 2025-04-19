import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useThemeContext } from '../../context/theme-context';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  sx?: React.CSSProperties | any;
}

/**
 * ThemeToggle component - Toggles between light and dark theme modes
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium',
  tooltip = 'Changer de thème',
  sx
}) => {
  const { mode, toggleColorMode } = useThemeContext();
  const theme = useTheme();
  
  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={toggleColorMode}
        size={size}
        aria-label={mode === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
        color="inherit"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
          ...sx
        }}
      >
        {mode === 'dark' ? (
          <LightModeIcon sx={{ color: theme.palette.primary.light }} />
        ) : (
          <DarkModeIcon sx={{ color: 'white' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
