import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SeatSelectionProps {
  availableSeats: number;
  selectedSeat: string | null;
  onSelectSeat: (seat: string) => void;
  transportType: string;
}

// Generate seat layout based on transport type
const generateSeatLayout = (type: string, availableSeats: number) => {
  const seatStatus: Record<string, 'available' | 'booked' | 'selected'> = {};
  
  // Generate layout based on transport type
  if (type === 'bus') {
    // Bus layout: 4 seats per row, 5 rows (20 seats total)
    const rows = ['A', 'B', 'C', 'D', 'E'];
    
    // Mark some seats as booked for demonstration (20% of seats)
    const totalSeats = rows.length * 4;
    const bookedSeatsCount = Math.floor(totalSeats * 0.2);
    const bookedSeats = new Set<string>();
    
    while (bookedSeats.size < bookedSeatsCount) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      const seatNum = Math.floor(Math.random() * 4) + 1;
      bookedSeats.add(`${row}${seatNum}`);
    }
    
    // Create the seat map
    rows.forEach(row => {
      for (let i = 1; i <= 4; i++) {
        const seatId = `${row}${i}`;
        seatStatus[seatId] = bookedSeats.has(seatId) ? 'booked' : 'available';
      }
    });
  } else if (type === 'train') {
    // Train layout: 6 seats per row, 8 rows (48 seats total)
    const rows = Array.from({ length: 8 }, (_, i) => i + 1);
    
    // Mark some seats as booked
    const bookedSeats = new Set<string>();
    const bookedSeatsCount = Math.floor(48 * 0.3); // 30% seats booked
    
    while (bookedSeats.size < bookedSeatsCount) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A to F
      bookedSeats.add(`${row}${seatLetter}`);
    }
    
    // Create the seat map
    rows.forEach(row => {
      for (let i = 0; i < 6; i++) {
        const seatLetter = String.fromCharCode(65 + i);
        const seatId = `${row}${seatLetter}`;
        seatStatus[seatId] = bookedSeats.has(seatId) ? 'booked' : 'available';
      }
    });
  } else if (type === 'metro') {
    // Metro doesn't usually have assigned seating
    // Instead, provide tickets by count
    for (let i = 1; i <= 5; i++) {
      seatStatus[`T${i}`] = 'available';
    }
  } else if (type === 'flight') {
    // Flight layout: 6 seats per row (2-2-2), 5 rows
    const rows = Array.from({ length: 5 }, (_, i) => i + 1);
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    // Mark some seats as booked
    const bookedSeats = new Set<string>();
    const bookedSeatsCount = Math.floor(30 * 0.4); // 40% seats booked
    
    while (bookedSeats.size < bookedSeatsCount) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      const seatLetter = seatLetters[Math.floor(Math.random() * seatLetters.length)];
      bookedSeats.add(`${row}${seatLetter}`);
    }
    
    // Create the seat map
    rows.forEach(row => {
      seatLetters.forEach(letter => {
        const seatId = `${row}${letter}`;
        seatStatus[seatId] = bookedSeats.has(seatId) ? 'booked' : 'available';
      });
    });
  }
  
  return seatStatus;
};

