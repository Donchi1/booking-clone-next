// useStripePayment.ts
import { useState, useEffect } from 'react';
import {  loadStripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'sonner';
import { User } from '../types/auth';

interface BookingRequestType {
  bookings: Record<string, any>;
  amount: number;
  parsedRooms: Record<string, any>[];
  hotelId: string;
  totalBookedDates: number[];
  paymentMethod: string;
  currency: string;
  userId: string;
}

const useStripePayment = (
    total: number, 
    bookingInfo: Record<string, any>,
    selectedRooms: string[],
    getRooms: () => Record<string, any>, 
    hotelId: string, 
    currentUser: User | null,
    parsedRooms: Record<string, any>[]
) => {
  
    // Stripe setup
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Fetch client secret
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/routes/payments', {
          method: 'POST',
          body: JSON.stringify({ amount: (total + 200) * 100 }) // Convert to cents
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast("Payment Error", {
          description: "Unable to initialize payment",
        });
      }
    };
    fetchClientSecret();
  }, [total]);

  // Handle payment
  const handlePayment = async (dates: number[]) => {
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    try {

      setIsLoading(true);

      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as StripeCardElement,
          billing_details: {
            name: currentUser?.firstname + ' ' + currentUser?.lastname || 'Guest',
            email: currentUser?.email || 'guest@example.com',
          }
        }
      });

      if (error) {
        throw error;
      }

      // Update room availability
      await Promise.all(
        selectedRooms.map(roomId => 
          axios.patch(`/api/routes/rooms/availability?roomId=${roomId}`, { dates })
        )
      );

      // Update hotel bookings
      await axios.patch("/api/routes/hotels/updateBooking", { bookings: getRooms() });

      // Create booking record
      const bookingResponse = await axios.post('/api/routes/bookings', {
        bookings: bookingInfo,
        amount: paymentIntent.amount,
        parsedRooms,
        hotelId,
        totalBookedDates: dates,
        paymentMethod: 'card',
        currency: paymentIntent.currency || 'usd',
        userId: currentUser?._id
      } as BookingRequestType);

      setIsLoading(false);
      return bookingResponse.data;
    } catch (error: any) {
      setPaymentError(error.message);
      setIsLoading(false);
      toast("Booking Failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return { handlePayment, isLoading, paymentError };
};

export default useStripePayment;