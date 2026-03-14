import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * Banner to alert users about MongoDB setup
 * Shows when running in development with fallback data
 */
export default function MongoDBSetupBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only show in development
    setIsDev(process.env.NODE_ENV === 'development');
    
    // Skip health check - using direct DB processing
    // Just show banner if in dev mode and no MongoDB URI
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_MONGODB_URI) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner || !isDev) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b-2 border-amber-400">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-start gap-4">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
        
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">
            ⚠️ MongoDB Not Configured
          </h3>
          <p className="text-sm text-amber-800 mb-3">
            Your application is running with <strong>fallback test data</strong>. 
            To use real data and prepare for production, configure MongoDB:
          </p>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href="/MONGODB_SETUP.md"
              className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
            >
              📖 Setup Guide
            </a>
            
            <a 
              href="https://www.mongodb.com/cloud/atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              🌐 MongoDB Atlas
            </a>
            
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm text-amber-700 hover:text-amber-900 underline"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowBanner(false)}
          className="text-amber-600 hover:text-amber-900 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
