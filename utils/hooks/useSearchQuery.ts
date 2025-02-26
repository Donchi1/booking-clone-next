import {useSearchStore} from "@/store/SearchStore";
import { useQuery } from "@tanstack/react-query";

export const useSearchQuery = () => {
    //const queryClient = useQueryClient();
    const {destination,dates,options} = useSearchStore();
  
    return useQuery({
      queryKey: ['search', destination, dates, options],
      queryFn: async () => {
        // Implement your search logic here
        // This could be an API call to fetch search results
        return {
          city: destination,
          dates: dates,
          options: options
          // Add any additional search results
        };
      },
      // Enable caching and background updates
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    });
  };