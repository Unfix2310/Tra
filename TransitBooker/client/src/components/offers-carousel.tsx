import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Offer } from "@shared/schema";

interface OffersCarouselProps {
  offers: Offer[];
}

export default function OffersCarousel({ offers }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll every 5 seconds
  useEffect(() => {
    if (offers.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [offers.length]);
  
  // Handle touch events for manual swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (offers.length <= 1) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // Minimum swipe distance: 50px
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right
        setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
      } else {
        // Swipe left
        setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
      }
    }
  };
  
  // If no offers, render empty state
  if (offers.length === 0) {
    return (
      <Card className="rounded-xl overflow-hidden shadow-md mb-5 bg-white">
        <CardContent className="p-0">
          <div className="h-32 flex items-center justify-center">
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="relative rounded-xl overflow-hidden shadow-md mb-5 bg-white">
      <CardContent className="p-0">
        <div 
          ref={carouselRef}
          className="relative w-full h-32 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {offers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
                index === currentIndex ? 'translate-x-0' : 
                index < currentIndex ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className="relative w-full h-full">
                {/* Background Image - using offer.imageUrl if available or background color if not */}
                {offer.imageUrl ? (
                  <img 
                    src={offer.imageUrl} 
                    alt={offer.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary to-blue-400"></div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent p-4 flex flex-col justify-between">
                  <div className="flex items-center">
                    <span className="bg-white text-pink-500 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {offer.discount ? `${offer.discount}% OFF` : 'OFFER'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg font-heading">{offer.title}</h3>
                    <p className="text-white text-sm">{offer.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dots Indicator */}
        {offers.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {offers.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white opacity-100' : 'bg-white opacity-50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
