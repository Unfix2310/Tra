import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2).replace(/\.00$/, '')}`;
}

export function formatTime(time: string): string {
  if (!time) return '';
  
  // If already in 12-hour format (e.g., "9:05 AM"), return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }
  
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // If date is invalid, return empty string
  if (isNaN(d.getTime())) return '';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = d.getDate() === today.getDate() && 
                 d.getMonth() === today.getMonth() && 
                 d.getFullYear() === today.getFullYear();
  
  const isTomorrow = d.getDate() === tomorrow.getDate() && 
                    d.getMonth() === tomorrow.getMonth() && 
                    d.getFullYear() === tomorrow.getFullYear();
  
  if (isToday) {
    return `Today, ${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  } else if (isTomorrow) {
    return `Tomorrow, ${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  } else {
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  }
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

export function generateBookingId(): string {
  const prefix = "GJ";
  const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${prefix}${randomDigits}`;
}

export function getProviderIcon(type: string): string {
  switch (type) {
    case 'bus':
      return 'ri-bus-2-line';
    case 'metro':
      return 'ri-subway-line';
    case 'train':
      return 'ri-train-line';
    case 'flight':
      return 'ri-flight-takeoff-line';
    default:
      return 'ri-bus-2-line';
  }
}

export function getProviderIconBgColor(type: string): string {
  switch (type) {
    case 'bus':
      return 'bg-green-100 text-green-600';
    case 'metro':
      return 'bg-purple-100 text-purple-600';
    case 'train':
      return 'bg-orange-100 text-orange-600';
    case 'flight':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-blue-100 text-blue-600';
  }
}
