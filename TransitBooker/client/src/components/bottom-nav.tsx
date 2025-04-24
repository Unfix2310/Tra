import { useLocation } from "wouter";

export default function BottomNav() {
  const [location, navigate] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white py-3 px-4 shadow-lg border-t border-slate-100">
      <div className="flex justify-between">
        <a 
          href="#" 
          className={`flex flex-col items-center px-3 py-1 relative ${
            location === '/' 
              ? 'text-primary font-medium' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          {location === '/' && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          )}
          <i className={`${location === '/' ? 'ri-home-5-fill' : 'ri-home-5-line'} text-xl`}></i>
          <span className="text-xs mt-1 font-medium">Home</span>
        </a>
        
        <a 
          href="#" 
          className={`flex flex-col items-center px-3 py-1 relative ${
            location === '/explore' 
              ? 'text-primary font-medium' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate('/explore');
          }}
        >
          {location === '/explore' && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          )}
          <i className={`${location === '/explore' ? 'ri-map-2-fill' : 'ri-map-2-line'} text-xl`}></i>
          <span className="text-xs mt-1 font-medium">Explore</span>
        </a>
        
        <a 
          href="#" 
          className={`flex flex-col items-center px-3 py-1 relative ${
            location === '/tickets' 
              ? 'text-primary font-medium' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate('/tickets');
          }}
        >
          {location === '/tickets' && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          )}
          <i className={`${location === '/tickets' ? 'ri-ticket-2-fill' : 'ri-ticket-2-line'} text-xl`}></i>
          <span className="text-xs mt-1 font-medium">My Tickets</span>
        </a>
        
        <a 
          href="#" 
          className={`flex flex-col items-center px-3 py-1 relative ${
            location === '/profile' 
              ? 'text-primary font-medium' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate('/profile');
          }}
        >
          {location === '/profile' && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          )}
          <i className={`${location === '/profile' ? 'ri-user-3-fill' : 'ri-user-3-line'} text-xl`}></i>
          <span className="text-xs mt-1 font-medium">Profile</span>
        </a>
      </div>
    </nav>
  );
}
