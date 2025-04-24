import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import LocationBar from "@/components/location-bar";
import BottomNav from "@/components/bottom-nav";
import OffersCarousel from "@/components/offers-carousel";
import TransportOptions from "@/components/transport-options";
import PopularRoutes from "@/components/popular-routes";
import RecentBookings from "@/components/recent-bookings";
import PwaInstallPrompt from "@/components/pwa-install-prompt";
import { useLocation as useGeoLocation } from "@/hooks/use-location";

export default function Home() {
  const [, navigate] = useLocation();
  const { location, refreshLocation } = useGeoLocation();
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);

  // Fetch offers for carousel
  const { data: offers } = useQuery({
    queryKey: ['/api/offers'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch popular routes
  const { data: popularRoutes, isLoading: isLoadingPopularRoutes } = useQuery({
    queryKey: ['/api/popular-routes'],
  });

  // Show PWA install prompt after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if ('serviceWorker' in navigator && window.matchMedia('(display-mode: browser)').matches) {
        setShowPwaPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary px-4 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">
            <span className="font-heading">TravelEase</span>
            <span className="ml-1 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">Gujarat</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200" aria-label="Notifications">
            <i className="ri-notification-3-line text-white"></i>
          </button>
          <button className="w-9 h-9 bg-white text-primary rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm font-medium">GJ</span>
          </button>
        </div>
      </header>

      {/* Location Bar */}
      <LocationBar location={location || undefined} onRefresh={refreshLocation} />

      {/* Main Content Area */}
      <div className="overflow-y-auto h-[calc(100%-8rem)]">
        {/* Offers Carousel */}
        <div className="px-4 py-3">
          <OffersCarousel offers={offers || []} />
        </div>

        {/* Transport Options */}
        <TransportOptions onSelect={(type) => navigate(`/booking/${type}`)} />

        {/* Popular Routes */}
        <PopularRoutes 
          routes={popularRoutes || []}
          isLoading={isLoadingPopularRoutes}
          onSelect={(routeId, scheduleId) => navigate(`/trip/${routeId}/${scheduleId}`)}
        />

        {/* Recent Bookings */}
        <RecentBookings className="mb-16" />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* PWA Install Prompt */}
      {showPwaPrompt && (
        <PwaInstallPrompt onDismiss={() => setShowPwaPrompt(false)} />
      )}
    </div>
  );
}
