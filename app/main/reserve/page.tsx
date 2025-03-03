'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRoomInfo } from '@/utils/hooks/useRoomInfo';
import { useAuthStore } from '@/store/AuthStore';
import Navbar from '@/components/navbar/Navbar';
import Loader from '@/components/loader/loader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import StripePayment from '@/components/stripe/StripePayment';
import { RoomType, RoomNumberType } from '@/utils/types/hotel';


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
  const pathname = usePathname();
  const router = useRouter();

  // Get search parameters from URL
  const hotelId = useSearchParams()?.get('hotelId') || undefined;

  const { currentUser, setPreviousUrl } = useAuthStore();
  const [openPay, setOpenPay] = useState(false);

  // Fetch rooms data
  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['hotelRooms', hotelId || ""],
    queryFn: async () => axios.get(`/api/routes/hotels/getRooms?hotelId=${hotelId}`).then(res => res.data),
    enabled: true
  });

  const { selectedRooms, handleSelect, isAvailable, availableDates, selectedRoomNumbers, getRooms } = useRoomInfo(rooms as RoomType[]);

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
  //if (error) return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;

  return (
    <Suspense fallback={<Loader />}>
      <Navbar />
      {!rooms || rooms?.length as number < 1 ? (
        <div className='noReservation text-center py-10'>
          <h3 className="text-xl font-semibold">No Hotel found</h3>
        </div>) : (

        <section className="container mx-auto px-4 mb-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold my-4">Select your rooms</h2>

            <div className="grid gap-4 py-4">
              {rooms?.length as number > 0 && rooms?.map((room) => (
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
                                handleSelect(!!checked, roomNumber._id!, room._id, roomNumber.number, room)
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
    </Suspense>
  );
}
