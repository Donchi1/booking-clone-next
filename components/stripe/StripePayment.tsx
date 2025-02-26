"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, CreditCard } from 'lucide-react'
import { loadStripe, StripeCardElement } from '@stripe/stripe-js'
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { RoomType } from '@/utils/types/hotel'
import axios from 'axios'
import { useAuthStore } from '@/store/AuthStore'
import useStripePayment from '@/utils/hooks/useStripepayment'

interface StripePaymentProps {
  bookingInfo: Record<string, any>
  selectedRoomNumbers: RoomType[]
  dates: number[]
  hotelId: string
  getRooms: () => Record<string, any>
  selectedRooms: string[]
  onClose?: () => void,
  openPay: boolean
 
}

interface BookingRequestType {
  bookings: Record<string, any>
  amount: number
  parsedRooms: Record<string, any>[]
  hotelId: string
  totalBookedDates: number[]
  paymentMethod: string
  currency: string
  userId: string
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)

function StripePaymentForm({ bookingInfo, selectedRoomNumbers, dates, hotelId, getRooms, selectedRooms, onClose }: StripePaymentProps) {
  
  const router = useRouter();

  const { currentUser } = useAuthStore();

  // Parse rooms into a format suitable for reservation
  const parsedRooms = selectedRoomNumbers.reduce((acc, room) => {
    const existingRoom = acc.find(item => item.roomTitle === room.title);
    if (existingRoom) {
      existingRoom.selectedRooms.push(room.roomNumber!);
    } else {
      acc.push({ roomTitle: room.title, selectedRooms: [room.roomNumber!], price: room.price });
    }
    return acc;
  }, [] as { roomTitle: string, selectedRooms: number[], price: number }[]);

  // Calculate total amount
  const total = bookingInfo.reduce((acc: any, item: any) => acc + item.totalBookPrice, 0);
  
  // Handle payment
  const { handlePayment, isLoading, paymentError } = useStripePayment(total, bookingInfo, selectedRooms, getRooms, hotelId, currentUser, parsedRooms);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingData = await handlePayment(dates);
    if (bookingData) {
      toast.success("Booking Successful", {
        description: "Your reservation is confirmed!",
        onAutoClose: () => {
          onClose && onClose();
          localStorage.removeItem("search-storage")
          router.push(`/main/reservations?userId=${bookingData.userId}`);
        }
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Summary</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Selected Rooms</h3>
              {parsedRooms.map((room, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{room.roomTitle}</h4>
                      {room.selectedRooms.map((roomNumber: number) => (
                        <Badge key={roomNumber} variant="secondary">Room {roomNumber}</Badge>
                      ))}
                    </div>
                    <span className="font-bold">${room.price}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (2%)</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between">
                <span>Total Rooms</span>
                <span>{parsedRooms.length} for {dates.length} days</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(total + 2).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />

          {paymentError && (
            <div className="text-red-500 text-sm">{paymentError}</div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Complete Booking'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function StripePaymentWrapper(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
}