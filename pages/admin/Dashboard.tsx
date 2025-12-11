import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { MOCK_CENTERS } from '../../constants';
import { LoginEvent, TDMInventoryItem, FTTHInventoryItem, User } from '../../types';
import { Users, MapPin, CheckCircle, Clock, Server, Wifi, Activity } from 'lucide-react';

// Updated colors: WE Purple, WE Magenta, Success Green, Pending Gray
const COLORS = {
  purple: '#5C2D91',
  magenta: '#E6007E',
  green: '#10B981',
  gray: '#E5E7EB',
  pending: '#FCD34D'
};

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1 duration-200">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

interface DashboardProps {
  loginEvents: LoginEvent[];
  tdmInventory: TDMInventoryItem[];
  ftthInventory: FTTHInventoryItem[];
  users: User[];
}

export const AdminDashboard: React.FC<DashboardProps> = ({ loginEvents, tdmInventory, ftthInventory, users }) => {
  
  // --- Data Aggregation Logic ---

  // 1. TDM Stats by Region (Total, Done, Pending)
  const tdmStats = useMemo(() => {
    const regionMap: Record<string, { name: string, done: number, pending: number, total: number }> = {};
    
    tdmInventory.forEach(item => {
        const region = item.region || 'Unknown';
        if (!regionMap[region]) {
            regionMap[region] = { name: region.replace('Telephones Zone', '').trim(), done: 0, pending: 0, total: 0 };
        }
        regionMap[region].total += 1;
        if (item.visitStatus === 'Done') regionMap[region].done += 1;
        else regionMap[region].pending += 1;
    });
    
    return Object.values(regionMap).sort((a,b) => b.total - a.total); // Sort by highest volume
  }, [tdmInventory]);

  // 2. FTTH Stats by Region (Total, Done, Pending)
  const ftthStats = useMemo(() => {
    const regionMap: Record<string, { name: string, done: number, pending: number, total: number }> = {};
    
    ftthInventory.forEach(item => {
        const region = item.region || 'Unknown';
        if (!regionMap[region]) {
            regionMap[region] = { name: region.replace('Telephones Zone', '').trim(), done: 0, pending: 0, total: 0 };
        }
        regionMap[region].total += 1;
        if (item.visitStatus === 'Done') regionMap[region].done += 1;
        else regionMap[region].pending += 1;
    });

    return Object.values(regionMap).sort((a,b) => b.total - a.total);
  }, [ftthInventory]);

  // 3. User Login Activity per Day
  const loginActivity = useMemo(() => {
    const dateMap: Record<string, number> = {};
    // Sort events by date first
    const sortedEvents = [...loginEvents].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    sortedEvents.forEach(event => {
        const date = new Date(event.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap).map(([name, count]) => ({ name, count }));
  }, [loginEvents]);

  // Totals for KPI Cards
  const totalTDM = tdmInventory.length;
  const totalFTTH = ftthInventory.length;
  const tdmDone = tdmInventory.filter(i => i.visitStatus === 'Done').length;
  const ftthDone = ftthInventory.filter(i => i.visitStatus === 'Done').length;
  const overallProgress = totalTDM + totalFTTH > 0 ? Math.round(((tdmDone + ftthDone) / (totalTDM + totalFTTH)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-600 text-sm hover:bg-slate-50">Download CSV</button>
            <button className="px-4 py-2 bg-te-blue text-white rounded shadow-sm text-sm hover:bg-te-dark">Generate Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory" value={totalTDM + totalFTTH} icon={Server} color="bg-te-blue" />
        <StatCard title="Overall Progress" value={`${overallProgress}%`} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Active Centers" value={MOCK_CENTERS.length} icon={MapPin} color="bg-te-accent" />
        <StatCard title="User Activity (Today)" value={loginEvents.length} icon={Activity} color="bg-orange-400" />
      </div>

      {/* Charts Row 1: Status By Technology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TDM Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Server className="mr-2 text-te-blue" size={20} />
                  TDM Inspection Status
              </h3>
              <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded">By Region</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tdmStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="done" name="Visited" stackId="a" fill={COLORS.green} radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill={COLORS.gray} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FTTH Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Wifi className="mr-2 text-te-magenta" size={20} />
                  FTTH Inspection Status
              </h3>
              <span className="text-xs font-semibold bg-pink-50 text-pink-700 px-2 py-1 rounded">By Region</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ftthStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="done" name="Visited" stackId="a" fill={COLORS.green} radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill={COLORS.gray} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Login Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Users className="mr-2 text-orange-500" size={20} />
                  User Login Activity
              </h3>
              <span className="text-xs text-slate-500">Last 7 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loginActivity}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5C2D91" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5C2D91" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#5C2D91" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Recent Login Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Login Events</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium">Timestamp</th>
                        <th className="px-6 py-3 font-medium">Location Status</th>
                        <th className="px-6 py-3 font-medium">Location Address</th>
                        <th className="px-6 py-3 font-medium">Coordinates</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loginEvents.slice(0, 5).map((event) => (
                         <tr key={event.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium text-slate-800">{event.userName}</td>
                            <td className="px-6 py-3 text-slate-500">{event.userRole}</td>
                            <td className="px-6 py-3 text-slate-500">{event.timestamp}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'provided' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {event.status === 'provided' ? 'Provided' : 'Denied'}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-slate-600 text-xs max-w-[150px] truncate" title={event.address}>
                                <div className="flex items-center">
                                    <MapPin size={12} className="mr-1 text-slate-400" />
                                    {event.address || 'Unknown Location'}
                                </div>
                            </td>
                            <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                                {event.lat ? `${event.lat.toFixed(4)}, ${event.lng?.toFixed(4)}` : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};