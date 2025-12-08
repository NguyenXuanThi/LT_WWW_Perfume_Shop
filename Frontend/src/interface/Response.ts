import type { UserError, User, UserAdminOnly } from "./User";

export interface ApiResponse<T> {
    timestamp: string;
    status: number;
    body?: T;
    message?: string;
    errors?: UserError
}

export interface LoginRespone {
    token: string;
    user: User;
}

export interface PageUser {
    content: UserAdminOnly[];
    totalPages: number;
}