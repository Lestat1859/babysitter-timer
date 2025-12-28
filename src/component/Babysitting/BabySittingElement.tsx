import { Duration, format } from "date-fns";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import { deleteBabySittingToFireBase } from "../../services/BabySittingService";
import { useRecoilState } from "recoil";
import { babysittingState } from "../../recoil/recoil_states";
import { useNavigate } from "react-router-dom";
import EditDeleteMenu from "../common/ActionMenu";
import { logEvent } from "firebase/analytics";
import { fireBaseAnalytics } from "../../utils/firebase";
import { 
  Box, 
  Typography, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  CircularProgress,
  useTheme,
  alpha
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useUserRole } from "../../hooks/useUserRole";

type DurationProps = {
  id: string,
  arrivalDate: Date,
  departureDate: Date,
  duration: Duration,
  userId?: string,      // Optionnel pour compatibilité
  userEmail?: string    // Optionnel pour affichage
}

function BabySittingElement(props: DurationProps) {
  const [babySittings, setBabySittings] = useRecoilState(babysittingState);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { canViewAllUsersSessions } = useUserRole();

  // Calculate color intensity based on duration
  const getDurationColor = () => {
    const hours = props.duration.hours || 0;
    const minutes = props.duration.minutes || 0;
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes > 300) return {
      color: theme.palette.success.dark,
      bgcolor: alpha(theme.palette.success.main, 0.1)
    }; // > 5 hours
    
    if (totalMinutes > 180) return {
      color: theme.palette.success.main,
      bgcolor: alpha(theme.palette.success.main, 0.1)
    }; // > 3 hours
    
    return {
      color: theme.palette.success.light,
      bgcolor: alpha(theme.palette.success.main, 0.1)
    };
  };

  function handleDelete() {
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    logEvent(fireBaseAnalytics, "babysitting_element_button_delete");
    console.log('🔍 [DEBUG] confirmDelete dans BabySittingElement.tsx:', {
      idToDelete: props.id,
      currentBabysittings: babySittings.length,
      message: 'Début de la suppression depuis l\'élément'
    });
    setIsDeleting(true);
    try {
      await deleteBabySittingToFireBase(props.id, true);
      console.log('✅ [DEBUG] Suppression Firebase réussie depuis l\'élément');
      setBabySittings(babySittings.filter((babySitting) => babySitting.id !== props.id));
      console.log('✅ [DEBUG] State local mis à jour depuis l\'élément');
      setShowDeleteModal(false);
      toast.success("Session supprimée avec succès !");
    } catch (error) {
      console.error("❌ [DEBUG] Erreur lors de la suppression depuis l'élément:", error);
      toast.error("Erreur lors de la suppression de la session.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleUpdate() {
    logEvent(fireBaseAnalytics, "babysitting_element_button_update");
    navigate("/babysitting/edit/" + props.id);
  }

  // Format date to display day of week
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const durationColors = getDurationColor();

  return (
    <>
      <Box 
        sx={{ 
          py: 2, 
          px: 3,
          transition: 'all 0.2s',
          bgcolor: isHovered ? 'primary.lighter' : 'transparent',
          '&:hover': {
            bgcolor: 'primary.lighter'
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Session de babysitting du ${formatDate(props.arrivalDate)}`}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Left side: Date, Time, and Duration */}
          <Box flexGrow={1}>
            <Box display="flex" flexWrap="wrap" alignItems="center" mb={0.5}>
              {/* Date */}
              <Typography variant="subtitle1" fontWeight="medium" color="text.primary" mr={1}>
                Le {formatDate(props.arrivalDate)}
              </Typography>
              
              {/* Time display */}
              <Chip
                icon={<AccessTimeIcon fontSize="small" color="primary" />}
                label={`${format(props.arrivalDate, 'HH:mm')} - ${format(props.departureDate, 'HH:mm')}`}
                size="small"
                sx={(theme) => ({ 
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : 'grey.100',
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : 'text.secondary',
                  fontWeight: 'medium',
                  height: 24,
                  border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                })}
              />
            </Box>
            
            {/* Duration */}
            <Box mt={0.5}>
              <Chip
                icon={<TimerIcon fontSize="small" color="success" />}
                label={`${props.duration.hours || 0}h${props.duration.minutes || 0}min`}
                size="small"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.success.main, 0.15)
                    : durationColors.bgcolor,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.success.light
                    : durationColors.color,
                  fontWeight: 'medium',
                  height: 24,
                  border: theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                    : 'none'
                })}
              />
            </Box>

            {/* User info for admins */}
            {canViewAllUsersSessions() && (
              <Box mt={0.5}>
                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label={props.userEmail || 'Iloukia'}
                  size="small"
                  sx={(theme) => ({
                    bgcolor: (props.userEmail === 'Iloukia' || !props.userEmail)
                      ? theme.palette.mode === 'dark'
                        ? alpha(theme.palette.warning.main, 0.15)
                        : alpha(theme.palette.warning.main, 0.1)
                      : theme.palette.mode === 'dark'
                        ? alpha(theme.palette.info.main, 0.15)
                        : alpha(theme.palette.info.main, 0.1),
                    color: (props.userEmail === 'Iloukia' || !props.userEmail)
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.warning.light
                        : theme.palette.warning.main
                      : theme.palette.mode === 'dark'
                        ? theme.palette.info.light
                        : theme.palette.info.main,
                    fontWeight: 'medium',
                    height: 24,
                    border: (props.userEmail === 'Iloukia' || !props.userEmail)
                      ? theme.palette.mode === 'dark'
                        ? `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
                        : 'none'
                      : theme.palette.mode === 'dark'
                        ? `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                        : 'none'
                  })}
                />
              </Box>
            )}
          </Box>

          {/* Action Menu */}
          <EditDeleteMenu 
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Voulez-vous vraiment supprimer cette session de babysitting du {formatDate(props.arrivalDate)} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteModal(false)} 
            color="inherit"
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BabySittingElement;
