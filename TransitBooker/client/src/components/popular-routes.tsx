import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getProviderIcon, getProviderIconBgColor } from "@/lib/utils";
import { RouteWithDetails } from "@shared/schema";

interface PopularRoutesProps {
  routes: RouteWithDetails[];
  isLoading: boolean;
  onSelect: (routeId: number, scheduleId: number) => void;
  className?: string;
}

export default function PopularRoutes({ routes, isLoading, onSelect, className = '' }: PopularRoutesProps) {
  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold font-heading">Popular Routes</h2>
        <a href="#" className="text-primary text-sm">View All</a>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-3 shadow-sm">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-lg mr-3" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </Card>
          ))
        ) : routes.length > 0 ? (
          // Actual routes
          routes.map((route) => (
            <Card 
              key={`${route.id}-${route.scheduleId}`}
              className="p-3 shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect(route.id, route.scheduleId)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getProviderIconBgColor(route.providerType)}`}>
                  <i className={getProviderIcon(route.providerType)}></i>
                </div>
                <div>
                  <h3 className="font-medium">{route.source} to {route.destination}</h3>
                  <p className="text-xs text-slate-500">
                    {route.providerName}, {route.providerType === 'metro' || route.providerType === 'bus' 
                      ? 'Every 15 min'
                      : route.providerType === 'train'
                      ? 'Daily'
                      : 'Multiple flights daily'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(route.fareAmount)}</div>
                <div className="text-xs text-green-600">
                  {route.availableSeats > 20 
                    ? 'Available' 
                    : route.availableSeats > 5 
                    ? 'Limited seats' 
                    : `${route.availableSeats} seats left`
                  }
                </div>
              </div>
            </Card>
          ))
        ) : (
          // Empty state
          <Card className="p-6 shadow-sm">
            <div className="text-center">
              <p className="text-slate-500">No popular routes available</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
