"use client";
import { User } from '@/utils/types/auth';
import { logoutUser } from "@/utils/helpers/auth/apiFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    return useMutation<User | null, Error>({
      mutationFn: logoutUser,
      onSuccess: (user) => {
        // Clear all queries
        queryClient.clear();
        
        // Reset current user to null
        queryClient.setQueryData(['currentUser'], user);
        router.replace('/auth/login')
      },
      onError: (error) => {
        toast.error('Logout failed', {
          description: error.message || 'An unexpected error occurred'
        })
      }
    });
  };