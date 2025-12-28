import React from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { Alert, Box, Typography } from '@mui/material';
import { VpnKey as AdminIcon } from '@mui/icons-material';

interface AdminOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showFallback?: boolean;
    requireExactRole?: boolean;
}

/**
 * Composant de protection qui n'affiche le contenu que pour les administrateurs
 * 
 * @param children - Contenu à afficher si l'utilisateur est admin
 * @param fallback - Contenu alternatif à afficher si l'utilisateur n'est pas admin
 * @param showFallback - Si true, affiche le fallback même si non admin (défaut: true)
 * @param requireExactRole - Si true, vérifie exactement le rôle admin (défaut: utilise isAdmin)
 */
export function AdminOnly({ 
    children, 
    fallback, 
    showFallback = true, 
    requireExactRole = false 
}: AdminOnlyProps) {
    const { role, isAdmin, isAuthenticated } = useUserRole();
    
    // Vérification d'authentification en premier
    if (!isAuthenticated) {
        return showFallback ? (
            <Alert severity="info" icon={<AdminIcon />}>
                <Typography variant="body2">
                    Vous devez être connecté pour accéder à cette section.
                </Typography>
            </Alert>
        ) : null;
    }
    
    // Vérification des permissions admin
    const hasAdminAccess = requireExactRole 
        ? role === 'admin' 
        : isAdmin;
    
    if (!hasAdminAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }
        
        return showFallback ? (
            <Alert severity="warning" icon={<AdminIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    🛡️ Accès réservé aux administrateurs
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Cette section n'est accessible qu'aux utilisateurs avec des privilèges d'administration.
                </Typography>
            </Alert>
        ) : null;
    }
    
    return <>{children}</>;
}

/**
 * Version simplifiée pour les cas d'usage courants
 */
export function AdminSection({ children }: { children: React.ReactNode }) {
    return (
        <AdminOnly showFallback={false}>
            <Box 
                sx={{ 
                    p: 2, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    '& *': {
                        color: 'white !important'
                    }
                }}
            >
                <Typography 
                    variant="overline" 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 1,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    <AdminIcon fontSize="small" />
                    Section Admin
                </Typography>
                {children}
            </Box>
        </AdminOnly>
    );
}

/**
 * Wrapper pour les boutons admin
 */
export function AdminButton({ children }: { children: React.ReactNode }) {
    return (
        <AdminOnly showFallback={false}>
            {children}
        </AdminOnly>
    );
}