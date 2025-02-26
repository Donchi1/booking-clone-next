"use client";
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseFetchOptions {
  enabled?: boolean;
  queryKey?: string[];
}

const fetcher = (url: string) => axios.get(url).then(res => res.data).catch(err => err);

export function useFetch<T = any>(
  url: string, 
  options: UseFetchOptions = {}
) {
  const { 
    enabled = true, 
    queryKey = null
  } = options;

  const query = useQuery<T>({
    queryKey: queryKey ? queryKey :[url],
    queryFn: () => fetcher(url),
    enabled,
    // Optional: add retry logic
    retry: 1,
    // Optional: add stale time to reduce unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch
  };
}

// Optional: Add a generic mutation hook
export function useMutationFetch<T = any>(
  url: string, 
  method: 'post' | 'put' | 'delete' = 'post',
  invalidatesKeys: string[] | null = []
) {
  const mutation = useMutation<T>({
    mutationFn: async (payload) => {
      const { data } = await axios[method](url, payload as any);
      return data;
    }
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
}