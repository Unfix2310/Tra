import { useState, useEffect } from "react";
import { Location } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface UseLocationReturnType {
  location: Location | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  refreshLocation: () => void;
}

const defaultLocation: Location = {
  latitude: 23.0225,
  longitude: 72.5714,
  city: "Ahmedabad",
  state: "Gujarat",
  address: "Ahmedabad, Gujarat",
};

export function useLocation(): UseLocationReturnType {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Function to get the city name from coordinates using reverse geocoding
  const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<Partial<Location>> => {
    try {
      // In a real app, we would use a geocoding API
      // For now, default to Ahmedabad if coordinates are close enough
      const ahmedabadLat = 23.0225;
      const ahmedabadLong = 72.5714;
      
      // Calculate distance between points (simplified)
      const distance = Math.sqrt(
        Math.pow(latitude - ahmedabadLat, 2) + 
        Math.pow(longitude - ahmedabadLong, 2)
      );
      
      // If within reasonable distance of Ahmedabad
      if (distance < 0.5) { // Roughly 50km
        return {
          city: "Ahmedabad",
          state: "Gujarat",
          address: "Ahmedabad, Gujarat"
        };
      }
      
      // Otherwise, just use the coordinates
      return {
        city: "Unknown Location",
        state: "Gujarat",
        address: `Unknown Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
      };
    } catch (error) {
      console.error("Error getting city from coordinates:", error);
      return {
        city: "Unknown Location",
        state: "Gujarat"
      };
    }
  };

  // Function to get the user's location
  const getLocation = async () => {
    setIsLoading(true);
    
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      });
      setLocation(defaultLocation);
      setIsLoading(false);
      
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by your browser. Using default location.",
        variant: "destructive"
      });
      
      return;
    }
    
    try {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get city name from coordinates
          const locationData = await getCityFromCoordinates(latitude, longitude);
          
          // Set location state
          setLocation({
            latitude,
            longitude,
            ...locationData
          } as Location);
          
          setError(null);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(error);
          setLocation(defaultLocation);
          setIsLoading(false);
          
          let errorMessage = "Unable to get your location. Using default location.";
          
          if (error.code === 1) {
            errorMessage = "Location access denied. Please enable location services.";
          }
          
          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } catch (err) {
      console.error("Unexpected error getting location:", err);
      setLocation(defaultLocation);
      setIsLoading(false);
      
      toast({
        title: "Location error",
        description: "An unexpected error occurred. Using default location.",
        variant: "destructive"
      });
    }
  };

  // Function to refresh the location
  const refreshLocation = () => {
    getLocation();
  };

  // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  return { location, error, isLoading, refreshLocation };
}
