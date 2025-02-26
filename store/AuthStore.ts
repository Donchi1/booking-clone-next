"use client"
import { User } from "@/utils/types/auth";
import { create } from "zustand";

// Zustand store for local state management
interface AuthState {
    //isAuthenticated: boolean;
    //setAuthenticated: (status: boolean) => void;
    currentUser: User | null;
    previousUrl: string

    setPreviousUrl: (url: string) => void;
    setCurrentUser: (user: User | null) => void;
  }
  
  export const useAuthStore = create<AuthState>((set) => ({
    currentUser: null,
    previousUrl: "",

    setPreviousUrl: (url: string) => set({ previousUrl: url }),
    setCurrentUser: (user) => set({ currentUser: user }),

    
  }));
  