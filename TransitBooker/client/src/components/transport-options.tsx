import { Card, CardContent } from "@/components/ui/card";
import { transportTypes } from "@shared/schema";
import { getProviderIcon, getProviderIconBgColor } from "@/lib/utils";

interface TransportOptionsProps {
  onSelect: (type: string) => void;
}

const transportOptions = [
  {
    type: transportTypes.FLIGHT,
    title: "Flight",
    description: "Domestic & International",
  },
  {
    type: transportTypes.TRAIN,
    title: "Train",
    description: "Indian Railways",
  },
  {
    type: transportTypes.BUS,
    title: "Bus",
    description: "City & Intercity",
  },
  {
    type: transportTypes.METRO,
    title: "Metro",
    description: "Ahmedabad Metro",
  },
];

export default function TransportOptions({ onSelect }: TransportOptionsProps) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-xl font-semibold mb-3 font-heading">Book Tickets</h2>
      <div className="grid grid-cols-2 gap-3">
        {transportOptions.map((option) => (
          <Card 
            key={option.type}
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelect(option.type)}
          >
            <CardContent className="p-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${getProviderIconBgColor(option.type)}`}>
                <i className={`${getProviderIcon(option.type)} text-xl`}></i>
              </div>
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-xs text-slate-500">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
