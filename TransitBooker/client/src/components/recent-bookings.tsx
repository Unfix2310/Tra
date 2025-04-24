import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface RecentBookingsProps {
  className?: string;
}

export default function RecentBookings({ className = '' }: RecentBookingsProps) {
  // In a real app, we would fetch actual user bookings
  // For now, we'll use mock data
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings'],
    // Mock data until we have real user authentication
    initialData: [
      {
        id: 1,
        type: 'bus',
        title: 'BRTS Bus Ticket',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'Completed'
      },
      {
        id: 2,
        type: 'metro',
        title: 'Metro - Blue Line',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'Completed'
      },
      {
        id: 3,
        type: 'train',
        title: 'ADI-BRC Passenger',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        status: 'Completed'
      }
    ]
  });

  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold font-heading">Recent Bookings</h2>
        <a href="#" className="text-primary text-sm">View All</a>
      </div>
      
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border-b border-slate-100">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))
          ) : bookings.length > 0 ? (
            // Actual bookings
            bookings.map((booking, index) => (
              <div 
                key={booking.id}
                className={`p-4 ${index < bookings.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{booking.title}</h3>
                    <p className="text-xs text-slate-500">
                      {formatDate(booking.date)}, {
                        new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="p-6 text-center">
              <p className="text-slate-500">No recent bookings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
