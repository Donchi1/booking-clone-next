// utils/hooks/auth/useRegister.ts
import { Toaster } from "@/components/ui/sonner";
import { registerUser } from "@/utils/helpers/auth/apiFunctions";
import { RegisterCredentials } from "@/utils/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface RegisterMutationOptions {
  onSuccessRedirect?: () => void;
}

export const useRegister = (options: RegisterMutationOptions = {}) => {
  const router = useRouter();

  return useMutation< {message: string} , Error, RegisterCredentials>({
    mutationFn: registerUser,
    
    onSuccess: (response) => {
      if (response.message) {
        // Show success toast
        toast.success('Registration successful', {
          description: 'You can now log in to your account'
        });

        // Optional redirect
        if (options.onSuccessRedirect) {
          options.onSuccessRedirect();
        } else {
          // Default redirect to login
          router.push('/auth/login');
        }
      }
    },
    
    // Retry mechanism
    retry: (failureCount, error) => {
      // Don't retry on certain types of errors
      const nonRetryableErrors = [
        'Invalid credentials',
        'User already exists'
      ];

      return !nonRetryableErrors.some(msg => error.message.toLowerCase().includes(msg.toLowerCase())) && 
             failureCount < 3;
    }
  });
};

