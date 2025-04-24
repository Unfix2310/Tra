import { useState, useEffect } from "react";
import { Location } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface LocationBarProps {
  location?: Location;
  onRefresh: () => void;
}

export default function LocationBar({ location, onRefresh }: LocationBarProps) {
  const [displayLocation, setDisplayLocation] = useState("Detecting location...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (location) {
      const locationText = location.address || location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      setDisplayLocation(locationText);
    }
  }, [location]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    
    // Reset refreshing state after animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="px-4 py-3 bg-white shadow-sm relative">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80"></div>
      
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-xs text-slate-500 mb-1 font-medium">Current Location</div>
          <div className="font-medium flex items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-sm mr-2">
              <i className="ri-map-pin-2-fill text-white text-sm"></i>
            </div>
            <span className="text-foreground font-semibold">{displayLocation}</span>
            <i className="ri-arrow-down-s-line ml-1 text-secondary"></i>
          </div>
        </div>
        <Button 
          size="icon"
          variant="ghost"
          className="p-2 rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 text-primary shadow-sm transition-all duration-200"
          aria-label="Refresh location" 
          onClick={handleRefresh}
        >
          <i className={`ri-refresh-line ${isRefreshing ? 'animate-spin' : ''}`}></i>
        </Button>
      </div>
    </div>
  );
}
