import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Switch
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Euro as EuroIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    ArrowForward as ArrowForwardIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { useRecoilState } from 'recoil';
import { priceTimeIntervalState } from '../../recoil/recoil_states';
import { IPriceTimeInterval } from '../../interfaces/IPriceTimeInterval';
import { IAuthorizedUser } from '../../interfaces/IAuthorizedUser';
import { getAllAuthorizedUsers } from '../../services/AuthorizedUsersService';
import { firebaseDatabase } from '../../utils/firebase';
import { ref, set, push, remove, get, onValue, child, update } from 'firebase/database';
import FloatingActionButton from '../common/FloatingActionButton';
import { StandardModal, ModalSection } from '../common/StandardModal';

export function PriceManagement() {
    const [priceIntervals, setPriceIntervals] = useRecoilState(priceTimeIntervalState);
    const [users, setUsers] = useState<IAuthorizedUser[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState<string>('');
    const [newStartDate, setNewStartDate] = useState<string>('');
    const [newEndDate, setNewEndDate] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>(''); // Empty string = Default/Global
    const [isPermanent, setIsPermanent] = useState<boolean>(false);
    
    // Filters
    const [filterUserId, setFilterUserId] = useState<string>('all');
    const [filterActiveOnly, setFilterActiveOnly] = useState<boolean>(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        loadUsers();
        
        // Charger les prix depuis Firebase en temps réel
        const dbRef = ref(firebaseDatabase);
        const path = "PriceTimeInterval/";
        const unsubscribe = onValue(child(dbRef, path), (snapshot) => {
            if (snapshot.exists()) {
                const fetched: IPriceTimeInterval[] = [];
                snapshot.forEach((childSnapshot) => {
                    const val = childSnapshot.val();
                    const interval: IPriceTimeInterval = {
                        id: childSnapshot.key || undefined,
                        begin: new Date(val.begin),
                        price: val.price,
                        userId: val.userId
                    };
                    if (val.end) {
                        interval.end = new Date(val.end);
                    }
                    fetched.push(interval);
                });
                setPriceIntervals(fetched);
            } else {
                setPriceIntervals([]);
            }
        });

        return () => unsubscribe();
    }, [setPriceIntervals]);

    // Reset end date when switching to permanent
    useEffect(() => {
        if (isPermanent) {
            setNewEndDate('');
        }
    }, [isPermanent]);

    const loadUsers = async () => {
        try {
            const loadedUsers = await getAllAuthorizedUsers();
            setUsers(loadedUsers);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        }
    };

    const handleSavePrice = async () => {
        const priceValue = parseFloat(newPrice);
        
        // Validation logic
        if (!newStartDate || isNaN(priceValue) || priceValue <= 0) return;
        if (!isPermanent && !newEndDate) return;
        if (!isPermanent && newEndDate && newEndDate < newStartDate) return;

        setIsLoading(true);
        try {
            const priceData: any = {
                begin: new Date(newStartDate).toISOString(),
                price: priceValue
            };

            if (!isPermanent && newEndDate) {
                priceData.end = new Date(newEndDate).toISOString();
            } else {
                if (editingId) {
                    priceData.end = null; 
                }
            }

            if (selectedUserId) {
                priceData.userId = selectedUserId;
            } else {
                if (editingId) {
                    priceData.userId = null;
                }
            }

            if (editingId) {
                // Update existing
                await update(ref(firebaseDatabase, `PriceTimeInterval/${editingId}`), priceData);
            } else {
                // Create new
                const pricesRef = ref(firebaseDatabase, 'PriceTimeInterval');
                const newPriceRef = push(pricesRef);
                await set(newPriceRef, priceData);
            }

            setOpenAddDialog(false);
            resetForm();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du prix", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditPrice = (interval: IPriceTimeInterval) => {
        if (!interval.id) return;
        
        setEditingId(interval.id);
        setNewPrice(interval.price.toString());
        
        // Format dates for input type="date" (YYYY-MM-DD)
        const startDateStr = interval.begin.toISOString().split('T')[0];
        setNewStartDate(startDateStr);
        
        if (interval.end) {
            const endDateStr = interval.end.toISOString().split('T')[0];
            setNewEndDate(endDateStr);
            setIsPermanent(false);
        } else {
            setNewEndDate('');
            setIsPermanent(true);
        }
        
        setSelectedUserId(interval.userId || '');
        setOpenAddDialog(true);
    };

    const handleDeletePrice = async (interval: IPriceTimeInterval) => {
        if (!interval.id) {
            console.error("Impossible de supprimer : ID manquant");
            return;
        }
        
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce tarif ?")) return;

        setIsLoading(true);
        try {
            await remove(ref(firebaseDatabase, `PriceTimeInterval/${interval.id}`));
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setNewPrice('');
        setNewStartDate('');
        setNewEndDate('');
        setSelectedUserId('');
        setIsPermanent(false);
    };

    const formatDate = (date?: Date) => {
        if (!date) return "En cours";
        return date.toLocaleDateString('fr-FR');
    };

    const getUserEmail = (uid?: string) => {
        if (!uid) return "Défaut (Tous)";
        const user = users.find(u => u.uid === uid);
        return user ? user.email : "Utilisateur inconnu";
    };

    // Validation for button state
    const isFormValid = () => {
        const priceValue = parseFloat(newPrice);
        const isPriceValid = !isNaN(priceValue) && priceValue > 0;
        const isDateValid = newStartDate && (isPermanent || (newEndDate && newEndDate >= newStartDate));
        
        return isPriceValid && isDateValid && !isLoading;
    };

    // Filter and Sort intervals
    const filteredAndSortedIntervals = priceIntervals
        .filter(interval => {
            // Filter by User
            if (filterUserId === 'default') {
                if (interval.userId) return false;
            } else if (filterUserId !== 'all') {
                if (interval.userId !== filterUserId) return false;
            }

            // Filter by Status (Active only)
            if (filterActiveOnly) {
                // Hide if end date exists AND is in the past
                // We consider "En cours" as: No end date OR End date >= Today
                if (interval.end) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (interval.end < today) return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            const emailA = getUserEmail(a.userId);
            const emailB = getUserEmail(b.userId);
            
            // Sort by Email first
            if (emailA !== emailB) {
                if (emailA === "Défaut (Tous)") return -1;
                if (emailB === "Défaut (Tous)") return 1;
                return emailA.localeCompare(emailB);
            }
            
            // Then by Start Date (Newest first)
            return b.begin.getTime() - a.begin.getTime();
        });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Gestion des Tarifs
                </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
                <TextField
                    select
                    label="Filtrer par utilisateur"
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    size="small"
                    sx={{ minWidth: 200, bgcolor: 'background.paper' }}
                >
                    <MenuItem value="all">Tous les utilisateurs</MenuItem>
                    <MenuItem value="default">Tarif par défaut</MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user.uid} value={user.uid}>
                            {user.email}
                        </MenuItem>
                    ))}
                </TextField>

                <FormControlLabel
                    control={
                        <Switch
                            checked={filterActiveOnly}
                            onChange={(e) => setFilterActiveOnly(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Afficher uniquement les tarifs en cours"
                />
            </Box>

            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredAndSortedIntervals.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                            Aucun tarif trouvé
                        </Typography>
                    ) : (
                        filteredAndSortedIntervals.map((interval, index) => (
                            <Card
                                key={index}
                                sx={{
                                    bgcolor: 'action.hover',
                                    borderRadius: '12px',
                                    p: 2,
                                    position: 'relative'
                                }}
                            >
                                {/* Header: Identité + Badge */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon
                                            fontSize="small"
                                            color={interval.userId ? "secondary" : "action"}
                                        />
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                                            {getUserEmail(interval.userId)}
                                        </Typography>
                                    </Box>
                                    
                                    {!interval.end && (
                                        <Chip
                                            label="En cours"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(74, 222, 128, 0.1)',
                                                color: 'success.main',
                                                border: '1px solid',
                                                borderColor: 'success.main',
                                                borderRadius: '12px',
                                                height: 24,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    )}
                                </Box>

                                {/* Corps: Prix + Dates */}
                                <Box sx={{ mb: 1 }}>
                                    <Typography sx={{ color: '#3b82f6', fontWeight: 800, fontSize: '18px', mb: 1 }}>
                                        {interval.price} € / heure
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8', fontSize: '13px' }}>
                                        <Typography sx={{ fontSize: 'inherit', color: 'inherit' }}>
                                            Du {formatDate(interval.begin)}
                                        </Typography>
                                        <ArrowForwardIcon sx={{ fontSize: 14, color: 'inherit' }} />
                                        <Typography sx={{ fontSize: 'inherit', color: 'inherit' }}>
                                            {interval.end ? formatDate(interval.end) : '--'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Actions */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <IconButton
                                        onClick={() => handleEditPrice(interval)}
                                        color="primary"
                                        size="small"
                                        sx={{ bgcolor: 'background.paper', mr: 1, boxShadow: 1 }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeletePrice(interval)}
                                        color="error"
                                        size="small"
                                        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))
                    )}
                </Box>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table sx={{ minWidth: 650 }} aria-label="table des tarifs">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell><strong>Utilisateur</strong></TableCell>
                                <TableCell><strong>Prix / Heure</strong></TableCell>
                                <TableCell><strong>Date de début</strong></TableCell>
                                <TableCell><strong>Date de fin</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAndSortedIntervals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        <Typography color="text.secondary">
                                            Aucun tarif trouvé
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAndSortedIntervals.map((interval, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon
                                                    fontSize="small"
                                                    color={interval.userId ? "secondary" : "action"}
                                                />
                                                <Typography variant="body2" fontWeight={interval.userId ? 500 : 400}>
                                                    {getUserEmail(interval.userId)}
                                                </Typography>
                                                {!interval.userId && (
                                                    <Chip label="Défaut" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="primary" fontWeight="bold">
                                                {interval.price} €
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatDate(interval.begin)}</TableCell>
                                        <TableCell>
                                            {interval.end ? (
                                                formatDate(interval.end)
                                            ) : (
                                                <Chip label="En cours" color="success" size="small" variant="outlined" />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    onClick={() => handleEditPrice(interval)}
                                                    color="primary"
                                                    size="small"
                                                    title="Modifier ce tarif"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeletePrice(interval)}
                                                    color="error"
                                                    size="small"
                                                    title="Supprimer ce tarif"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <FloatingActionButton 
                onClick={() => {
                    resetForm();
                    setOpenAddDialog(true);
                }}
                tooltip="Ajouter un tarif"
                showOnDesktop={true}
            />

            <StandardModal
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                title={editingId ? "Modifier le tarif" : "Nouveau tarif"}
                summary={
                    <Box sx={{ textAlign: 'center' }}>
                        <Chip
                            icon={<EuroIcon sx={{ fontSize: '1rem !important' }} />}
                            label="Tarif horaire"
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1, border: 'none', bgcolor: 'primary.lighter', fontWeight: 600 }}
                        />
                        <Typography variant="h2" color="primary.main" fontWeight={800}>
                            {newPrice ? `${parseFloat(newPrice).toLocaleString('fr-FR')} €` : '0 €'}
                        </Typography>
                    </Box>
                }
                primaryAction={{
                    label: editingId ? "Enregistrer les modifications" : "Créer le tarif",
                    onClick: handleSavePrice,
                    disabled: !isFormValid(),
                    loading: isLoading
                }}
            >
                <ModalSection title="Montant">
                    <TextField
                        label="Prix par heure"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EuroIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </ModalSection>

                <ModalSection title="Période">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Date de début"
                            type="date"
                            value={newStartDate}
                            onChange={(e) => setNewStartDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Box>
                            <TextField
                                label="Date de fin"
                                type="date"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                                fullWidth
                                disabled={isPermanent}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    inputProps: { min: newStartDate }
                                }}
                            />
                            <FormControlLabel
                                sx={{ mt: 1, ml: 0 }}
                                control={
                                    <Checkbox
                                        checked={isPermanent}
                                        onChange={(e) => setIsPermanent(e.target.checked)}
                                        color="primary"
                                        size="small"
                                        sx={{ p: 0.5, mr: 0.5 }}
                                    />
                                }
                                label={<Typography variant="body2" color="text.secondary">Ce tarif est permanent (en cours)</Typography>}
                            />
                        </Box>
                    </Box>
                </ModalSection>

                <ModalSection title="Attribution">
                    <TextField
                        select
                        label="Utilisateur concerné"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        helperText="Si un tarif spécifique existe pour un utilisateur, il sera prioritaire sur le tarif par défaut."
                    >
                        <MenuItem value="">
                            <em>Tous les utilisateurs (Défaut)</em>
                        </MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.uid} value={user.uid}>
                                {user.email}
                            </MenuItem>
                        ))}
                    </TextField>
                </ModalSection>
            </StandardModal>
        </Box>
    );
}
