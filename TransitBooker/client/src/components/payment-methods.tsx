import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PaymentMethodsProps {
  selectedMethod: 'upi' | 'card' | 'netbanking';
  selectedUpiApp: 'phonepe' | 'paytm' | 'gpay' | 'other' | null;
  upiId: string;
  onChangeMethod: (method: 'upi' | 'card' | 'netbanking') => void;
  onSelectUpiApp: (app: 'phonepe' | 'paytm' | 'gpay' | 'other') => void;
  onChangeUpiId: (id: string) => void;
}

export default function PaymentMethods({
  selectedMethod,
  selectedUpiApp,
  upiId,
  onChangeMethod,
  onSelectUpiApp,
  onChangeUpiId
}: PaymentMethodsProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Handle UPI verification
  const handleVerifyUpi = () => {
    if (!upiId) return;
    
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
    }, 1000);
  };
  
  return (
    <>
      {/* Payment Methods */}
      <Card className="bg-white p-4 shadow-sm mb-4">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 space-y-3">
          {/* UPI */}
          <div 
            className={`border rounded-lg p-3 relative cursor-pointer ${
              selectedMethod === 'upi' ? 'border-primary' : 'border-slate-200'
            }`}
            onClick={() => onChangeMethod('upi')}
          >
            {selectedMethod === 'upi' && (
              <div className="absolute right-3 top-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-xs"></i>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-bank-card-line text-primary text-xl"></i>
              </div>
              <div>
                <h4 className="font-medium">UPI</h4>
                <p className="text-xs text-slate-500">Pay using any UPI app</p>
              </div>
            </div>
          </div>
          
          {/* Credit/Debit Card */}
          <div 
            className={`border rounded-lg p-3 relative cursor-pointer ${
              selectedMethod === 'card' ? 'border-primary' : 'border-slate-200'
            }`}
            onClick={() => onChangeMethod('card')}
          >
            {selectedMethod === 'card' && (
              <div className="absolute right-3 top-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-xs"></i>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-bank-card-2-line text-slate-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-medium">Credit/Debit Card</h4>
                <p className="text-xs text-slate-500">All major cards accepted</p>
              </div>
            </div>
          </div>
          
          {/* Net Banking */}
          <div 
            className={`border rounded-lg p-3 relative cursor-pointer ${
              selectedMethod === 'netbanking' ? 'border-primary' : 'border-slate-200'
            }`}
            onClick={() => onChangeMethod('netbanking')}
          >
            {selectedMethod === 'netbanking' && (
              <div className="absolute right-3 top-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-xs"></i>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-building-line text-slate-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-medium">Net Banking</h4>
                <p className="text-xs text-slate-500">All Indian banks supported</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* UPI Options - only show if UPI is selected */}
      {selectedMethod === 'upi' && (
        <Card className="bg-white p-4 shadow-sm mb-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg font-semibold">Select UPI App</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  selectedUpiApp === 'phonepe' ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => onSelectUpiApp('phonepe')}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                  <i className="ri-smartphone-line text-purple-600"></i>
                </div>
                <span className="text-xs">PhonePe</span>
              </div>
              
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  selectedUpiApp === 'paytm' ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => onSelectUpiApp('paytm')}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                  <i className="ri-smartphone-line text-green-600"></i>
                </div>
                <span className="text-xs">Paytm</span>
              </div>
              
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  selectedUpiApp === 'gpay' ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => onSelectUpiApp('gpay')}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                  <i className="ri-google-line text-blue-600"></i>
                </div>
                <span className="text-xs">GPay</span>
              </div>
              
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  selectedUpiApp === 'other' ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => onSelectUpiApp('other')}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-1">
                  <i className="ri-more-line text-slate-600"></i>
                </div>
                <span className="text-xs">More</span>
              </div>
            </div>
            
            {/* UPI ID Input */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Enter UPI ID</label>
              <div className="flex">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => onChangeUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="flex-1 border border-slate-200 rounded-l-lg px-3 py-2.5 focus:outline-none focus:border-primary"
                />
                <Button 
                  className="rounded-l-none"
                  onClick={handleVerifyUpi}
                  disabled={!upiId || isVerifying}
                >
                  {isVerifying ? (
                    <i className="ri-loader-4-line animate-spin mr-1"></i>
                  ) : 'Verify'}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Enter your UPI ID in the format: mobilenumber@upi</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card Form - only show if card is selected */}
      {selectedMethod === 'card' && (
        <Card className="bg-white p-4 shadow-sm mb-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg font-semibold">Card Details</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
                />
              </div>
              
              <div>
                <label className="text-xs text-slate-500 mb-1 block">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Net Banking Form - only show if netbanking is selected */}
      {selectedMethod === 'netbanking' && (
        <Card className="bg-white p-4 shadow-sm mb-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg font-semibold">Select Bank</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="border border-slate-200 rounded-lg p-3 flex items-center cursor-pointer hover:border-primary">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <i className="ri-bank-fill text-blue-600"></i>
                </div>
                <span className="text-sm">SBI</span>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-3 flex items-center cursor-pointer hover:border-primary">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <i className="ri-bank-fill text-blue-600"></i>
                </div>
                <span className="text-sm">HDFC</span>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-3 flex items-center cursor-pointer hover:border-primary">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <i className="ri-bank-fill text-blue-600"></i>
                </div>
                <span className="text-sm">ICICI</span>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-3 flex items-center cursor-pointer hover:border-primary">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <i className="ri-bank-fill text-blue-600"></i>
                </div>
                <span className="text-sm">Axis</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Other Banks</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary">
                <option value="">Select Bank</option>
                <option value="bob">Bank of Baroda</option>
                <option value="canara">Canara Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="idfc">IDFC First Bank</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
