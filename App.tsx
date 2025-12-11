
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole, Inspection, LoginEvent, TDMInventoryItem, FTTHInventoryItem } from './types';
import { AdminDashboard } from './pages/admin/Dashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { ExchangeCenterList } from './pages/admin/ExchangeCenters';
import { Reports } from './pages/admin/Reports';
import { TDMInspectionForm, FTTHInspectionForm } from './pages/inspector/Forms';
import { SubmissionsList } from './pages/inspector/Submissions';
import { InspectorHome } from './pages/inspector/Home';
import { LoginScreen } from './pages/auth/Login';
import { MOCK_INSPECTIONS, MOCK_LOGIN_EVENTS, MOCK_USERS, MOCK_TDM_INVENTORY, MOCK_FTTH_INVENTORY, MOCK_CENTERS } from './constants';

// Main App Router Logic
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('dashboard');

  // Lifted State for persistence
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>(MOCK_LOGIN_EVENTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Inventory State (Interactable)
  const [tdmInventory, setTdmInventory] = useState<TDMInventoryItem[]>(MOCK_TDM_INVENTORY);
  const [ftthInventory, setFtthInventory] = useState<FTTHInventoryItem[]>(MOCK_FTTH_INVENTORY);

  const handleLogin = (u: User, location?: {lat: number, lng: number, address: string}) => {
    setUser(u);
    setView('dashboard'); // Redirect both Admin and Inspector to their Dashboard/Home

    const newEvent: LoginEvent = {
        id: `le-${Date.now()}`,
        userId: u.id,
        userName: u.name,
        userRole: u.role,
        timestamp: new Date().toLocaleString(),
        lat: location?.lat || null,
        lng: location?.lng || null,
        address: location?.address || undefined,
        status: location ? 'provided' : 'denied'
    };

    setLoginEvents([newEvent, ...loginEvents]);
    
    setUsers(users.map(existingUser => 
        existingUser.id === u.id 
            ? { ...existingUser, lastLogin: newEvent.timestamp } 
            : existingUser
    ));
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
  };

  const handleNewSubmission = (newInspection: Inspection) => {
      // 1. Add inspection
      setInspections([newInspection, ...inspections]);
      
      // 2. Update FTTH Inventory Status
      if (newInspection.type === 'FTTH_BOX' || newInspection.type === 'FTTH_CABINET') {
          setFtthInventory(prev => prev.map(item => {
              if (
                  item.boxNumber === newInspection.data.boxNumber && 
                  item.passiveCabinet === newInspection.data.passiveCabinet
              ) {
                  return { ...item, visitStatus: 'Done' };
              }
              return item;
          }));
      }

      // 3. Update TDM Inventory Status
      if (newInspection.type === 'TDM') {
          const center = MOCK_CENTERS.find(c => c.id === newInspection.centerId);
          if (center) {
              setTdmInventory(prev => {
                  const newInv = [...prev];
                  const targetIndex = newInv.findIndex(i => i.visitStatus === 'Pending');
                  if (targetIndex !== -1) {
                      newInv[targetIndex] = { ...newInv[targetIndex], visitStatus: 'Done' };
                  }
                  return newInv;
              });
          }
      }
      
      setView('submissions');
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} users={users} />;
  }

  const userInspections = user.role === UserRole.INSPECTOR 
    ? inspections.filter(i => i.inspectorId === user.id)
    : inspections;

  return (
    <Layout user={user} onLogout={handleLogout} currentView={view} onNavigate={setView}>
        {user.role === UserRole.ADMIN && (
            <>
                {view === 'dashboard' && (
                    <AdminDashboard 
                        loginEvents={loginEvents} 
                        tdmInventory={tdmInventory}
                        ftthInventory={ftthInventory}
                        users={users}
                    />
                )}
                {view === 'users' && <UserManagement users={users} setUsers={setUsers} />}
                {view === 'centers_tdm' && <ExchangeCenterList filterType="TDM" data={tdmInventory} />}
                {view === 'centers_ftth' && <ExchangeCenterList filterType="FTTH" data={ftthInventory} />}
                {view === 'reports' && (
                    <Reports 
                        tdmInventory={tdmInventory}
                        ftthInventory={ftthInventory}
                        users={users}
                        inspections={inspections}
                        loginEvents={loginEvents}
                    />
                )}
            </>
        )}

        {user.role === UserRole.INSPECTOR && (
            <>
                {view === 'dashboard' && <InspectorHome user={user} onNavigate={setView} />}
                {view === 'tdm' && <TDMInspectionForm currentUser={user} onSubmit={handleNewSubmission} />}
                {view === 'ftth' && <FTTHInspectionForm currentUser={user} onSubmit={handleNewSubmission} />}
                {view === 'submissions' && <SubmissionsList inspections={userInspections} />}
            </>
        )}
    </Layout>
  );
};

export default App;
