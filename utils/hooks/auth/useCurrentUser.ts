import { useAuthStore } from '@/store/AuthStore';
import { fetchCurrentUser } from '@/utils/helpers/auth/apiFunctions';
import { User } from '@/utils/types/auth';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  const { currentUser, setCurrentUser } = useAuthStore();

  const query = useQuery<User | null, Error>({
    queryKey: ['currentUser'], 
    queryFn: async () => {
      const data = await fetchCurrentUser();
      if (data) {
        setCurrentUser(data);
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Remove the initial check for currentUser
    // This ensures all hooks are always called
    enabled: true,
  });

  // If there's a cached user, return it immediately
  // Otherwise, return the query result
  return {
    data: currentUser || query.data,
    isLoading: query.isLoading,
    error: query.error
  };
};