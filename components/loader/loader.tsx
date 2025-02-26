"use client"

import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function Loader({
  className,
  size = 'lg',
  variant = 'default'
}: {
  className?: string,
  size?: 'sm' | 'md' | 'lg' | 'xl',
  variant?: 'default' | 'destructive' | 'outline'
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    default: 'text-blue-600 animate-spin',
    destructive: 'text-red-500 animate-spin',
    outline: 'text-gray-500 border-2 border-gray-300 rounded-full animate-spin'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2
          className={cn(
            'animate-spin',
            sizeClasses[size as keyof typeof sizeClasses],
            variantClasses[variant as keyof typeof variantClasses],
            className
          )}
        />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}