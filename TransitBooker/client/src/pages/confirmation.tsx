import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatTime, formatDate, generateBookingId } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Confirmation() {
  const { bookingId } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: [`/api/bookings/${bookingId}`],
  });
  
  // Fetch route and schedule details
  const { data: routeDetails, isLoading: isLoadingRoute } = useQuery({
    queryKey: [`/api/routes/${booking?.scheduleId}`],
    enabled: !!booking?.scheduleId,
  });
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <i className="ri-check-line text-3xl text-green-600"></i>
        </div>
        <h2 className="text-xl font-semibold text-center font-heading mb-2">Booking Confirmed!</h2>
        <p className="text-slate-600 text-center mb-8">Your ticket has been booked successfully</p>
        
        <div className="bg-white w-full rounded-xl p-4 shadow-sm mb-6">
          {isLoading || isLoadingRoute ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="border-t border-slate-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            </div>
          ) : booking ? (
            <>
              <div className="border-b border-slate-100 pb-3 mb-3">
                <h3 className="font-semibold">{routeDetails?.providerName || 'Transport Provider'}</h3>
                <p className="text-xs text-slate-500">Booking ID: {generateBookingId()}</p>
              </div>
              
              <div className="flex justify-between mb-3">
                <div>
                  <div className="text-sm text-slate-500">From</div>
                  <div className="font-medium">{routeDetails?.source || booking.source || 'Departure'}</div>
                  <div className="text-xs text-slate-500">{formatDate(new Date())}, {routeDetails?.departureTime || '08:00 AM'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">To</div>
                  <div className="font-medium">{routeDetails?.destination || booking.destination || 'Arrival'}</div>
                  <div className="text-xs text-slate-500">{formatDate(new Date())}, {routeDetails?.arrivalTime || '09:05 AM'}</div>
                </div>
              </div>
              
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <div>
                  <div className="text-sm text-slate-500">Passenger</div>
                  <div className="font-medium">{booking.passengerName}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Seat</div>
                  <div className="font-medium">{booking.seatNumber}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-slate-500">Booking not found</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between w-full gap-3">
          <Button variant="outline" className="flex-1 py-6 border-primary text-primary">
            <i className="ri-download-line mr-1"></i> Download
          </Button>
          <Button 
            className="flex-1 py-6"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
