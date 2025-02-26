"use client"

import { useState } from 'react'
import { Facebook } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function FacebookLogin({ 
  onLoginSuccess, 
  onLoginFailure 
}: {
  onLoginSuccess?: (userData: any) => void
  onLoginFailure?: (error: any) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    try {
      // Implement Facebook OAuth logic
      const response = await fetch('/api/auth/facebook', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Facebook login failed')
      }

      const userData = await response.json()
      
      toast.success("Login Successful",{
        description: `Welcome, ${userData.name}!`,
      })

      onLoginSuccess?.(userData)
    } catch (error: any) {
      toast("Login Failed",{
        description: error?.message,
      })

      onLoginFailure?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="w-full bg-blue-600 text-white hover:bg-blue-700"
      onClick={handleFacebookLogin}
      disabled={isLoading}
    >
      <Facebook className="mr-2 h-5 w-5" />
      {isLoading ? 'Logging in...' : 'Continue with Facebook'}
    </Button>
  )
}