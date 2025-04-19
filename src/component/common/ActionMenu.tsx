import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  tooltipTitle?: string;
  size?: 'small' | 'medium' | 'large';
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
}

/**
 * ActionMenu component displays a menu triggered by an ellipsis icon (three dots)
 * Used for item-level actions like edit, delete, etc.
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  tooltipTitle = 'Actions',
  size = 'small',
  placement = 'bottom-end'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (callback: () => void) => (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    callback();
    handleClose();
  };

  return (
    <>
      <Tooltip title={tooltipTitle} placement={placement}>
        <IconButton
          aria-label="more actions"
          id="action-button"
          aria-controls={open ? 'action-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size={size}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 160,
              overflow: 'visible',
              mt: 1,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            }
          }
        }}
      >
        {items.map((item, index) => (
          <MenuItem 
            key={index} 
            onClick={handleItemClick(item.onClick)}
            sx={{
              py: 1.5,
              '&:hover': {
                '& .MuiListItemIcon-root': {
                  color: item.color || 'primary.main'
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: item.color || 'text.secondary', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                variant: 'body2',
                sx: { fontWeight: 500 }
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

/**
 * Convenience component for standard Edit/Delete actions menu
 */
export const EditDeleteMenu: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ 
  onEdit, 
  onDelete, 
  editLabel = 'Modifier', 
  deleteLabel = 'Supprimer',
  size = 'small'
}) => {
  const items: ActionMenuItem[] = [
    {
      label: editLabel,
      icon: <EditIcon fontSize="small" />,
      onClick: onEdit,
      color: 'primary'
    },
    {
      label: deleteLabel,
      icon: <DeleteIcon fontSize="small" />,
      onClick: onDelete,
      color: 'error'
    }
  ];

  return <ActionMenu items={items} size={size} />;
};

export default EditDeleteMenu;
