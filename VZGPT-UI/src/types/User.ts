export type User = {
    name: string;
    username: string;
    email: string;
    roles: string[];
    groups: string[];
} | null;

export type UserContextType = {
    user: User;
};