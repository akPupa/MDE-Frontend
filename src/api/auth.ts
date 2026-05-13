import type { User } from "@stores/authStore";
import { api } from "./client";

/* ================= TYPES ================= */

// Request OTP (only email)
export interface RequestOtpPayload {
    email: string;
}

// Verify OTP (email + code)
export interface VerifyOtpPayload {
    email: string;
    code: string;
}

// Generic response
export interface AuthResponse {
    message: string;
    token?: string;
}

export interface VerifyOtpResponse {
    token: string;
    role: string;
    user: User;
}

/* ================= API ================= */

// Send OTP
export const requestOtp = async (
    data: RequestOtpPayload
): Promise<AuthResponse> => {
    try {
        const res = await api.post("/auth/request-otp", data);
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to send OTP"
        );
    }
};

// Verify OTP
export const verifyOtp = async (
    data: VerifyOtpPayload
): Promise<VerifyOtpResponse> => {
    try {
        const res = await api.post("/auth/verify-otp", data);
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || "Failed to verify OTP"
        );
    }
};