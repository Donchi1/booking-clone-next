"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {  LogOut, BookOpen, User2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"


import { useLogout } from '@/utils/hooks/auth/useLogout'
import { useCurrentUser } from '@/utils/hooks/auth/useCurrentUser'
import { User } from '@/utils/types/auth'
import Loader from '../loader/loader'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function Navbar() {

  const router = useRouter()
  const { mutateAsync: logoutUser} = useLogout()
  const {data: user, error, isLoading} = useCurrentUser() as {data: User | null, error: Error | null, isLoading: boolean}

  if(isLoading) return <Loader />

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 ">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/assets/imgs/donnybookw.png" 
            alt="Donnybook Logo" 
            width={120} 
            height={40} 
            className="object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>

                  <Avatar>
                  <AvatarImage src={user.img || '/imgs/avatar.png'} /> 
                  <AvatarFallback className="rounded-full"> {user.firstname.charAt(0) + user.lastname.charAt(0)}</AvatarFallback>
                  </Avatar>      
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem 
                  onSelect={() => router.push('/main/profile')}
                  className="cursor-pointer"
                >
                  <User2 className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => router.push(`/main/reservations`)}
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Reservations
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => logoutUser()} 
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/auth/login" >
              <Button variant="outline" >
                Login
              </Button>
              </Link>
              <Link href="/auth/register">
              <Button >
                Register
              </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

     
    </nav>
  )
}
