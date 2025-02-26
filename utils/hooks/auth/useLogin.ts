import { useAuthStore } from "@/store/AuthStore";
import { loginUser } from "@/utils/helpers/auth/apiFunctions";
import { LoginCredentials, User } from "@/utils/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setCurrentUser,previousUrl } = useAuthStore();
    
    return useMutation<User, Error, LoginCredentials>({
        mutationFn: loginUser, 
        onSuccess: (user) => {
        // Update the current user query cache
        queryClient.setQueryData(['currentUser'], user);
        
        // Invalidate and refetch
        queryClient.invalidateQueries({queryKey:['currentUser']});
        setCurrentUser(user);
        if (previousUrl) {
          return router.push(previousUrl);
        }
        router.push('/')
      },
      // onError: (error) => {
      //   return toast.error('Login failed', {
      //     description: error.message || 'An unexpected error occurred'
      //   });
      // }
    });
  };