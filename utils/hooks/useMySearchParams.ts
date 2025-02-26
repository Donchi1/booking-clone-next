'use client'

import { useMemo } from 'react'

export const useMySearchParams = () => {
    return useMemo(() => {
        // Check if running in browser environment
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search)
        }
        // Return an empty URLSearchParams for server-side or non-browser environments
        return new URLSearchParams()
    }, [])


}