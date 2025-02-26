// app/main/order/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '@/components/navbar/Navbar';
import Accord from '@/components/accord/Accord';
import { convertCurrency } from '@/utils/helpers/converter';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Footer from '@/components/footer/Footer';
import MailList from '@/components/mailList/MailList';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState } from 'react';

// Type definition for the booking data
interface BookingData {
  hotel: {
    _id: string;
    photos: string[];
    name: string;
    distance: number;
    desc: string;
    rating?: number;
    cheapestPrice: number;
    address: string;
  };
  booking: {
    _id: string;
    bookedRoomsInfo: Array<{
      roomTitle: string;
      selectedRooms: number[];
      price: number;
    }>;
    status: string;
    totalBookedRooms: number;
    totalNights: number;
    totalPrice: number;
  };
}
type BookingStatusType = 'pending' | 'completed' | 'rejected' | 'cancelled';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [openCancel, setOpenCancel] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter()

  // Fetch booking data using React Query
  const {
    data,
    isLoading,
    error,
    isError
  } = useQuery<BookingData[]>({
    queryFn: async () => {
      const info = await axios.get(`/api/routes/bookings/getbookingWithUser?userId=${userId}`)
      return info.data;
    },
    queryKey: ['bookings', userId],
    enabled: !!userId
  });

  const mutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const info = await axios.patch(`/api/routes/bookings/update?bookingId=${bookingId}`, {
        status: 'cancelled'
      });
      return info.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err: any) => {
      toast.error(err?.message);
    }
  });

  const handleCancel = async () => {
    try {
      await mutation.mutateAsync(bookingId);
      toast.success("Booking canceled");
      setOpenCancel(false);
    } catch (err: any) {
      toast.error(err?.message);
    }
  }

  const getBookingText = (status: BookingStatusType) => {
    switch (status) {
      case "pending": return "Cancel Booking";
      case "completed": return "Booking Completed";
      case "rejected": return "Booking Rejected";
      case "cancelled": return "Booking Cancelled";
      default: return "Cancel Booking";
    }
  }

  if (isLoading) return <Loader size="lg" />;

  // Calculate pagination
  const bookingsPerPage = 1;
  const totalBookings = data?.length || 0;
  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  // Get current booking
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBooking = data?.slice(indexOfFirstBooking, indexOfLastBooking)[0];

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <>
      <Navbar />
      <section>
        <div className='container mx-auto px-4 mb-8'>
          <Accord title="Reservations" />
          
          {!currentBooking ? (
            <div className='noReservation text-center py-10'>
              <h3 className="text-xl font-semibold">No reservation found</h3>
            </div>
          ) : (
            <div>
              <div 
                key={currentBooking?.booking?._id}
                className='flex flex-col md:flex-row gap-6 border-b'
              >
                <div className='flex-1'>
                  <div className='flex flex-col gap-4 md:flex-row'>
                    {/* Hotel Image */}
                    <div className="relative w-full md:w-[55%] h-64">
                      <Image
                        src={currentBooking?.hotel?.photos[0]}
                        alt={currentBooking?.hotel?.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Hotel Description */}
                    <div className="flex-grow space-y-2">
                      <h1 className="text-2xl font-bold">{currentBooking?.hotel?.name}</h1>
                      <div className="space-y-1">
                        <span className="block">{currentBooking?.hotel?.distance}m from center</span>
                        <span className="block text-green-600">Free airport taxi</span>
                        <span className="block font-medium">
                          Studio Apartment with Air conditioning
                        </span>
                        <p className="text-gray-600">{currentBooking?.hotel?.desc}</p>

                        {currentBooking?.hotel?.rating && (
                          <div className="flex items-center gap-2">
                            <span>Excellent</span>
                            <button className="bg-green-500 text-white px-2 py-1 rounded">
                              {currentBooking?.hotel?.rating}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-1">
                        <span className="block text-xl font-bold">
                          ${currentBooking?.hotel?.cheapestPrice}
                        </span>
                        <span className="block text-sm text-gray-500">
                          Includes taxes and fees
                        </span>
                        <span className="block">{currentBooking?.hotel?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Photos */}
                  <div className="flex items-center gap-2 mt-4">
                    {currentBooking?.hotel?.photos.slice(0, 3).map((each, idx) => (
                      <div key={idx} className="w-[80px]">
                        <Image
                          src={each}
                          width={500}
                          height={500}
                          alt={`Hotel view ${idx + 1}`}
                          className="object-cover rounded-lg hover:opacity-80 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booked Rooms and More Information */}
                <div className="w-full md:w-1/3 mb-4 mt-4 md:mt-0 space-y-4">
                  {/* Booked Rooms */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Booked Rooms</h2>
                    <div className="space-y-2">
                      {currentBooking?.booking.bookedRoomsInfo?.map((each, idx) => (
                        <div
                          key={`${idx}-${each.roomTitle}`}
                          className="bg-gray-100 p-2 rounded"
                        >
                          <span className="block">
                            Room: {each?.selectedRooms.map((room) => (
                              <span key={room}>{room}, </span>
                            ))}
                          </span>
                          <span className="block">Title: {each.roomTitle}</span>
                          <span className="block">Price: ${each.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* More Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">More Information</h2>
                    <div className="bg-gray-100 p-2 rounded space-y-1">
                      <span className="block">Total Rooms: {currentBooking?.booking?.totalBookedRooms}</span>
                      <span className="block">Nights: {currentBooking.booking?.totalNights}</span>
                      <span className="block">
                        Total Price: {convertCurrency(currentBooking?.booking?.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <Button
                    className='bg-primary hover:bg-primary-light text-primary-white'
                    disabled={mutation.isPending || currentBooking.booking.status === 'completed' || currentBooking.booking.status === 'cancelled'}
                    onClick={() => {
                      setOpenCancel(true);
                      setBookingId(currentBooking?.booking?._id);
                    }}
                  >
                    {getBookingText(currentBooking.booking.status as BookingStatusType)}
                  </Button>
                </div>
              </div>

              {/* Pagination */}
              <Pagination className='justify-start mt-8'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrevPage();
                      }} 
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">
                      {currentPage} of {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextPage();
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <MailList />
        <Footer />
      </section>

      {/* Cancel Booking Dialog */}
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation?</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to cancel this booking?</DialogDescription>
          <DialogFooter>
            <DialogClose className='mr-2 bg-primary-red px-2 text-sm rounded-md hover:bg-primary-red/80 text-primary-white'>
              Cancel
            </DialogClose>
            <Button 
              className='bg-primary hover:bg-primary-light text-primary-white' 
              onClick={handleCancel} 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Cancelling...' : 'Yes, cancel it!'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}