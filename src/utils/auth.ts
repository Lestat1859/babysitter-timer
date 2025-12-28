import { UserRole } from '../interfaces/IUserRole';
import { isUserAuthorized, isUserAuthorizedByEmail } from '../services/AuthorizedUsersService';

/**
 * @deprecated Utiliser isUserAuthorizedAsync à la place
 * Cette fonction est conservée temporairement pour la compatibilité
 */
export function isUserInAuthWhiteList(user: string): boolean {
    const whiteList = process.env.REACT_APP_ACCESS_WHITELIST || "";
    return !!whiteList.split(";").find((element) => element === user);
}

/**
 * Vérifie si un utilisateur est autorisé via Firestore (par UID)
 */
export async function isUserAuthorizedAsync(uid: string): Promise<boolean> {
    return await isUserAuthorized(uid);
}

/**
 * Vérifie si un utilisateur est autorisé via Firestore (par email)
 */
export async function isUserAuthorizedByEmailAsync(email: string): Promise<boolean> {
    return await isUserAuthorizedByEmail(email);
}

export function getUserRole(customClaims: any): UserRole {
    return customClaims?.role || 'user';
}

export function isUserAdmin(customClaims: any): boolean {
    return customClaims?.isAdmin === true || customClaims?.role === 'admin';
}

export function parseCustomClaims(idTokenResult: any) {
    const claims = idTokenResult?.claims || {};
    
    return {
        role: getUserRole(claims),
        isAdmin: isUserAdmin(claims),
        rawClaims: claims
    };
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    if (requiredRole === 'admin') {
        return userRole === 'admin';
    }
    // Pour 'user', tous les utilisateurs authentifiés ont accès
    return true;
}
