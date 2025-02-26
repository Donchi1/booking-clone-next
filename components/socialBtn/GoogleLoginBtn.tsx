"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from 'next/image'

export default function GoogleLoginBtn({ 
  onLoginSuccess, 
  onLoginFailure 
}:{ 
  onLoginSuccess?: (userData: any) => void 
  onLoginFailure?: (error: any) => void}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async (googleCredential: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokenId: googleCredential })
      })

      if (!response.ok) {
        throw new Error('Google login failed')
      }

      const userData = await response.json()
      
      toast.success("Login Successful",{
        description: `Welcome, ${userData.name}!`,
      })

      onLoginSuccess?.(userData)
      router.push('/')
    } catch (error: any) {
      toast.error("Login Failed",{
        description: error?.message,
      })

      onLoginFailure?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleResponse = (response: {[key:string]: any}) => {
    if (response.credential) {
      handleGoogleLogin(response.credential)
    }
  }

  const handleGoogleError = () => {
    toast.error("Google Login Error", {
      description: "Unable to complete Google login",
    })
  }

  return (
    <Button 
      variant="outline" 
      className="w-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
      onClick={() => {
        // This would typically be replaced with Google OAuth library in Next.js
        // For now, it's a placeholder
        window.location.href = '/api/auth/google/redirect'
      }}
      disabled={isLoading}
    >
      <Image src="/assets/imgs/google.png" alt="Google Logo" className="mr-2 h-5 w-5" />
      {isLoading ? 'Logging in...' : 'Continue with Google'}
    </Button>
  )
}
