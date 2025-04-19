import React, {useEffect, useState} from 'react';
import {Duration} from "date-fns";
import {calculateDurationBetweenTwoDates} from '../../utils/dates'
import {useNavigate, useParams} from "react-router-dom";
import { toast } from 'react-toastify';
import {useRecoilState} from "recoil";
import {
    addBabySittingToFireBase,
    updateBabySittingToFireBase,
    deleteBabySittingToFireBase
} from "../../services/BabySittingService";
import {babysittingState} from '../../recoil/recoil_states'
import { v4 as uuidv4 } from 'uuid';
import { IBabySitting } from "../../interfaces/IBabySitting";
import { fireBaseAnalytics } from "../../utils/firebase";
import { logEvent } from "firebase/analytics";
import { 
    DatePicker,
    TimePicker 
} from '@mui/x-date-pickers';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Stack, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    CircularProgress,
    useTheme,
    Paper,
    alpha,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import { 
    AccessTime as AccessTimeIcon, 
    CalendarMonth as CalendarMonthIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    HourglassTop as DurationIcon,
    ArrowRightAlt as ArrowRightIcon,
} from '@mui/icons-material';

function Babysitting() {
    const emptyDuration: Duration = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const [duration, setDuration] = useState<Duration>(emptyDuration);
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(new Date());
    const [dateError, setDateError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [babySittings, setBabySittings] = useRecoilState(babysittingState);
    const navigate = useNavigate();
    const { idBabysitting } = useParams() || "";
    const theme = useTheme();
    const isEditMode = idBabysitting !== undefined;

    function handleReturn() {
        logEvent(fireBaseAnalytics, "babysitting_button_back");
        navigate(-1);
    }

    function handleSave(){
        logEvent(fireBaseAnalytics,"babysitting_button_save");

        // Prevent saving if there's a date error
        if (dateError) {
            toast.error(`Erreur : ${dateError}`);
            return;
        }

        // Prevent saving if duration is zero
        if (duration.years === 0 && duration.months === 0 && duration.days === 0 && 
            duration.hours === 0 && duration.minutes === 0 && duration.seconds === 0) {
             toast.error("La durée doit être supérieure à 0.");
             return;
        }

        setIsSaving(true);
        if (isEditMode){
            updateBabysitting();
        } else {
            addBabysitting();
        }
    }
    
    function handleDeleteClick(){
        setShowDeleteConfirm(true);
    }
    
    async function confirmDelete() {
        const idBabySittingToDelete = idBabysitting || "";
        logEvent(fireBaseAnalytics,"babysitting_button_delete");
        setIsDeleting(true);
        try {
            await deleteBabySittingToFireBase(idBabySittingToDelete);
            setBabySittings(babySittings.filter((babySitting) => babySitting.id !== idBabySittingToDelete));
            toast.success("Session supprimée avec succès !");
            navigate(-1);
        } catch (error) {
            console.error("Error deleting babysitting:", error);
            toast.error("Erreur lors de la suppression de la session.");
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    }
    
    async function addBabysitting(){
        const babySitting = {
            id: uuidv4(),
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration: duration
        }
        try {
            await addBabySittingToFireBase(babySitting);
            setBabySittings([...babySittings, babySitting]);
            toast.success("Session ajoutée avec succès !");
            navigate(-1);
        } catch (error) {
            console.error("Error adding babysitting:", error);
            toast.error("Erreur lors de l'ajout de la session.");
        } finally {
            setIsSaving(false);
        }
    }
    
    async function updateBabysitting(){
        const babySitting: IBabySitting = {
            id: idBabysitting || "",
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration: duration
        }
        let babySitingsUpdated: IBabySitting[] = babySittings.slice();
        const babysittingPosition: number = babySitingsUpdated.findIndex(
            (babysitting) => babysitting.id === idBabysitting
        );
        babySitingsUpdated[babysittingPosition] = babySitting;

        try {
            await updateBabySittingToFireBase(babySitting);
            setBabySittings(babySitingsUpdated);
            toast.success("Session mise à jour avec succès !");
            navigate(-1);
        } catch (error) {
            console.error("Error updating babysitting:", error);
            toast.error("Erreur lors de la mise à jour de la session.");
        } finally {
            setIsSaving(false);
        }
    }

    // Handler for Arrival Date changes
    function handleArrivalDateChange(date: Date | null) {
        if (date) {
            // Create a new date with the same time as the current arrivalDate
            const newDate = new Date(date);
            newDate.setHours(arrivalDate.getHours(), arrivalDate.getMinutes(), 0, 0);
            
            // Update arrival date
            setArrivalDate(newDate);
            
            // Clear error if arrival change might fix it and departure is now valid
            if (departureDate >= newDate) {
                setDateError(null);
                setDuration(calculateDurationBetweenTwoDates(newDate, departureDate));
            } else {
                // Departure is now invalid relative to new arrival
                // Let's reset departure date to match arrival date but keep departure time
                const newDepartureDate = new Date(newDate);
                newDepartureDate.setHours(departureDate.getHours(), departureDate.getMinutes(), 0, 0);
                
                // If the new departure time is still before arrival, set it to arrival time
                if (newDepartureDate < newDate) {
                    newDepartureDate.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                }
                
                setDepartureDate(newDepartureDate);
                setDateError(null); // Clear error as user needs to re-validate departure
                setDuration(calculateDurationBetweenTwoDates(newDate, newDepartureDate));
            }
        }
    }
    
    // Handler for Arrival Time changes
    function handleArrivalTimeChange(date: Date | null) {
        if (date) {
            // Create a new date with the current arrival date but new time
            const newDate = new Date(arrivalDate);
            newDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
            
            // Update arrival date
            setArrivalDate(newDate);
            
            // Clear error if arrival change might fix it and departure is now valid
            if (departureDate >= newDate) {
                setDateError(null);
                setDuration(calculateDurationBetweenTwoDates(newDate, departureDate));
            } else {
                // Departure is now invalid relative to new arrival time
                // If it's the same day, adjust departure time to be at least arrival time
                if (departureDate.getDate() === newDate.getDate() && 
                    departureDate.getMonth() === newDate.getMonth() && 
                    departureDate.getFullYear() === newDate.getFullYear()) {
                    
                    const newDepartureDate = new Date(departureDate);
                    newDepartureDate.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                    setDepartureDate(newDepartureDate);
                    setDateError(null);
                    setDuration(calculateDurationBetweenTwoDates(newDate, newDepartureDate));
                } else {
                    setDateError("La date/heure de départ ne peut pas être antérieure à la date/heure d'arrivée.");
                }
            }
        }
    }

    // Handler for Departure Date changes
    function handleDepartureDateChange(date: Date | null) {
        if (date) {
            // Create a new date with the same time as the current departureDate
            const newDate = new Date(date);
            newDate.setHours(departureDate.getHours(), departureDate.getMinutes(), 0, 0);
            
            // Ensure departure is not before arrival
            if (newDate < arrivalDate) {
                // If the date is before arrival date, keep the same date but adjust time
                if (date.getDate() < arrivalDate.getDate() || 
                    date.getMonth() < arrivalDate.getMonth() || 
                    date.getFullYear() < arrivalDate.getFullYear()) {
                    
                    setDateError("La date de départ ne peut pas être antérieure à la date d'arrivée.");
                    // Do not update departureDate or duration if invalid
                    return;
                }
                
                // If it's the same day but time is before arrival, set time to arrival time
                newDate.setHours(arrivalDate.getHours(), arrivalDate.getMinutes(), 0, 0);
            }
            
            setDateError(null); // Clear error message
            setDepartureDate(newDate);
            setDuration(calculateDurationBetweenTwoDates(arrivalDate, newDate));
        }
    }
    
    // Handler for Departure Time changes
    function handleDepartureTimeChange(date: Date | null) {
        if (date) {
            // Create a new date with the current departure date but new time
            const newDate = new Date(departureDate);
            newDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
            
            // Ensure departure is not before arrival
            if (newDate < arrivalDate) {
                setDateError("L'heure de départ ne peut pas être antérieure à l'heure d'arrivée.");
                // Do not update departureDate or duration if invalid
            } else {
                setDateError(null); // Clear error message
                setDepartureDate(newDate);
                setDuration(calculateDurationBetweenTwoDates(arrivalDate, newDate));
            }
        }
    }

    useEffect(() => {
        // Initial calculation or when editing
        if (isEditMode) {
            const babysitting = babySittings.find((element) => element.id === idBabysitting);
            if (babysitting !== undefined) {
                setArrivalDate(babysitting.arrivalDate);
                setDepartureDate(babysitting.departureDate);
                setDuration(calculateDurationBetweenTwoDates(babysitting.arrivalDate, babysitting.departureDate))
            }
        } else {
             // For new entries, calculate initial duration if dates are valid
             if (departureDate >= arrivalDate) {
                 setDuration(calculateDurationBetweenTwoDates(arrivalDate, departureDate));
             } else {
                 setDuration(emptyDuration);
             }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Format hours and minutes for display
    const formatDuration = () => {
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        
        return `${hours}h ${minutes}min`;
    };

    // Format date for display
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric' 
        };
        return date.toLocaleDateString('fr-FR', options);
    };

    // Format time for display
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    };

    return(
        <Card 
            sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                mt: 3, 
                borderRadius: 3, 
                boxShadow: 3,
                overflow: 'visible'
            }}
        >
            {/* Header with title and back button */}
            <Box 
                sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <Typography variant="h5" component="h2" fontWeight="bold">
                    {isEditMode ? "Modification" : "Nouvelle"} présence
                </Typography>
                <Tooltip title="Retour">
                    <IconButton 
                        aria-label="retour"
                        onClick={handleReturn}
                        disabled={isSaving || isDeleting}
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <CardContent sx={{ p: 0 }}>
                {/* Duration Display */}
                <Box 
                    sx={{ 
                        p: 3,
                        textAlign: 'center',
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }}
                >
                    <Chip
                        icon={<DurationIcon />}
                        label="Durée de la présence"
                        color="primary"
                        sx={{ mb: 1 }}
                    />
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                        {formatDuration()}
                    </Typography>
                    {dateError && (
                        <Typography 
                            color="error" 
                            variant="body2" 
                            sx={{ 
                                mt: 1, 
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                display: 'inline-block'
                            }}
                        >
                            {dateError}
                        </Typography>
                    )}
                </Box>

                {/* Date and Time Inputs */}
                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        {/* Arrival Section */}
                        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2, 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                                    Arrivée
                                </Typography>
                                
                                <Box sx={{ mt: 2 }}>
                                    {/* Date input */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                                            Date
                                        </Typography>
                                        <DatePicker
                                            value={arrivalDate}
                                            onChange={handleArrivalDateChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    InputProps: {
                                                        startAdornment: (
                                                            <CalendarMonthIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                                                        )
                                                    }
                                                }
                                            }}
                                            format="dd/MM/yyyy"
                                        />
                                    </Box>
                                    
                                    {/* Time input */}
                                    <Box>
                                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                                            Heure
                                        </Typography>
                                        <TimePicker
                                            value={arrivalDate}
                                            onChange={handleArrivalTimeChange}
                                            ampm={false}
                                            minutesStep={5}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    InputProps: {
                                                        startAdornment: (
                                                            <AccessTimeIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                                                        )
                                                    },
                                                    error: false // Explicitly set error to false to prevent red border
                                                }
                                            }}
                                            format="HH:mm"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                        
                        {/* Departure Section */}
                        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2, 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                                    Départ
                                </Typography>
                                
                                <Box sx={{ mt: 2 }}>
                                    {/* Date input */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                                            Date
                                        </Typography>
                                        <DatePicker
                                            value={departureDate}
                                            onChange={handleDepartureDateChange}
                                            minDate={arrivalDate}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    InputProps: {
                                                        startAdornment: (
                                                            <CalendarMonthIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                                                        )
                                                    }
                                                }
                                            }}
                                            format="dd/MM/yyyy"
                                        />
                                    </Box>
                                    
                                    {/* Time input */}
                                    <Box>
                                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                                            Heure
                                        </Typography>
                                        <TimePicker
                                            value={departureDate}
                                            onChange={handleDepartureTimeChange}
                                            ampm={false}
                                            minutesStep={5}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    InputProps: {
                                                        startAdornment: (
                                                            <AccessTimeIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                                                        )
                                                    },
                                                    error: false // Explicitly set error to false to prevent red border
                                                }
                                            }}
                                            format="HH:mm"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Stack>
                    
                    {/* Timeline summary */}
                    <Box 
                        sx={{ 
                            mt: 3, 
                            p: 2, 
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 2 }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(arrivalDate)}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="primary" 
                            fontWeight="bold"
                            sx={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                            }}
                        >
                            {formatTime(arrivalDate)}
                        </Typography>
                        <ArrowRightIcon color="action" />
                        <Typography 
                            variant="body1" 
                            color="primary" 
                            fontWeight="bold"
                            sx={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                            }}
                        >
                            {formatTime(departureDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(departureDate)}
                        </Typography>
                    </Box>
                </Box>

                {/* Footer/Buttons */}
                <Box 
                    sx={{ 
                        p: 3, 
                        pt: 2,
                        borderTop: 1, 
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 9,
                        bgcolor: theme.palette.background.paper
                    }}
                >
                    {/* Delete Button */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        {isEditMode && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeleteClick}
                                disabled={isDeleting || isSaving}
                                startIcon={<DeleteIcon />}
                                fullWidth={true}
                                sx={{ 
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Supprimer
                            </Button>
                        )}
                    </Box>
                    
                    {/* Save Button */}
                    <Box sx={{ 
                        ml: { xs: 0, sm: 'auto' },
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={isSaving || isDeleting}
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            size="large"
                            fullWidth={true}
                            sx={{ 
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            {isEditMode ? "Mettre à jour" : "Enregistrer"}
                        </Button>
                    </Box>
                </Box>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => !isDeleting && setShowDeleteConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmation de suppression
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Voulez-vous vraiment supprimer cette session de babysitting du {formatDate(arrivalDate)} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setShowDeleteConfirm(false)} 
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
        </Card>
    );
}

export default Babysitting;
