"use client"

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/AuthStore'
import { Edit, Save, LogOut, Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/navbar/Navbar'
import { useLogout } from '@/utils/hooks/auth/useLogout'
import Link from 'next/link'
import { useUserAction } from '@/utils/hooks/user/useUserAction'
import LocationSelector from '@/components/ui/location-input'

// Validation schema
const profileSchema = z.object({
    firstname: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastname: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    country: z.string().min(2, { message: "Country is required" }),
    state: z.string().min(2, { message: "State is required" }),
    city: z.string().min(2, { message: "City is required" }),
})

export default function ProfilePage() {
    const { currentUser, setCurrentUser } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const { mutateAsync, isPending } = useLogout()
    const { mutateAsync: updateUser, isPending: updatePending } = useUserAction("update")


    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            state: ''
        }
    })

    useEffect(() => {
        if (currentUser) {
            setValue("firstname", currentUser.firstname)
            setValue("lastname", currentUser.lastname)
            setValue("email", currentUser.email)
            setValue("phone", currentUser.phone || '')
            setValue("country", currentUser.country)
            setValue("city", currentUser.city)
            setValue("state", currentUser.state)
        }
    }, [currentUser])


    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        try {
            // TODO: Implement actual API call to update user profile
            // For now, we'll just update the local state
            await updateUser({ userId: currentUser!._id, payload: data })
            setCurrentUser({ ...currentUser!, ...data })

            toast.success('Profile updated successfully', {
                position: 'top-right',
            })

            setIsEditing(false)
        } catch (error) {
            toast.error('Failed to update profile', {
                position: 'top-right',
            })
        }
    }


    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Card className={`shadow-sm rounded-none border-none `}>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage
                                        src={currentUser?.img || '/default-avatar.png'}
                                        alt={`${currentUser?.firstname} ${currentUser?.lastname}`}
                                    />
                                    <AvatarFallback>
                                        {currentUser?.firstname[0]}{currentUser?.lastname[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>
                            <div>
                                <CardTitle>{`${currentUser?.firstname} ${currentUser?.lastname}`}</CardTitle>
                                <CardDescription>@{currentUser?.username}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name</Label>
                                    <Controller
                                        name="firstname"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                className={errors.firstname ? 'border-red-500' : ''}
                                            />
                                        )}
                                    />
                                    {errors.firstname && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.firstname.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Last Name</Label>
                                    <Controller
                                        name="lastname"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                className={errors.lastname ? 'border-red-500' : ''}
                                            />
                                        )}
                                    />
                                    {errors.lastname && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.lastname.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            disabled={!isEditing}
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>

                                <div>
                                    <Label>Phone</Label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="tel"
                                                disabled={!isEditing}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                className={errors.city ? 'border-red-500' : ''}
                                            />
                                        )}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.city.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label>Country</Label>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field, formState }) => (
                                        <LocationSelector
                                            values={{
                                                country: field.value,
                                                state: control._formValues.state || ''
                                            }}
                                            onCountryChange={(country) => {
                                                // Set the country value
                                                setValue("country", country?.name || '')
                                                // Optional: Set state to empty when country changes
                                                setValue('state', '')
                                            }}
                                            onStateChange={(state) => {
                                                // Set the state value
                                                setValue('state', state?.name || '')
                                            }}
                                            disabled={{country: !isEditing, state: !isEditing}}
                                        />
                                    )}
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.country.message}
                                    </p>
                                )}
                            </div>
                            {isEditing && (
                                <div className="flex justify-end space-x-4 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            reset()
                                            setIsEditing(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className='bg-primary text-primary-white hover:bg-primary-light' disabled={updatePending} type="submit">{updatePending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}</Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <div className=" mt-4 flex justify-between">
                    <Link href={`/main/reservations?userId=${currentUser?._id}`} >
                        <Button variant="outline">My Bookings</Button>
                    </Link>
                    <Button disabled={isPending} variant="destructive" onClick={() => mutateAsync()}>
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </div>
        </>
    )
}