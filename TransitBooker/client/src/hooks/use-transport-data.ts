import { useQuery } from "@tanstack/react-query";
import { TransportProvider, RouteWithDetails, Offer } from "@shared/schema";

interface UseTransportProvidersProps {
  type?: string;
}

// Hook to fetch transport providers
export function useTransportProviders({ type }: UseTransportProvidersProps = {}) {
  return useQuery<TransportProvider[]>({
    queryKey: type ? ['/api/transport-providers', type] : ['/api/transport-providers'],
  });
}

// Hook to fetch popular routes
export function usePopularRoutes() {
  return useQuery<RouteWithDetails[]>({
    queryKey: ['/api/popular-routes'],
  });
}

// Hook to fetch offers
export function useOffers() {
  return useQuery<Offer[]>({
    queryKey: ['/api/offers'],
  });
}

interface UseSearchRoutesProps {
  source: string;
  destination: string;
  type: string;
  date?: string;
  enabled?: boolean;
}

// Hook to search for routes
export function useSearchRoutes({ source, destination, type, date, enabled = true }: UseSearchRoutesProps) {
  return useQuery<RouteWithDetails[]>({
    queryKey: ['/api/routes/search', source, destination, type, date],
    enabled: enabled && !!source && !!destination && !!type,
  });
}

interface UseRouteDetailsProps {
  routeId: string | number;
  scheduleId: string | number;
  enabled?: boolean;
}

// Hook to fetch route details
export function useRouteDetails({ routeId, scheduleId, enabled = true }: UseRouteDetailsProps) {
  return useQuery<RouteWithDetails>({
    queryKey: [`/api/routes/${routeId}/schedules/${scheduleId}`],
    enabled: enabled && !!routeId && !!scheduleId,
  });
}

interface UseSchedulesProps {
  routeId: string | number;
  enabled?: boolean;
}

// Hook to fetch schedules for a route
export function useSchedules({ routeId, enabled = true }: UseSchedulesProps) {
  return useQuery({
    queryKey: [`/api/routes/${routeId}/schedules`],
    enabled: enabled && !!routeId,
  });
}

interface UseBookingProps {
  bookingId: string | number;
  enabled?: boolean;
}

// Hook to fetch booking details
export function useBooking({ bookingId, enabled = true }: UseBookingProps) {
  return useQuery({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: enabled && !!bookingId,
  });
}

// Hook to fetch user bookings
export function useUserBookings(userId?: number) {
  const queryKey = userId ? ['/api/bookings', { userId }] : ['/api/bookings'];
  
  return useQuery({
    queryKey,
    enabled: !!userId,
  });
}
