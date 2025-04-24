import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SeatSelection from "@/components/seat-selection";
import PassengerDetails from "@/components/passenger-details";
import FareBreakdown from "@/components/fare-breakdown";
import { apiRequest } from "@/lib/queryClient";
import { formatTime, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripDetails() {
  const { routeId, scheduleId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  
  // Fetch route details
  const { data: routeDetails, isLoading } = useQuery({
    queryKey: [`/api/routes/${routeId}/schedules/${scheduleId}`],
  });
  
  // Handle seat selection
  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
  };
  
  // Handle passenger details update
  const handlePassengerDetailsChange = (details: typeof passengerDetails) => {
    setPassengerDetails(details);
  };
  
  // Check if can proceed to payment
  const canProceed = selectedSeat && passengerDetails.name && passengerDetails.phone;
  
  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    if (!canProceed || !routeDetails) return;
    
    try {
      // Create booking
      const response = await apiRequest('POST', '/api/bookings', {
        scheduleId: parseInt(scheduleId, 10),
        passengerName: passengerDetails.name,
        passengerPhone: passengerDetails.phone,
        passengerEmail: passengerDetails.email || undefined,
        seatNumber: selectedSeat,
        totalAmount: routeDetails.fareAmount,
      });
      
      const booking = await response.json();
      
      // Navigate to payment page
      navigate(`/payment/${booking.id}`);
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 flex items-center">
        <button 
          className="p-1.5 rounded-full hover:bg-primary-dark" 
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <i className="ri-arrow-left-line"></i>
        </button>
        <h1 className="text-lg font-semibold ml-3 font-heading">Trip Details</h1>
      </div>
      
      {/* Trip Information */}
      <div className="p-4 bg-white shadow-sm mb-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ) : routeDetails ? (
          <>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 
                  ${routeDetails.providerType === 'bus' ? 'bg-blue-100 text-primary' : 
                   routeDetails.providerType === 'metro' ? 'bg-purple-100 text-purple-600' :
                   routeDetails.providerType === 'train' ? 'bg-orange-100 text-orange-600' :
                   'bg-blue-100 text-blue-600'}`}>
                  <i className={routeDetails.providerType === 'bus' ? 'ri-bus-2-line text-xl' : 
                              routeDetails.providerType === 'metro' ? 'ri-subway-line text-xl' :
                              routeDetails.providerType === 'train' ? 'ri-train-line text-xl' :
                              'ri-flight-takeoff-line text-xl'}></i>
                </div>
                <div>
                  <h3 className="font-semibold">{routeDetails.providerName}</h3>
                  <p className="text-xs text-slate-500">
                    {routeDetails.providerType === 'bus' ? 'AC Sleeper • Wifi • Water' : 
                     routeDetails.providerType === 'train' ? 'AC Chair Car • Pantry' : 
                     routeDetails.providerType === 'metro' ? 'Air Conditioned • WiFi' :
                     'Economy • Meal Included'}
                  </p>
                </div>
              </div>
              <div>
                <span className="font-semibold text-lg">₹{routeDetails.fareAmount}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm pb-4 border-b border-slate-100">
              <div>
                <div className="font-semibold">{formatTime(routeDetails.departureTime)}</div>
                <div className="text-xs text-slate-500">{routeDetails.source}</div>
                <div className="text-xs text-slate-500">Today</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-500">{formatDuration(routeDetails.duration)}</div>
                <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                  <div className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full -top-0.5 -left-0.5"></div>
                  <div className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full -top-0.5 -right-0.5"></div>
                </div>
                <div className="text-xs text-slate-500">Direct</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatTime(routeDetails.arrivalTime)}</div>
                <div className="text-xs text-slate-500">{routeDetails.destination}</div>
                <div className="text-xs text-slate-500">Today</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="text-sm">
                <span className="font-medium">ID:</span> 
                <span className="text-slate-600">
                  {routeDetails.vehicleId || `VH-${routeId}-${scheduleId}`}
                </span>
              </div>
              <div>
                <span className="bg-green-100 text-status-success text-xs px-2 py-1 rounded-full font-medium">
                  {routeDetails.status}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-slate-500">Trip details not found</p>
          </div>
        )}
      </div>
      
      {/* Seat Selection */}
      <SeatSelection 
        availableSeats={routeDetails?.availableSeats || 0}
        selectedSeat={selectedSeat}
        onSelectSeat={handleSeatSelect}
        transportType={routeDetails?.providerType || 'bus'}
      />
      
      {/* Passenger Details */}
      <PassengerDetails 
        onChange={handlePassengerDetailsChange}
        values={passengerDetails}
      />
      
      {/* Fare Breakdown */}
      <FareBreakdown 
        baseFare={routeDetails?.fareAmount || 0}
      />
      
      {/* Sticky Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button 
          className="w-full py-6"
          onClick={handleProceedToPayment}
          disabled={!canProceed || isLoading}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
