import { create } from "zustand";

export interface ToastMessage {
     severity: "success" | "info" | "warn" | "error";
     summary: string;
     detail: string;
}

interface ToastState {
     message: ToastMessage | null;
     showToast: (msg: ToastMessage) => void;
     clearToast: () => void;
}

export const toastStore = create<ToastState>((set) => ({
     message: null,
     showToast: (msg: ToastMessage) => set({ message: msg }),
     clearToast: () => set({ message: null }),
}));