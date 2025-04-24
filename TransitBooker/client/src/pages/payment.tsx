import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PaymentMethods from "@/components/payment-methods";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

type PaymentMethod = 'upi' | 'card' | 'netbanking';
type UpiApp = 'phonepe' | 'paytm' | 'gpay' | 'other';

export default function Payment() {
  const { bookingId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<UpiApp | null>(null);
  const [upiId, setUpiId] = useState('');
  
  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: [`/api/bookings/${bookingId}`],
  });

  // Handle payment method selection
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Handle UPI app selection
  const handleUpiAppSelect = (app: UpiApp) => {
    setUpiApp(app);
  };

  // Handle pay now
  const handlePayNow = async () => {
    if (!booking) return;
    
    try {
      // In a real app, we would process the payment here
      // For now, just navigate to confirmation
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });
      
      navigate(`/confirmation/${bookingId}`);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 flex items-center">
        <button 
          className="p-1.5 rounded-full hover:bg-primary-dark" 
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <i className="ri-arrow-left-line"></i>
        </button>
        <h1 className="text-lg font-semibold ml-3 font-heading">Payment</h1>
      </div>
      
      {/* Amount Summary */}
      <div className="bg-white p-4 shadow-sm mb-4">
        {isLoading ? (
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : booking ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <h2 className="text-2xl font-bold">₹{booking.totalAmount.toFixed(2)}</h2>
            </div>
            <button className="text-primary text-sm flex items-center">
              <i className="ri-information-line mr-1"></i>
              View Details
            </button>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-slate-500">Booking not found</p>
          </div>
        )}
      </div>
      
      {/* Payment Methods */}
      <PaymentMethods 
        selectedMethod={paymentMethod}
        selectedUpiApp={upiApp}
        upiId={upiId}
        onChangeMethod={handlePaymentMethodChange}
        onSelectUpiApp={handleUpiAppSelect}
        onChangeUpiId={(id) => setUpiId(id)}
      />
      
      {/* Sticky Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button 
          className="w-full py-6"
          onClick={handlePayNow}
          disabled={isLoading || !booking || (paymentMethod === 'upi' && !upiId && !upiApp)}
        >
          Pay {booking ? `₹${booking.totalAmount.toFixed(2)}` : ''}
        </Button>
      </div>
    </div>
  );
}
