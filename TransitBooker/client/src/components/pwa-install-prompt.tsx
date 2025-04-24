import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PwaInstallPromptProps {
  onDismiss: () => void;
}

export default function PwaInstallPrompt({ onDismiss }: PwaInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Add event listener for beforeinstallprompt
  useState(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  });
  
  // Handle install button click
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    
    // Dismiss the prompt regardless of outcome
    onDismiss();
  };
  
  return (
    <Card className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 text-white">
              <i className="ri-apps-line"></i>
            </div>
            <div>
              <h3 className="font-medium">Install App</h3>
              <p className="text-xs text-slate-500">Add to your home screen for better experience</p>
            </div>
          </div>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="text-slate-500 mr-2"
            >
              Later
            </Button>
            <Button size="sm" onClick={handleInstall}>
              Install
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
