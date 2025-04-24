import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteWithDetails } from "@shared/schema";
import { formatTime, formatDuration, formatCurrency } from "@/lib/utils";

interface SearchResultsProps {
  results: RouteWithDetails[];
  isLoading: boolean;
  onSelect: (routeId: number, scheduleId: number) => void;
}

export default function SearchResults({ results, isLoading, onSelect }: SearchResultsProps) {
  const [filter, setFilter] = useState({
    sort: 'departure', // departure, duration, price
    transportType: 'all', // all, bus, train, metro, flight
  });
  
  // Apply filters and sorting
  const filteredResults = results
    .filter(route => filter.transportType === 'all' || route.providerType === filter.transportType)
    .sort((a, b) => {
      switch (filter.sort) {
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'duration':
          return a.duration - b.duration;
        case 'price':
          return a.fareAmount - b.fareAmount;
        default:
          return 0;
      }
    });
  
  return (
    <div className="p-4 overflow-y-auto h-[calc(100%-20rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          {isLoading ? 'Searching...' : 
           results.length === 0 ? 'No options found' :
           `Available Options (${filteredResults.length})`}
        </h2>
        <button className="flex items-center text-sm text-slate-600">
          <i className="ri-filter-3-line mr-1"></i> Filters
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-3 shadow-sm">
              <div className="mb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))
        ) : filteredResults.length > 0 ? (
          // Actual results
          filteredResults.map((route) => (
            <Card 
              key={`${route.id}-${route.scheduleId}`}
              className="p-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 
                    ${route.providerType === 'bus' ? 'bg-blue-100 text-primary' : 
                     route.providerType === 'metro' ? 'bg-purple-100 text-purple-600' :
                     route.providerType === 'train' ? 'bg-orange-100 text-orange-600' :
                     'bg-blue-100 text-blue-600'}`}>
                    <i className={route.providerType === 'bus' ? 'ri-bus-2-line' : 
                               route.providerType === 'metro' ? 'ri-subway-line' :
                               route.providerType === 'train' ? 'ri-train-line' :
                               'ri-flight-takeoff-line'}></i>
                  </div>
                  <div>
                    <h3 className="font-medium">{route.providerName}</h3>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">{formatCurrency(route.fareAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm pb-2 border-b border-slate-100">
                <div>
                  <div className="font-semibold">{formatTime(route.departureTime)}</div>
                  <div className="text-xs text-slate-500">{route.source}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500">{formatDuration(route.duration)}</div>
                  <div className="w-20 h-0.5 bg-slate-200 relative my-1">
                    <div className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full -top-0.5 -left-0.5"></div>
                    <div className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full -top-0.5 -right-0.5"></div>
                  </div>
                  <div className="text-xs text-slate-500">Direct</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatTime(route.arrivalTime)}</div>
                  <div className="text-xs text-slate-500">{route.destination}</div>
                </div>
              </div>

              <div className="flex justify-between pt-2 items-center">
                <div className="flex items-center text-xs">
                  {route.availableSeats > 0 ? (
                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      {route.availableSeats} seats available
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Sold out
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelect(route.id, route.scheduleId)}
                  disabled={route.availableSeats <= 0}
                >
                  Select
                </Button>
              </div>
            </Card>
          ))
        ) : (
          // Empty state
          <Card className="p-6 shadow-sm">
            <div className="text-center">
              <p className="text-slate-500">No travel options found for this route. Try another destination or date.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
