export interface IAuthUser {
    uid: string;
    email: string | null;
    role?: 'admin' | 'user';
    customClaims?: {
        role?: string;
        isAdmin?: boolean;
        [key: string]: any;
    };
}
