
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, LayoutDashboard, FileText, MapPin, Users, Menu, X, ShieldCheck, Server, Wifi, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const SidebarItem = ({ icon: Icon, label, onClick, active }: { icon: any, label: string, onClick?: () => void, active?: boolean }) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
      active ? 'bg-te-dark text-white shadow-md border-l-4 border-te-accent' : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-te-light overflow-hidden font-sans" dir="ltr"> {/* Using LTR for code, but typically this would be RTL for Egypt */}
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-te-blue transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20 overflow-hidden relative`}
      >
        <div 
          onClick={() => onNavigate('dashboard')}
          className="p-6 flex flex-col items-center border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-inner relative overflow-hidden">
             {/* WE Logo Simulation */}
             <div className="absolute inset-0 bg-[#5C2D91] rounded-full m-1 flex items-center justify-center">
                 <span className="text-white font-bold text-2xl lowercase tracking-tighter" style={{ fontFamily: 'sans-serif' }}>we</span>
             </div>
          </div>
          <h1 className="text-white font-bold text-lg text-center leading-tight">telecom egypt<br/><span className="text-xs font-normal opacity-75">Inspection System</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-3">Menu</div>
          
          <SidebarItem 
            icon={LayoutDashboard} 
            label={user.role === UserRole.ADMIN ? "Dashboard" : "Home"} 
            onClick={() => onNavigate('dashboard')} 
            active={currentView === 'dashboard'} 
          />
          
          {user.role === UserRole.INSPECTOR && (
            <>
               <SidebarItem 
                 icon={FileText} 
                 label="New TDM Inspection" 
                 onClick={() => onNavigate('tdm')} 
                 active={currentView === 'tdm'} 
               />
               <SidebarItem 
                 icon={FileText} 
                 label="New FTTH Inspection" 
                 onClick={() => onNavigate('ftth')} 
                 active={currentView === 'ftth'} 
               />
               <SidebarItem 
                 icon={ShieldCheck} 
                 label="My Submissions" 
                 onClick={() => onNavigate('submissions')} 
                 active={currentView === 'submissions'} 
               />
            </>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <SidebarItem 
                icon={Users} 
                label="User Management" 
                onClick={() => onNavigate('users')} 
                active={currentView === 'users'} 
              />
              
              {/* Network Infrastructure Section */}
              <div className="pt-4 pb-1 px-3 text-xs font-bold text-white/40 uppercase tracking-wider">Exchange Centers</div>
              
              <SidebarItem 
                icon={Server} 
                label="TDM Exchanges" 
                onClick={() => onNavigate('centers_tdm')} 
                active={currentView === 'centers_tdm'} 
              />
              <SidebarItem 
                icon={Wifi} 
                label="FTTH Exchanges" 
                onClick={() => onNavigate('centers_ftth')} 
                active={currentView === 'centers_ftth'} 
              />
              
              <div className="pt-4 pb-1 px-3 text-xs font-bold text-white/40 uppercase tracking-wider">System</div>
              <SidebarItem 
                icon={FileText} 
                label="Reports & Audit" 
                onClick={() => onNavigate('reports')} 
                active={currentView === 'reports'} 
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 bg-te-dark/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-te-accent flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/60 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500 text-red-100 p-2 rounded transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-te-blue focus:outline-none"
          >
            {sidebarOpen ? <Menu size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center space-x-4">
             <span className="text-xs font-medium text-slate-400">System v1.0.0</span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-te-light p-6 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          <footer className="mt-10 pt-6 border-t border-slate-200/60 text-center">
             <p className="text-xs text-slate-400">
               Powered by <a href="mailto:bassam.kareem@te.eg" className="text-te-blue hover:text-te-dark font-medium transition-colors">Bassam Kareem</a> © 2025
             </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
