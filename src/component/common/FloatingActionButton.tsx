import React from 'react';
import { Fab, Tooltip, useMediaQuery, useTheme, Zoom } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { fireBaseAnalytics } from '../../utils/firebase';

interface FloatingActionButtonProps {
  tooltip?: string;
  to?: string;
  onClick?: () => void;
  showOnDesktop?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon?: React.ReactNode;
}

/**
 * A floating action button component, positioned at the bottom right of the screen.
 * By default, it's only shown on mobile devices unless showOnDesktop is true.
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  tooltip = 'Ajouter',
  to = '/babysitting/add',
  onClick,
  showOnDesktop = false,
  color = 'primary',
  icon = <AddIcon />
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Only show FAB on mobile unless showOnDesktop is true
  if (!isMobile && !showOnDesktop) {
    return null;
  }

  const handleClick = () => {
    logEvent(fireBaseAnalytics, 'fab_button_click');
    
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Zoom in={true}>
      <Tooltip title={tooltip} placement="left">
        <Fab
          color={color}
          sx={{
            position: 'fixed',
            bottom: { xs: 24, sm: 32 },
            right: { xs: 24, sm: 32 },
            zIndex: theme.zIndex.speedDial,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleClick}
          aria-label={tooltip}
        >
          {icon}
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default FloatingActionButton;
