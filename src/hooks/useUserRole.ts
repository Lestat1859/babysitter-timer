import { useRecoilValue } from 'recoil';
import { userRoleSelector } from '../recoil/recoil_states';
import { UserRole, getPermissionsForRole, IPermissions } from '../interfaces/IUserRole';
import { hasPermission } from '../utils/auth';

/**
 * Hook personnalisé pour la gestion des rôles et permissions utilisateur
 * 
 * @returns Objet contenant les informations de rôle et les fonctions utilitaires
 */
export function useUserRole() {
    const userRole = useRecoilValue(userRoleSelector);
    
    // Calcul des permissions basées sur le rôle
    const permissions: IPermissions = getPermissionsForRole(userRole.role);
    
    return {
        // Informations de base sur l'utilisateur
        role: userRole.role,
        isAdmin: userRole.isAdmin,
        isAuthenticated: userRole.isAuthenticated,
        
        // Permissions détaillées
        permissions,
        
        // Fonctions utilitaires
        canAccess: (requiredRole: UserRole): boolean => {
            return hasPermission(userRole.role, requiredRole);
        },
        
        canPerform: (action: keyof IPermissions): boolean => {
            return permissions[action];
        },
        
        // Helpers spécifiques pour des vérifications courantes
        canViewAdminPanel: (): boolean => permissions.canViewAdminPanel,
        canManageUsers: (): boolean => permissions.canManageUsers,
        canViewGlobalStats: (): boolean => permissions.canViewGlobalStats,
        canEditSystemSettings: (): boolean => permissions.canEditSystemSettings,
        
        // Helpers pour les sessions de babysitting
        canViewOwnSessions: (): boolean => permissions.canViewOwnSessions,
        canEditOwnSessions: (): boolean => permissions.canEditOwnSessions,
        canDeleteOwnSessions: (): boolean => permissions.canDeleteOwnSessions,
        canViewAllUsersSessions: (): boolean => permissions.canViewAllUsersSessions,
        canEditAllUsersSessions: (): boolean => permissions.canEditAllUsersSessions,
        canDeleteAllUsersSessions: (): boolean => permissions.canDeleteAllUsersSessions,
        
        // Debug helper
        getRoleInfo: () => ({
            role: userRole.role,
            isAdmin: userRole.isAdmin,
            isAuthenticated: userRole.isAuthenticated,
            permissions
        })
    };
}