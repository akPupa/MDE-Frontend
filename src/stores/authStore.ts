import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= TYPES ================= */

export type UserRole = "SUPER_ADMIN" | "PROVIDER" | "DEV";

export type User = {
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean,
    _id: string
};

type AuthState = {
    token: string | null;
    user: User | null;
    tempEmail: string | null;

    isAuthenticated: boolean;

    setAuth: (token: string, user: User) => void;
    setTempEmail: (email: string) => void;
    logout: () => void;
};

/* ================= STORE ================= */

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            tempEmail: null,
            isAuthenticated: false,

            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    tempEmail: null, // clear after login
                }),

            setTempEmail: (email) =>
                set({ tempEmail: email }),

            logout: () =>
                set({
                    token: null,
                    user: null,
                    tempEmail: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
        }
    )
);