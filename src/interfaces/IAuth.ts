export interface IAuth{
    email: string,
    id: string,
    uid: string,
    role: 'admin' | 'user',
    isAdmin: boolean
}

export const defaultAuth: IAuth = {
    email: "null",
    id: "null",
    uid: "null",
    role: "user",
    isAdmin: false
}
