import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Snackbar,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    AppBar,
    Toolbar,
    Container,
    Paper,
    InputAdornment
} from '@mui/material';
import { PriceManagement } from './PriceManagement';
import {
    People as UsersIcon,
    Settings as SettingsIcon,
    BarChart as StatsIcon,
    Security as SecurityIcon,
    PersonAdd as AddUserIcon,
    Edit as EditIcon,
    AdminPanelSettings as AdminIcon,
    Delete as DeleteIcon,
    ToggleOff as DisableIcon,
    ToggleOn as EnableIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useUserRole } from '../../hooks/useUserRole';
import { AdminOnly } from '../Auth/AdminOnly';
import FloatingActionButton from '../common/FloatingActionButton';
import { StandardModal, ModalSection } from '../common/StandardModal';
import { IAuthorizedUser } from '../../interfaces/IAuthorizedUser';
import { 
    getAllAuthorizedUsers, 
    updateAuthorizedUser, 
    deleteAuthorizedUser,
    toggleUserActiveStatus,
    createAuthorizedUser
} from '../../services/AuthorizedUsersService';
import { firebaseAuth } from '../../utils/firebase';

export function AdminPanel() {
    const navigate = useNavigate();
    const { permissions, getRoleInfo } = useUserRole();
    const [selectedTab, setSelectedTab] = useState<'users' | 'stats' | 'settings'>('stats');
    const [users, setUsers] = useState<IAuthorizedUser[]>([]);
    const [editUserDialog, setEditUserDialog] = useState<{ open: boolean; user: IAuthorizedUser | null; localRole: 'admin' | 'user'; localActive: boolean }>({
        open: false,
        user: null,
        localRole: 'user',
        localActive: true
    });
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserUid, setNewUserUid] = useState('');
    const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loadError, setLoadError] = useState<string | null>(null);

    // Charger les utilisateurs depuis Firestore
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoadError(null);
        try {
            const loadedUsers = await getAllAuthorizedUsers();
            setUsers(loadedUsers);
            
            if (loadedUsers.length === 0) {
                setLoadError('no-users');
            }
        } catch (error: any) {
            if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
                setLoadError('permission-denied');
                showSnackbar('Erreur de permissions Firestore', 'error');
            } else {
                setLoadError('unknown');
                showSnackbar('Erreur lors du chargement des utilisateurs', 'error');
            }
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEditUser = (user: IAuthorizedUser) => {
        setEditUserDialog({
            open: true,
            user,
            localRole: user.role,
            localActive: user.isActive
        });
    };

    const handleCloseEditDialog = () => {
        setEditUserDialog({
            open: false,
            user: null,
            localRole: 'user',
            localActive: true
        });
    };

    const handleCloseAddDialog = () => {
        setAddUserDialog(false);
        setNewUserEmail('');
        setNewUserUid('');
        setNewUserRole('user');
    };

    const handleSaveUserChanges = async () => {
        if (!editUserDialog.user) return;
        
        setIsLoading(true);
        try {
            const updates: Partial<IAuthorizedUser> = {};
            let hasChanges = false;
            
            if (editUserDialog.localRole !== editUserDialog.user.role) {
                updates.role = editUserDialog.localRole;
                hasChanges = true;
            }
            
            if (editUserDialog.localActive !== editUserDialog.user.isActive) {
                updates.isActive = editUserDialog.localActive;
                hasChanges = true;
            }
            
            if (!hasChanges) {
                handleCloseEditDialog();
                return;
            }
            
            await updateAuthorizedUser(editUserDialog.user.uid, updates);
            await loadUsers();
            showSnackbar(`Utilisateur modifié avec succès`, 'success');
            handleCloseEditDialog();
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            showSnackbar('Erreur lors de la modification', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteAuthorizedUser(userId);
            await loadUsers();
            showSnackbar('Utilisateur supprimé avec succès', 'success');
            handleCloseEditDialog();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showSnackbar('Erreur lors de la suppression', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!newUserEmail || !newUserUid) {
            showSnackbar('Email et UID sont requis', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const currentUser = firebaseAuth.currentUser;
            await createAuthorizedUser({
                uid: newUserUid,
                email: newUserEmail,
                role: newUserRole,
                isActive: true,
                createdBy: currentUser?.uid
            });
            await loadUsers();
            showSnackbar('Utilisateur ajouté avec succès', 'success');
            handleCloseAddDialog();
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            showSnackbar('Erreur lors de l\'ajout de l\'utilisateur', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderUsersTab = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Gestion des utilisateurs ({users.length})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddUserIcon />}
                    color="primary"
                    onClick={() => setAddUserDialog(true)}
                    disabled={loadError === 'permission-denied'}
                >
                    Ajouter un utilisateur
                </Button>
            </Box>

            {/* Alerte d'erreur de permissions */}
            {loadError === 'permission-denied' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        ❌ Erreur de Permissions Firestore
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Impossible de charger les utilisateurs. Cela est probablement dû à l'une des raisons suivantes :
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>1. Les règles Firestore ne sont pas déployées</strong>
                        <Box component="pre" sx={{ bgcolor: 'rgba(0,0,0,0.1)', p: 1, mt: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                            firebase deploy --only firestore:rules
                        </Box>
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ mt: 2 }}>
                        <strong>2. Votre compte n'est pas encore migré dans Firestore</strong>
                        <Box component="pre" sx={{ bgcolor: 'rgba(0,0,0,0.1)', p: 1, mt: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                            {`// Dans la console (F12), exécutez :\nwindow.firebaseMigration.migrateCurrentUser("admin")`}
                        </Box>
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={loadUsers}
                        sx={{ mt: 2 }}
                    >
                        Réessayer
                    </Button>
                </Alert>
            )}

            {/* Alerte si aucun utilisateur */}
            {loadError === 'no-users' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        ⚠️ Aucun Utilisateur Trouvé
                    </Typography>
                    <Typography variant="body2">
                        La collection Firestore est vide. Commencez par migrer votre compte :
                    </Typography>
                    <Box component="pre" sx={{ bgcolor: 'rgba(0,0,0,0.1)', p: 1, mt: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                        {`// Dans la console (F12), exécutez :\nwindow.firebaseMigration.migrateCurrentUser("admin")`}
                    </Box>
                </Alert>
            )}

            {users.length === 0 && !loadError ? (
                <Alert severity="info">
                    Aucun utilisateur trouvé. Utilisez le bouton ci-dessus pour ajouter des utilisateurs.
                </Alert>
            ) : loadError === 'permission-denied' ? null : (
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { width: { xs: '100%', md: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' } }
                }}>
                    {users.map((user) => (
                        <Card key={user.uid} sx={{ opacity: user.isActive ? 1 : 0.6 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: user.role === 'admin' ? 'primary.main' : 'grey.500', mr: 2 }}>
                                        {user.email.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" noWrap>
                                            {user.email}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip 
                                                label={user.role === 'admin' ? 'Admin' : 'User'} 
                                                size="small"
                                                color={user.role === 'admin' ? 'primary' : 'default'}
                                                icon={user.role === 'admin' ? <AdminIcon /> : <UsersIcon />}
                                            />
                                            <Chip 
                                                label={user.isActive ? 'Actif' : 'Inactif'} 
                                                size="small"
                                                color={user.isActive ? 'success' : 'error'}
                                            />
                                        </Box>
                                    </Box>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                                
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Créé le: {formatDate(user.createdAt)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Mis à jour: {formatDate(user.updatedAt)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );

    const renderStatsTab = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                📊 Statistiques globales
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                '& > *': { width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }
            }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <UsersIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="primary">
                            {users.filter(u => u.isActive).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Utilisateurs actifs
                        </Typography>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <AdminIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="secondary">
                            {users.filter(u => u.role === 'admin' && u.isActive).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Administrateurs
                        </Typography>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <DisableIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="warning">
                            {users.filter(u => !u.isActive).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Utilisateurs désactivés
                        </Typography>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <SecurityIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="info">
                            {users.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total utilisateurs
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );

    const renderSettingsTab = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                ⚙️ Configuration système
            </Typography>
            
            <PriceManagement />
        </Box>
    );

    return (
        <AdminOnly>
            <Box sx={{
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}>
                {/* AppBar avec le même style que la page principale */}
                <AppBar
                    position="sticky"
                    sx={{
                        background: 'linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%)',
                        boxShadow: 3,
                        borderBottom: 'none',
                        width: '100%',
                        margin: 0,
                        padding: 0
                    }}
                >
                <Toolbar sx={{ padding: { xs: 0, sm: '0 16px' } }}>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            sx={{
                                mr: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                width: 40,
                                height: 40
                            }}
                        >
                            <AdminIcon />
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h6"
                                component="h1"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                Panneau d'administration
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Interface de gestion et configuration
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    {/* Navigation tabs dans le header */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {[
                            { id: 'users' as const, label: 'Utilisateurs', icon: <UsersIcon /> },
                            { id: 'stats' as const, label: 'Statistiques', icon: <StatsIcon /> },
                            { id: 'settings' as const, label: 'Paramètres', icon: <SettingsIcon /> }
                        ].map(tab => (
                            <Button
                                key={tab.id}
                                variant={selectedTab === tab.id ? 'contained' : 'text'}
                                startIcon={tab.icon}
                                onClick={() => setSelectedTab(tab.id)}
                                sx={{
                                    color: 'white',
                                    ...(selectedTab === tab.id && {
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.3)'
                                        }
                                    })
                                }}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
                </AppBar>

                {/* Navigation tabs pour mobile */}
                <Box sx={{
                    display: { xs: 'flex', md: 'none' },
                    gap: 1,
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}>
                    {[
                        { id: 'users' as const, label: 'Utilisateurs', icon: <UsersIcon /> },
                        { id: 'stats' as const, label: 'Stats', icon: <StatsIcon /> },
                        { id: 'settings' as const, label: 'Paramètres', icon: <SettingsIcon /> }
                    ].map(tab => (
                        <Button
                            key={tab.id}
                            variant={selectedTab === tab.id ? 'contained' : 'outlined'}
                            startIcon={tab.icon}
                            onClick={() => setSelectedTab(tab.id)}
                            sx={{ flex: 1 }}
                            size="small"
                        >
                            {tab.label}
                        </Button>
                    ))}
                </Box>

                <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
                    {/* Contenu des tabs */}
                    {selectedTab === 'users' && renderUsersTab()}
                    {selectedTab === 'stats' && renderStatsTab()}
                    {selectedTab === 'settings' && renderSettingsTab()}

                {/* Dialog pour éditer un utilisateur */}
                <StandardModal
                    open={editUserDialog.open}
                    onClose={handleCloseEditDialog}
                    title="Modifier l'utilisateur"
                    summary={
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    margin: '0 auto',
                                    mb: 2,
                                    bgcolor: editUserDialog.localRole === 'admin' ? 'primary.main' : 'grey.500'
                                }}
                            >
                                {editUserDialog.user?.email.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" fontWeight={700} sx={{ wordBreak: 'break-all' }}>
                                {editUserDialog.user?.email}
                            </Typography>
                        </Box>
                    }
                    recap={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Statut</Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={editUserDialog.localActive ? 'Actif' : 'Inactif'}
                                        color={editUserDialog.localActive ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary">Rôle</Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={editUserDialog.localRole === 'admin' ? 'Admin' : 'User'}
                                        color={editUserDialog.localRole === 'admin' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    }
                    primaryAction={{
                        label: "Enregistrer les modifications",
                        onClick: handleSaveUserChanges,
                        loading: isLoading
                    }}
                >
                    <ModalSection title="Accès">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body1" fontWeight={500}>Compte actif</Typography>
                                <Typography variant="caption" color="text.secondary">Autoriser l'accès à l'application</Typography>
                            </Box>
                            <Switch
                                checked={editUserDialog.localActive}
                                onChange={(e) => setEditUserDialog({ ...editUserDialog, localActive: e.target.checked })}
                            />
                        </Box>
                    </ModalSection>

                    <ModalSection title="Rôle">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant={editUserDialog.localRole === 'user' ? 'contained' : 'outlined'}
                                onClick={() => setEditUserDialog({ ...editUserDialog, localRole: 'user' })}
                                fullWidth
                                color={editUserDialog.localRole === 'user' ? 'primary' : 'inherit'}
                            >
                                Utilisisateur
                            </Button>
                            <Button
                                variant={editUserDialog.localRole === 'admin' ? 'contained' : 'outlined'}
                                onClick={() => setEditUserDialog({ ...editUserDialog, localRole: 'admin' })}
                                fullWidth
                                color={editUserDialog.localRole === 'admin' ? 'primary' : 'inherit'}
                            >
                                Admin
                            </Button>
                        </Box>
                    </ModalSection>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => editUserDialog.user && handleDeleteUser(editUserDialog.user.uid)}
                            disabled={isLoading}
                        >
                            Supprimer cet utilisateur
                        </Button>
                    </Box>
                </StandardModal>

                {/* Dialog pour ajouter un utilisateur */}
                <StandardModal
                    open={addUserDialog}
                    onClose={handleCloseAddDialog}
                    title="Nouvel utilisateur"
                    summary={
                        <Box sx={{ textAlign: 'center' }}>
                            <Chip
                                icon={<AddUserIcon sx={{ fontSize: '1rem !important' }} />}
                                label="Création de compte"
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ mb: 1, border: 'none', bgcolor: 'primary.lighter', fontWeight: 600 }}
                            />
                            <Typography variant="h4" color="text.primary" fontWeight={700}>
                                {newUserEmail || 'Nouvel accès'}
                            </Typography>
                        </Box>
                    }
                    primaryAction={{
                        label: "Ajouter l'utilisateur",
                        onClick: handleAddUser,
                        disabled: isLoading || !newUserEmail || !newUserUid,
                        loading: isLoading,
                        icon: <AddUserIcon />
                    }}
                >
                    <ModalSection title="Identité">
                        <TextField
                            fullWidth
                            label="UID Firebase"
                            value={newUserUid}
                            onChange={(e) => setNewUserUid(e.target.value)}
                            helperText="L'UID Firebase de l'utilisateur (récupérable depuis Firebase Console)"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SecurityIcon color="action" /></InputAdornment>
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><UsersIcon color="action" /></InputAdornment>
                            }}
                        />
                    </ModalSection>

                    <ModalSection title="Permissions">
                        <FormControl fullWidth>
                            <InputLabel>Rôle</InputLabel>
                            <Select
                                value={newUserRole}
                                label="Rôle"
                                onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                                startAdornment={<InputAdornment position="start"><AdminIcon color="action" /></InputAdornment>}
                            >
                                <MenuItem value="user">Utilisateur</MenuItem>
                                <MenuItem value="admin">Administrateur</MenuItem>
                            </Select>
                        </FormControl>
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            Assurez-vous que l'utilisateur existe dans Firebase Authentication.
                        </Alert>
                    </ModalSection>
                </StandardModal>

                {/* Snackbar pour les notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* FAB pour ajouter un utilisateur (visible uniquement dans l'onglet utilisateurs) */}
                {selectedTab === 'users' && (
                    <FloatingActionButton
                        tooltip="Ajouter un utilisateur"
                        onClick={() => setAddUserDialog(true)}
                        showOnDesktop={true}
                    />
                )}
                </Container>
            </Box>
        </AdminOnly>
    );
}
