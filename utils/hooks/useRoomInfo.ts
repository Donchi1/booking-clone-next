
import { useMemo, useState } from "react";
import { RoomNumberType, RoomType } from "../types/hotel";
import { useSearchStore } from "@/store/SearchStore";
import { eachDayOfInterval } from "date-fns";

interface SelectedRoom {
    id: string;
    totalBookings: number;
    title: string;
    price: number;
    totalBookPrice: number;
  }
  
  export const useRoomInfo = ( rooms: RoomType[]) => {
    const { dates } = useSearchStore();
    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
    const [hotelRooms, setHotelRooms] = useState<string[]>([]);
    const [selectedRoomNumbers, setSelectedRoomNumbers] = useState<RoomType[]>([]);

  // Date range calculation
//   const getDatesInRange = (startDate: Date, endDate: Date): number[] => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const dates: number[] = [];

//     const date = new Date(start.getTime());
//     while (date <= end) {
//       dates.push(new Date(date).getTime());
//       date.setDate(date.getDate() + 1);
//     }

//     return dates;
//   };

// const availableDates = getDatesInRange(
//   new Date(dates[0]?.from!), 
//   new Date(dates[0]?.to!)
// );

const availableDates = useMemo(() => 
    eachDayOfInterval({
      start: new Date(dates[0].from!),
      end: new Date(dates[0].to!)
    }).map(date => date.getTime()), 
    [dates]
  )


  // Check room availability
  const isAvailable = (roomNumber: RoomNumberType): boolean => {
    return !roomNumber.unavailableDates.some(date => 
      availableDates.includes(new Date(date).getTime())
    );
  };

  // Get room occurrences
  const getIdOccurrenceRooms = (roomId: string): string[] => 
    hotelRooms.filter(each => each === roomId);

  // Calculate selected rooms details
  const getRooms = (): SelectedRoom[] => {
    const filtered = rooms?.filter(room => 
      selectedRooms.some(id => 
        room.roomNumbers.some(e => e._id === id)
      )
    );

    return filtered?.map(room => ({
      id: room._id,
      totalBookings: getIdOccurrenceRooms(room._id).length * availableDates.length,
      title: room.title,
      price: room.price,
      totalBookPrice: getIdOccurrenceRooms(room._id).length * room.price * availableDates.length
    })) as SelectedRoom[];
  };

  // Handle room selection
  const handleSelect = (
    checked: boolean,
    value: string, 
    roomId: string, 
    roomNumber: number, 
    room: RoomType
  ) => {
    setSelectedRooms(prev => 
      checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );

    setHotelRooms(prev => 
      checked 
        ? [...prev, roomId] 
        : prev.filter(item => item !== roomId)
    );

    const roomInfo ={
     ...room,
     roomNumber
    };

    setSelectedRoomNumbers(prev => 
      checked 
        ? [...prev, roomInfo] 
        : prev.filter(item => item._id !== roomInfo._id)
    );
  }

    return {
      selectedRooms,
      handleSelect,
      selectedRoomNumbers,
      getRooms,
      availableDates,
      isAvailable
    }

  }