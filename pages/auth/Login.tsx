
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (u: User, location?: {lat: number, lng: number, address: string}) => void;
  users?: User[]; // Accept users list from App
}

// Function to convert Coordinates to Address using OpenStreetMap (Nominatim)
const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        if (data && data.address) {
            const { road, city, town, village, state, country } = data.address;
            const cityLoc = city || town || village || state || '';
            const streetLoc = road || '';
            
            // Construct address string: "Egypt, Cairo, Ramsis St"
            return [country, cityLoc, streetLoc].filter(Boolean).join(', ');
        }
        return `Unknown Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'success' | 'denied'>('idle');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  // Simulate Geo capture on mount
  useEffect(() => {
    setGeoStatus('locating');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
          });
          setGeoStatus('success');
        },
        (err) => {
            console.error(err);
            setGeoStatus('denied');
        }
      );
    } else {
        setGeoStatus('denied');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Small artificial delay for UX (spinner)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Authenticate against the dynamic user list passed from App, or fallback empty array
    const userList = users || [];
    const user = userList.find(u => u.username === username);
    
    // Check password (fallback to 'password' if undefined in legacy mock data)
    const validPassword = user && (password === (user.password || 'password'));
    
    if (user && validPassword) {
        if (user.status === 'inactive') {
            setError('Account is inactive. Contact Admin.');
            setLoading(false);
            return;
        }

        let locationData;
        
        if (coords) {
            // Fetch real address
            const realAddress = await fetchAddress(coords.lat, coords.lng);
            
            locationData = {
                lat: coords.lat,
                lng: coords.lng,
                address: realAddress
            };
        }
        
        onLogin(user, locationData);
    } else {
        setError('Invalid credentials');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#37004B] to-[#5C2D91] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#5C2D91] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 skew-y-6 transform origin-bottom-left"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg p-1">
                     <div className="w-full h-full bg-[#5C2D91] rounded-full flex items-center justify-center">
                         <span className="text-white font-bold text-3xl lowercase tracking-tighter" style={{ fontFamily: 'sans-serif' }}>we</span>
                     </div>
                </div>
                <h1 className="text-white text-xl font-bold">telecom egypt</h1>
                <p className="text-blue-100 text-sm opacity-80">Inspection Management System</p>
            </div>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded flex items-center">
                        <AlertTriangle size={16} className="mr-2" /> {error}
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-te-blue focus:border-transparent outline-none"
                        placeholder="e.g. admin"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-te-blue focus:border-transparent outline-none"
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-slate-400 mt-1">Hint: use 'password'</p>
                </div>

                {/* Geo Status Indicator */}
                <div className={`text-xs p-2 rounded border flex items-center ${
                    geoStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
                    geoStatus === 'denied' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                    <MapPin size={12} className="mr-2" />
                    {geoStatus === 'locating' && 'Acquiring GPS Signal...'}
                    {geoStatus === 'success' && 'Location Secured'}
                    {geoStatus === 'denied' && 'Location Access Denied (Audit Logged)'}
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#5C2D91] hover:bg-[#37004B] text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex justify-center items-center"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : 'Secure Login'}
                </button>
            </form>
            <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Restricted Access • IP Logged • v1.0</p>
                <p className="text-xs text-slate-400">
                    Powered by <a href="mailto:bassam.kareem@te.eg" className="text-[#5C2D91] hover:underline font-medium">Bassam Kareem</a> © 2025
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
