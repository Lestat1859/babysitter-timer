import React from "react";
import { Button, IconButton, SxProps, Theme } from "@mui/material";
import { 
  AccessTime as ClockIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  MoreVert as DetailIcon
} from '@mui/icons-material';

type ButtonProps = {
  label: string;
  type: string;
  clickFunction: Function;
  iconImage?: string;
  hiddenMd?: boolean;
  size?: string; // Keep as string to maintain compatibility with existing code
  smallText?: boolean;
  fullWidth?: boolean; // Add fullWidth prop
};

// Map the old button types to Material UI variants and colors
const getButtonProps = (type: string) => {
  switch (type) {
    case "standard":
      return { variant: "contained", color: "primary" };
    case "cancel":
      return { variant: "contained", color: "error" };
    case "back":
      return { variant: "contained", color: "secondary" };
    case "validate":
      return { variant: "contained", color: "success" };
    case "transparentBgStyle":
      return { variant: "contained", color: "primary", isIconButton: true };
    case "selected":
      return { variant: "outlined", color: "primary" };
    default:
      return { variant: "contained", color: "primary" };
  }
};

// Map the old icon names to Material UI icons
const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  
  switch (iconName) {
    case "clock":
      return <ClockIcon />;
    case "delete":
      return <DeleteIcon />;
    case "back":
      return <BackIcon />;
    case "save":
      return <SaveIcon />;
    case "add":
      return <AddIcon />;
    case "edit":
      return <EditIcon />;
    case "detail":
      return <DetailIcon />;
    default:
      return null;
  }
};

function Buttons(props: ButtonProps) {
  const { variant, color, isIconButton } = getButtonProps(props.type);
  const icon = getIcon(props.iconImage);
  
  // Convert size prop to Material UI size
  const getMuiSize = (size?: string) => {
    if (!size) return "medium";
    switch (size) {
      case "sm":
      case "small":
        return "small";
      case "lg":
      case "large":
        return "large";
      case "md":
      case "medium":
      default:
        return "medium";
    }
  };
  
  const muiSize = getMuiSize(props.size);
  
  // Create sx prop for additional styling
  const sx: SxProps<Theme> = {
    marginBottom: 1,
    marginRight: 1,
    ...(props.smallText && { fontSize: '0.75rem' }),
    ...(props.hiddenMd && { 
      display: { xs: 'flex', md: 'none' } 
    }),
  };

  // For icon-only buttons (like the detail button on mobile)
  if (isIconButton && props.label === "") {
    return (
      <IconButton
        color={color as "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit" | undefined}
        onClick={() => props.clickFunction()}
        size={muiSize}
        sx={sx}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Button
      variant={variant as "text" | "outlined" | "contained" | undefined}
      color={color as "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit" | undefined}
      onClick={() => props.clickFunction()}
      size={muiSize}
      startIcon={icon}
      sx={sx}
      fullWidth={props.fullWidth} // Pass fullWidth prop to MUI Button
    >
      {props.label}
    </Button>
  );
}

export default Buttons;
