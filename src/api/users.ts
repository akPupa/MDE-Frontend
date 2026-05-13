import { api } from "./client";
import type { User } from "@stores/authStore";

/* ================= TYPES ================= */

export type UserRole = "SUPER_ADMIN" | "DEV" | "PROVIDER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface CreateUserPayload {
    fullName: string;
    email: string;
    role: UserRole;
}

export interface UpdateUserPayload {
    fullName?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean; // ✅ ADD THIS
}

export interface GetUsersParams {
    page?: number;
    pageSize?: number;
    role?: UserRole;
    search?: string;
    isActive?: boolean;
}

export interface GetUsersResponse {
    rows: User[];
    total: number;
    stats: {
        totalUsers: string,
        activeUsers: string,
        inactiveUsers: string,
    }
}

/* ================= API ================= */

// ✅ Create user (no change needed)
export const createUser = async (
    data: CreateUserPayload
): Promise<User> => {
    try {
        const res = await api.post("/users/createuser", data);
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to create user"
        );
    }
};

// ✅ Update user (supports status now)
export const updateUser = async (
    id: string,
    data: UpdateUserPayload
): Promise<User> => {
    try {
        const res = await api.patch(`/users/updateuser/${id}`, data);
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to update user"
        );
    }
};

// ✅ Get user by ID
export const getUserById = async (id: string): Promise<User> => {
    try {
        const res = await api.get(`/users/${id}`);
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to fetch user"
        );
    }
};

// ✅ Get all users
export const getAllUsers = async (
    params?: GetUsersParams
): Promise<GetUsersResponse> => {
    try {
        const res = await api.get("/users/getalluser", {
            params,
        });
        return res.data; // { rows, total }
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to fetch users"
        );
    }
};