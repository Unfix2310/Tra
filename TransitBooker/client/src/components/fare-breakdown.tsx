import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface FareBreakdownProps {
  baseFare: number;
  className?: string;
}

export default function FareBreakdown({ baseFare, className = '' }: FareBreakdownProps) {
  // Calculate fare components
  const gstRate = 0.05; // 5% GST
  const serviceCharge = Math.ceil(baseFare * 0.04); // 4% service charge, rounded up
  const gstAmount = Math.ceil(baseFare * gstRate);
  const totalAmount = baseFare + gstAmount + serviceCharge;
  
  return (
    <Card className={`p-4 bg-white shadow-sm mb-24 ${className}`}>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg font-semibold">Fare Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span>Base Fare</span>
            <span>{formatCurrency(baseFare)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>GST (5%)</span>
            <span>{formatCurrency(gstAmount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Service Charge</span>
            <span>{formatCurrency(serviceCharge)}</span>
          </div>
        </div>
        
        <div className="flex justify-between font-semibold pt-3 border-t border-slate-200">
          <span>Total Amount</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
