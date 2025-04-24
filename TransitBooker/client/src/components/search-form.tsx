import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation as useGeoLocation } from "@/hooks/use-location";

interface SearchFormProps {
  initialValues: {
    source: string;
    destination: string;
    date: string;
    type: string;
  };
  onSearch: (values: SearchFormProps['initialValues']) => void;
  transportType: string;
}

export default function SearchForm({ initialValues, onSearch, transportType }: SearchFormProps) {
  const [values, setValues] = useState(initialValues);
  const { refreshLocation } = useGeoLocation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };
  
  const handleUseCurrentLocation = async () => {
    refreshLocation();
  };
  
  return (
    <Card className="bg-white shadow-sm rounded-b-2xl">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Location */}
          <div className="relative">
            <label className="text-xs text-slate-500 mb-1 block">From</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5">
              <i className="ri-map-pin-2-fill text-pink-500 mr-2"></i>
              <input 
                type="text"
                name="source"
                placeholder="Current Location"
                value={values.source}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent border-none p-0 focus:outline-none"
              />
              <button 
                type="button"
                className="p-1 text-slate-400"
                aria-label="Use current location"
                onClick={handleUseCurrentLocation}
              >
                <i className="ri-navigation-fill"></i>
              </button>
            </div>
          </div>

          {/* To Location */}
          <div className="relative">
            <label className="text-xs text-slate-500 mb-1 block">To</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5">
              <i className="ri-map-pin-line text-primary mr-2"></i>
              <input 
                type="text"
                name="destination"
                placeholder="Destination"
                value={values.destination}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent border-none p-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="relative">
            <label className="text-xs text-slate-500 mb-1 block">Departure Date</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5">
              <i className="ri-calendar-line text-slate-500 mr-2"></i>
              <input 
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent border-none p-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button 
            type="submit"
            className="w-full py-6"
            disabled={!values.destination}
          >
            Search Tickets
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
