import { useState, useEffect } from "react";
import { useLocation, useParams, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLocation as useGeoLocation } from "@/hooks/use-location";
import SearchForm from "@/components/search-form";
import SearchResults from "@/components/search-results";
import { transportTypes } from "@shared/schema";
import { getTodayDate } from "@/lib/utils";

// Default search parameters
const initialSearchParams = {
  source: "Ahmedabad",
  destination: "",
  date: getTodayDate(),
  type: transportTypes.BUS
};

export default function Booking() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { location } = useGeoLocation();
  
  // Check if the transport type is valid
  const transportType = Object.values(transportTypes).includes(params.type as any) 
    ? params.type as keyof typeof transportTypes 
    : transportTypes.BUS;
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    ...initialSearchParams,
    type: transportType,
    source: location?.city || initialSearchParams.source
  });
  
  // State for whether a search has been performed
  const [hasSearched, setHasSearched] = useState(false);
  
  // Update source when location changes
  useEffect(() => {
    if (location?.city) {
      setSearchParams(prev => ({
        ...prev,
        source: location.city
      }));
    }
  }, [location]);
  
  // Update type when route param changes
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      type: transportType
    }));
  }, [transportType]);
  
  // Search for routes when form is submitted
  const { data: searchResults, isLoading } = useQuery({
    queryKey: [
      '/api/routes/search', 
      searchParams.source, 
      searchParams.destination, 
      searchParams.type, 
      searchParams.date
    ],
    enabled: hasSearched && !!searchParams.destination,
  });
  
  // Handle form submission
  const handleSearch = (formData: typeof searchParams) => {
    setSearchParams(formData);
    setHasSearched(true);
  };
  
  // Handle trip selection
  const handleSelectTrip = (routeId: number, scheduleId: number) => {
    navigate(`/trip/${routeId}/${scheduleId}`);
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="px-4 py-3 flex items-center">
          <button 
            className="p-1.5 rounded-full hover:bg-primary-dark" 
            aria-label="Go back"
            onClick={() => navigate('/')}
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <h1 className="text-lg font-semibold ml-3 font-heading">
            {transportType.charAt(0).toUpperCase() + transportType.slice(1)} Booking
          </h1>
        </div>
        
        {/* Tabs */}
        <div className="flex text-sm text-white/80">
          <button className="flex-1 py-3 relative text-white font-medium">
            Outward
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
          </button>
          <button className="flex-1 py-3 relative opacity-70">
            Return (Optional)
          </button>
        </div>
      </div>
      
      {/* Search Form */}
      <SearchForm 
        initialValues={searchParams}
        onSearch={handleSearch}
        transportType={transportType}
      />
      
      {/* Search Results */}
      {hasSearched && (
        <SearchResults 
          results={searchResults || []}
          isLoading={isLoading}
          onSelect={handleSelectTrip}
        />
      )}
    </div>
  );
}
