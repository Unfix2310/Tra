import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PassengerDetailsProps {
  values: {
    name: string;
    phone: string;
    email: string;
  };
  onChange: (values: PassengerDetailsProps['values']) => void;
}

export default function PassengerDetails({ values, onChange }: PassengerDetailsProps) {
  const [formValues, setFormValues] = useState(values);
  
  // Update form values when props change
  useEffect(() => {
    setFormValues(values);
  }, [values]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    
    setFormValues(updatedValues);
    onChange(updatedValues);
  };
  
  return (
    <Card className="p-4 bg-white shadow-sm mb-4">
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg font-semibold">Passenger Details</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 space-y-3">
        <div>
          <Label htmlFor="name" className="text-xs text-slate-500 mb-1 block">
            Full Name
          </Label>
          <input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter passenger name"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-xs text-slate-500 mb-1 block">
            Mobile Number
          </Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
            pattern="[0-9]{10}"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-xs text-slate-500 mb-1 block">
            Email (Optional)
          </Label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
