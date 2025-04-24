import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useRegisterSW } from "./lib/pwa";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Booking from "@/pages/booking";
import TripDetails from "@/pages/trip-details";
import Payment from "@/pages/payment";
import Confirmation from "@/pages/confirmation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/booking/:type" component={Booking} />
      <Route path="/trip/:routeId/:scheduleId" component={TripDetails} />
      <Route path="/payment/:bookingId" component={Payment} />
      <Route path="/confirmation/:bookingId" component={Confirmation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Register service worker for PWA
  useRegisterSW();

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased">
            <div className="flex-1 overflow-hidden flex flex-col">
              <Toaster />
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
