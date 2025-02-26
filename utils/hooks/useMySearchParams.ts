


'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useMySearchParams = () => {
    const searchParams = useSearchParams()
    
    return useMemo(() => {
        return {
            get: (key: string) => {
                // If searchParams is not available during SSR, return null
                if (!searchParams) return null
                return searchParams.get(key)
            },
            getAll: (key: string) => {
                if (!searchParams) return []
                return searchParams.getAll(key)
            },
            has: (key: string) => {
                if (!searchParams) return false
                return searchParams.has(key)
            },
            toString: () => {
                if (!searchParams) return ''
                return searchParams.toString()
            }
        }
    }, [searchParams])
}