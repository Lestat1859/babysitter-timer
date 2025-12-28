import { UserRole, IPermissions, getPermissionsForRole } from '../interfaces/IUserRole';

/**
 * Utilitaires pour la gestion des rôles et permissions
 */

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function userHasPermission(userRole: UserRole, permission: keyof IPermissions): boolean {
    const permissions = getPermissionsForRole(userRole);
    return permissions[permission];
}

/**
 * Vérifie si un utilisateur peut accéder à une ressource basée sur le rôle requis
 */
export function canAccessResource(userRole: UserRole, requiredRole: UserRole): boolean {
    if (requiredRole === 'admin') {
        return userRole === 'admin';
    }
    // Pour 'user', tous les utilisateurs authentifiés ont accès
    return true;
}

/**
 * Retourne une liste des actions permises pour un rôle donné
 */
export function getPermittedActions(userRole: UserRole): (keyof IPermissions)[] {
    const permissions = getPermissionsForRole(userRole);
    return Object.keys(permissions).filter(key => 
        permissions[key as keyof IPermissions]
    ) as (keyof IPermissions)[];
}

/**
 * Vérifie si un utilisateur peut gérer les sessions d'autres utilisateurs
 */
export function canManageOtherUsersSessions(userRole: UserRole): boolean {
    return userHasPermission(userRole, 'canViewAllUsersSessions') || 
           userHasPermission(userRole, 'canEditAllUsersSessions') || 
           userHasPermission(userRole, 'canDeleteAllUsersSessions');
}

/**
 * Détermine le niveau d'accès pour l'interface utilisateur
 */
export function getUIAccessLevel(userRole: UserRole): 'admin' | 'user' | 'limited' {
    if (userRole === 'admin') return 'admin';
    if (userRole === 'user') return 'user';
    return 'limited';
}

/**
 * Valide si une action est permise avant exécution
 */
export function validateAction(userRole: UserRole, action: keyof IPermissions): boolean {
    const permissions = getPermissionsForRole(userRole);
    const isPermitted = permissions[action];
    
    if (!isPermitted) {
        console.warn(`Action non autorisée: ${action} pour le rôle: ${userRole}`);
        return false;
    }
    
    return true;
}

/**
 * Filtre une liste d'éléments basé sur les permissions utilisateur
 */
export function filterByPermissions<T>(
    items: T[], 
    userRole: UserRole, 
    filterFunction: (item: T, permissions: IPermissions) => boolean
): T[] {
    const permissions = getPermissionsForRole(userRole);
    return items.filter(item => filterFunction(item, permissions));
}

/**
 * Retourne les labels d'interface appropriés selon le rôle
 */
export function getRoleSpecificLabels(userRole: UserRole) {
    const isAdmin = userRole === 'admin';
    
    return {
        dashboardTitle: isAdmin ? 'Panneau d\'administration' : 'Mes sessions',
        sessionsTitle: isAdmin ? 'Toutes les sessions' : 'Mes sessions de babysitting',
        statsTitle: isAdmin ? 'Statistiques globales' : 'Mes statistiques',
        settingsTitle: isAdmin ? 'Configuration système' : 'Mes préférences'
    };
}