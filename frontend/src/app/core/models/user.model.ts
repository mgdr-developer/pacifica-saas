export interface Role {
    id: number;
    name: string;
    description?: string;
}

export interface User {
    id: string;
    firstName: string;
    paternalLastName: string;
    maternalLastName?: string;
    phone?: string;
    email: string;
    avatarUrl?: string;
    role: Role;
    createdAt: string;
}

export interface UserCreateRequest {
    firstName: string;
    paternalLastName: string;
    maternalLastName?: string;
    phone?: string;
    email: string;
    password?: string;
    roleId: number;
    avatarUrl?: string;
}

export interface UserUpdateRequest {
    firstName: string;
    paternalLastName: string;
    maternalLastName?: string;
    phone?: string;
    roleId: number;
    avatarUrl?: string;
}