export default function SeatSelection({ availableSeats, selectedSeat, onSelectSeat, transportType }: SeatSelectionProps) {
  const seatLayout = generateSeatLayout(transportType, availableSeats);
  
  // Update seat layout with selected seat
  if (selectedSeat && seatLayout[selectedSeat] === 'available') {
    seatLayout[selectedSeat] = 'selected';
  }
  
  const handleSeatClick = (seatId: string) => {
    if (seatLayout[seatId] === 'available' || seatLayout[seatId] === 'selected') {
      onSelectSeat(seatId);
    }
  };
  
  // Get seat information description
  const getSeatDescription = (seatId: string) => {
    if (!seatId) return { type: '', position: '' };
    
    let type = '';
    let position = '';
    
    if (transportType === 'bus') {
      const row = seatId.charAt(0);
      const col = parseInt(seatId.charAt(1));
      
      type = row < 'C' ? 'Upper Deck' : 'Lower Deck';
      position = col === 1 || col === 4 ? 'Window Seat' : 'Aisle Seat';
    } else if (transportType === 'train') {
      const row = parseInt(seatId.substring(0, seatId.length - 1));
      const col = seatId.charAt(seatId.length - 1);
      
      type = row % 2 === 0 ? 'Upper Berth' : 'Lower Berth';
      position = (col === 'A' || col === 'F') ? 'Window Seat' : 'Middle/Aisle Seat';
    } else if (transportType === 'metro') {
      type = 'General';
      position = 'Standing/Seating';
    } else if (transportType === 'flight') {
      const col = seatId.charAt(seatId.length - 1);
      
      type = 'Economy';
      position = (col === 'A' || col === 'F') ? 'Window Seat' : 
                (col === 'C' || col === 'D') ? 'Aisle Seat' : 'Middle Seat';
    }
    
    return { type, position };
  };
  
  return (
    <Card className="p-4 bg-white shadow-sm mb-4">
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg font-semibold">
          Select Seats ({availableSeats} available)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Seat map */}
        <div className="border border-slate-200 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-200 rounded mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded mr-1"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-400 rounded mr-1"></div>
                <span>Booked</span>
              </div>
            </div>
            <div className="text-sm text-primary">
              <i className="ri-refresh-line"></i>
            </div>
          </div>
          
          {transportType === 'bus' && (
            <>
              {/* Driver Section */}
              <div className="mb-4 border-b border-slate-200 pb-2">
                <div className="flex justify-end">
                  <div className="w-12 h-8 bg-slate-300 rounded flex items-center justify-center text-xs text-white">
                    <i className="ri-steering-2-fill"></i>
                  </div>
                </div>
              </div>
              
              {/* Seat Grid for Bus */}
              <div className="grid grid-cols-5 gap-2 text-xs">
                {Object.entries(seatLayout).map(([seatId, status]) => {
                  // Create a gap in the middle (corridor)
                  const seatColumn = parseInt(seatId.charAt(1));
                  const includeGap = seatColumn === 2;
                  
                  return (
                    <div key={seatId} className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer
                          ${status === 'available' ? 'bg-slate-200 hover:bg-slate-300' : 
                           status === 'selected' ? 'bg-primary text-white' : 
                           'bg-slate-400 text-white cursor-not-allowed'}`}
                        onClick={() => handleSeatClick(seatId)}
                      >
                        {seatId}
                      </div>
                      {includeGap && <div className="w-2"></div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          
          {transportType === 'train' && (
            <div className="grid grid-cols-6 gap-2 text-xs">
              {Object.entries(seatLayout).map(([seatId, status]) => (
                <div 
                  key={seatId}
                  className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer
                    ${status === 'available' ? 'bg-slate-200 hover:bg-slate-300' : 
                     status === 'selected' ? 'bg-primary text-white' : 
                     'bg-slate-400 text-white cursor-not-allowed'}`}
                  onClick={() => handleSeatClick(seatId)}
                >
                  {seatId}
                </div>
              ))}
            </div>
          )}
          
          {transportType === 'metro' && (
            <div className="flex gap-2 justify-center text-sm">
              {Object.entries(seatLayout).map(([seatId, status]) => (
                <div 
                  key={seatId}
                  className={`w-16 h-10 rounded flex items-center justify-center cursor-pointer
                    ${status === 'available' ? 'bg-slate-200 hover:bg-slate-300' : 
                     status === 'selected' ? 'bg-primary text-white' : 
                     'bg-slate-400 text-white cursor-not-allowed'}`}
                  onClick={() => handleSeatClick(seatId)}
                >
                  Ticket {seatId.substring(1)}
                </div>
              ))}
            </div>
          )}
          
          {transportType === 'flight' && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, rowIndex) => {
                const rowNumber = rowIndex + 1;
                return (
                  <div key={rowNumber} className="flex justify-center">
                    <div className="grid grid-cols-6 gap-1 text-xs">
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => {
                        const seatId = `${rowNumber}${col}`;
                        const status = seatLayout[seatId];
                        
                        // Add aisle gap
                        const isBeforeAisle = col === 'C';
                        const isAfterAisle = col === 'D';
                        
                        return (
                          <div key={seatId} className="flex items-center">
                            <div 
                              className={`w-7 h-7 rounded flex items-center justify-center cursor-pointer
                                ${status === 'available' ? 'bg-slate-200 hover:bg-slate-300' : 
                                 status === 'selected' ? 'bg-primary text-white' : 
                                 'bg-slate-400 text-white cursor-not-allowed'}`}
                              onClick={() => handleSeatClick(seatId)}
                            >
                              {seatId}
                            </div>
                            {isBeforeAisle && <div className="w-4"></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Selected Seat */}
        {selectedSeat && (
          <div className="rounded-lg border border-slate-200 p-3">
            <h4 className="text-sm font-medium mb-2">Selected Seat</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-xs text-white">
                  {selectedSeat}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{getSeatDescription(selectedSeat).position}</div>
                  <div className="text-xs text-slate-500">{getSeatDescription(selectedSeat).type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹120</div>
                <div className="text-xs text-slate-500">incl. taxes</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
