'use client';

import { Suspense, useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Loader from '@/components/loader/loader';
import StripePayment from '@/components/stripe/StripePayment';
import { RoomType, RoomNumberType } from '@/utils/types/hotel';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRoomInfo } from '@/utils/hooks/useRoomInfo';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Types
interface Room {
  _id: string;
  title: string;
  desc: string;
  maxPeople: number;
  price: number;
  roomNumbers: RoomNumberType[];
}

export default function ReservePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <SearchParamsClient />
      </Suspense>
    </>
  );
}


// Separate client component for search params
function SearchParamsClient() {
  const searchParams = useSearchParams()
  const hotelId = searchParams?.get('hotelId') || undefined

  return (
    <Suspense fallback={<Loader />}>
      <ReserveDataClient hotelId={hotelId} />
    </Suspense>
  );
}

// Separate client component for data fetching and rendering
function ReserveDataClient({ hotelId }: { hotelId: string | undefined }) {
  const [openPay, setOpenPay] = useState(false);

  // Fetch rooms data
  const { 
    data: rooms, 
    isLoading, 
    error 
  } = useQuery<Room[]>({
    queryKey: ['hotelRooms', hotelId],
    queryFn: async () => {
      if (!hotelId) throw new Error("No hotel ID provided");
      try {
        const response = await axios.get(`/api/routes/hotels/getRooms?hotelId=${hotelId}`);
        return response.data;
      } catch (err) {
        throw new Error("Failed to fetch hotel rooms");
      }
    },
    enabled: !!hotelId
  });

  const { 
    selectedRooms, 
    handleSelect, 
    isAvailable, 
    availableDates, 
    selectedRoomNumbers, 
    getRooms 
  } = useRoomInfo(rooms as RoomType[]);

  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setPreviousUrl } = useAuthStore();

  // Open payment modal
  const handlePayModal = () => {
    if (selectedRooms.length > 0) {
      setPreviousUrl(`${pathname}?hotelId=${hotelId}`);
      if (!currentUser) router.push('/auth/login');
      setOpenPay(true);
    } else {
      toast.error("No room selected");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;

  return (
    <>
      {!rooms || rooms.length < 1 ? (
        <div className='noReservation text-center py-10'>
          <h3 className="text-xl font-semibold">No Hotel found</h3>
        </div>
      ) : (
        <section className="container mx-auto px-4 mb-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold my-4">Select your rooms</h2>
            <div className="grid gap-4 py-4">
              {rooms.map((room) => (
                <Card key={room._id} className="w-full">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {room.title}
                      <Badge variant="secondary" className="ml-2">${room.price}</Badge>
                    </CardTitle>
                    <CardDescription>{room.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <span>Max people: {room.maxPeople}</span>
                      <div className="flex flex-wrap gap-2">
                        {room.roomNumbers.map((roomNumber) => (
                          <div key={roomNumber.number} className="flex items-center space-x-2">
                            <Checkbox
                              id={roomNumber._id}
                              checked={selectedRooms.includes(roomNumber?._id!)}
                              onCheckedChange={(checked) =>
                                handleSelect(!!checked, roomNumber?._id!, room._id, roomNumber.number, room)
                              }
                              disabled={!isAvailable(roomNumber)}
                            />
                            <label
                              htmlFor={roomNumber._id}
                              className={`text-sm ${!isAvailable(roomNumber) ? 'text-gray-400 line-through' : ''}`}
                            >
                              {roomNumber.number}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={handlePayModal} className="w-full">Reserve Now!</Button>
          </div>
        </section>
      )}

      {openPay && (
        <StripePayment
          bookingInfo={getRooms()}
          hotelId={hotelId!}
          dates={availableDates}
          getRooms={getRooms}
          selectedRooms={selectedRooms}
          onClose={() => setOpenPay(false)}
          openPay={openPay}
          selectedRoomNumbers={selectedRoomNumbers}
        />
      )}
    </>
  );
}