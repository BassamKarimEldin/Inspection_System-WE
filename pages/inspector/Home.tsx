
import React from 'react';
import { User } from '../../types';
import { Server, Wifi } from 'lucide-react';

interface InspectorHomeProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const InspectorHome: React.FC<InspectorHomeProps> = ({ user, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
        <div className="w-24 h-24 bg-te-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-50">
           <div className="w-16 h-16 bg-te-blue rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
             we
           </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Welcome to the Inspection Management System</h1>
        <p className="text-slate-500 mb-10 max-w-lg mx-auto text-lg">
          Hello, <span className="font-bold text-te-blue">{user.name}</span>. Select an action below to get started with your daily tasks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
           <button 
             onClick={() => onNavigate('tdm')}
             className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-slate-200 rounded-2xl hover:border-te-blue hover:bg-blue-50/30 hover:shadow-lg transition-all group duration-300"
           >
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-te-blue group-hover:scale-110 transition-all duration-300 shadow-sm">
               <Server className="text-te-blue group-hover:text-white" size={32} />
             </div>
             <span className="text-xl font-bold text-slate-700 group-hover:text-te-blue">New TDM Inspection</span>
             <span className="text-sm text-slate-400 mt-2">Copper Network & MSANs</span>
           </button>

           <button 
             onClick={() => onNavigate('ftth')}
             className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-slate-200 rounded-2xl hover:border-te-magenta hover:bg-pink-50/30 hover:shadow-lg transition-all group duration-300"
           >
             <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-te-magenta group-hover:scale-110 transition-all duration-300 shadow-sm">
               <Wifi className="text-te-magenta group-hover:text-white" size={32} />
             </div>
             <span className="text-xl font-bold text-slate-700 group-hover:text-te-magenta">New FTTH Inspection</span>
             <span className="text-sm text-slate-400 mt-2">Fiber Cabinets & Boxes</span>
           </button>
        </div>
      </div>
    </div>
  );
};
