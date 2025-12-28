export type UserRole = 'admin' | 'user';

export interface IUserRole {
    role: UserRole;
    isAdmin: boolean;
    canAccess: (requiredRole: UserRole) => boolean;
}

export interface IPermissions {
    // Permissions générales
    canViewAdminPanel: boolean;
    canManageUsers: boolean;
    canViewGlobalStats: boolean;
    canEditSystemSettings: boolean;
    
    // Permissions spécifiques babysitting
    canViewOwnSessions: boolean;
    canEditOwnSessions: boolean;
    canDeleteOwnSessions: boolean;
    canViewAllUsersSessions: boolean;
    canEditAllUsersSessions: boolean;
    canDeleteAllUsersSessions: boolean;
}

export const getPermissionsForRole = (role: UserRole): IPermissions => {
    switch (role) {
        case 'admin':
            return {
                // Permissions générales
                canViewAdminPanel: true,
                canManageUsers: true,
                canViewGlobalStats: true,
                canEditSystemSettings: true,
                
                // Permissions spécifiques babysitting
                canViewOwnSessions: true,
                canEditOwnSessions: true,
                canDeleteOwnSessions: true,
                canViewAllUsersSessions: true,
                canEditAllUsersSessions: true,
                canDeleteAllUsersSessions: true,
            };
        
        case 'user':
        default:
            return {
                // Permissions générales
                canViewAdminPanel: false,
                canManageUsers: false,
                canViewGlobalStats: false,
                canEditSystemSettings: false,
                
                // Permissions spécifiques babysitting
                canViewOwnSessions: true,
                canEditOwnSessions: true,
                canDeleteOwnSessions: true,
                canViewAllUsersSessions: false,
                canEditAllUsersSessions: false,
                canDeleteAllUsersSessions: false,
            };
    }
};