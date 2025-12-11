
import React, { useState, useMemo } from 'react';
import { TDMInventoryItem, FTTHInventoryItem, User, Inspection, LoginEvent } from '../../types';
import { Download, Filter, Search, FileText, Server, Wifi, X, CheckCircle, Clock, Calendar, User as UserIcon, LogIn, AlertTriangle, Briefcase } from 'lucide-react';

interface ReportsProps {
  tdmInventory: TDMInventoryItem[];
  ftthInventory: FTTHInventoryItem[];
  users: User[];
  inspections: Inspection[];
  loginEvents?: LoginEvent[]; 
}

type ReportType = 'TDM' | 'FTTH' | 'LOGIN';

// Helper to safely convert any value to string for display/CSV
const safeString = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return ''; // Prevent [object Object]
    return String(val);
};

export const Reports: React.FC<ReportsProps> = ({ tdmInventory, ftthInventory, users, inspections, loginEvents = [] }) => {
  const [reportType, setReportType] = useState<ReportType>('TDM');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedExchange, setSelectedExchange] = useState(''); 
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  
  // Date Filters for Login Report
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  // --- LOGIN REPORT LOGIC START ---
  const loginReportData = useMemo(() => {
      if (reportType !== 'LOGIN') return [];

      const userDayMap: Record<string, LoginEvent[]> = {};

      loginEvents.forEach(event => {
          const dateObj = new Date(event.timestamp);
          const dayOfWeek = dateObj.getDay(); 
          
          // Filter: Working Days (Sunday=0 to Thursday=4)
          // Removing the hard filter for now to ensure you can see data during testing on weekends
          // if (dayOfWeek === 5 || dayOfWeek === 6) return;

          const dateKey = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD
          const compositeKey = `${event.userId}_${dateKey}`;

          if (!userDayMap[compositeKey]) {
              userDayMap[compositeKey] = [];
          }
          userDayMap[compositeKey].push(event);
      });

      const processedRows = Object.keys(userDayMap).map(key => {
          const events = userDayMap[key];
          events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          const firstLogin = events[0];
          const loginTime = new Date(firstLogin.timestamp);
          
          const cutoff = new Date(loginTime);
          cutoff.setHours(9, 0, 0, 0);

          const isLate = loginTime > cutoff;
          const status = isLate ? 'Delayed' : 'On Time';
          
          return {
              id: firstLogin.id,
              userId: firstLogin.userId,
              userName: firstLogin.userName || 'Unknown User',
              userRole: firstLogin.userRole || 'N/A',
              date: loginTime.toLocaleDateString('en-GB'),
              day: loginTime.toLocaleDateString('en-US', { weekday: 'long' }),
              time: loginTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              status: status,
              timestampRaw: loginTime
          };
      });

      return processedRows.sort((a, b) => b.timestampRaw.getTime() - a.timestampRaw.getTime());

  }, [loginEvents, reportType]);
  // --- LOGIN REPORT LOGIC END ---


  // --- INVENTORY REPORT LOGIC (TDM/FTTH) ---
  const rawData = reportType === 'TDM' ? tdmInventory : ftthInventory;

  const filterOptions = useMemo(() => {
      const sectors = Array.from(new Set(rawData.map(i => i.sector))).filter(Boolean).sort();
      const regions = Array.from(new Set(rawData.map(i => i.region))).filter(Boolean).sort();
      const exchanges = Array.from(new Set(rawData.map(i => i.mainExchange))).filter(Boolean).sort();
      const inspectors = users.filter(u => u.role === 'inspector').map(u => ({ id: u.id, name: u.name }));
      return { sectors, regions, exchanges, inspectors };
  }, [rawData, users]);

  const enrichedData = useMemo(() => {
      if (reportType === 'LOGIN') return [];
      return rawData.map(item => {
          const relatedInspection = inspections.find(insp => 
              insp.status === 'submitted' &&
              (reportType === 'FTTH' 
                  ? (insp.data.boxNumber === (item as FTTHInventoryItem).boxNumber && insp.data.passiveCabinet === (item as FTTHInventoryItem).passiveCabinet)
                  : (insp.data.msanCode === item.msanCode && insp.data.cabinetNumber === (item as TDMInventoryItem).cabinetNumber)
              )
          );
          const inspector = relatedInspection ? users.find(u => u.id === relatedInspection.inspectorId) : null;
          return {
              ...item,
              lastInspectionDate: relatedInspection ? relatedInspection.date : null,
              inspectorName: inspector ? inspector.name : null,
              inspectorId: inspector ? inspector.id : null
          };
      });
  }, [rawData, inspections, users, reportType]);

  const filteredData = useMemo(() => {
      if (reportType === 'LOGIN') {
          return loginReportData.filter(row => {
              const matchesSearch = searchTerm === '' || row.userName.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesUser = selectedUser ? row.userId === selectedUser : true;
              const matchesStatus = selectedStatus ? row.status === selectedStatus : true;
              
              let matchesDate = true;
              if (selectedStartDate) {
                  const rowDate = new Date(row.timestampRaw);
                  rowDate.setHours(0,0,0,0);
                  const start = new Date(selectedStartDate);
                  start.setHours(0,0,0,0);
                  if (rowDate < start) matchesDate = false;
              }
              if (selectedEndDate && matchesDate) {
                  const rowDate = new Date(row.timestampRaw);
                  rowDate.setHours(0,0,0,0);
                  const end = new Date(selectedEndDate);
                  end.setHours(0,0,0,0);
                  if (rowDate > end) matchesDate = false;
              }

              return matchesSearch && matchesUser && matchesStatus && matchesDate;
          });
      }

      return enrichedData.filter(item => {
          const searchStr = searchTerm.toLowerCase();
          const matchesSearch = 
            searchTerm === '' ||
            item.exchangeCode.toLowerCase().includes(searchStr) ||
            (item.msanCode || '').toLowerCase().includes(searchStr);

          const matchesSector = selectedSector ? item.sector === selectedSector : true;
          const matchesRegion = selectedRegion ? item.region === selectedRegion : true;
          const matchesExchange = selectedExchange ? item.mainExchange === selectedExchange : true;
          
          const isDone = item.visitStatus === 'Done' || item.visitStatus === 'Tam El Zeyara';
          const matchesStatus = selectedStatus 
            ? (selectedStatus === 'Done' ? isDone : !isDone)
            : true;

          const matchesUser = selectedUser ? item.inspectorId === selectedUser : true;

          return matchesSearch && matchesSector && matchesRegion && matchesExchange && matchesStatus && matchesUser;
      });
  }, [enrichedData, loginReportData, searchTerm, selectedSector, selectedRegion, selectedExchange, selectedStatus, selectedUser, reportType, selectedStartDate, selectedEndDate]);

  // Export Logic
  const handleExport = () => {
      let headers: string[] = [];
      let rows: string[][] = [];
      let fileName = '';

      if (reportType === 'LOGIN') {
          headers = ['Date', 'Day', 'User Name', 'Role', 'First Login Time', 'Status'];
          rows = (filteredData as typeof loginReportData).map(row => [
              safeString(row.date), 
              safeString(row.day), 
              safeString(row.userName), 
              safeString(row.userRole), 
              safeString(row.time), 
              safeString(row.status)
          ]);
          fileName = `Login_Activity_Report_${new Date().toISOString().slice(0,10)}.csv`;
      } else {
          headers = reportType === 'TDM' 
            ? ['Sector', 'Region', 'Main Exchange', 'Code', 'MSAN', 'Cabinet', 'Box', 'Status', 'Inspector', 'Date']
            : ['Sector', 'Region', 'Main Exchange', 'Code', 'MSAN', 'Passive Cabinet', 'Box', 'Status', 'Inspector', 'Date'];
          
          rows = filteredData.map(item => {
              const status = (item.visitStatus === 'Done' || item.visitStatus === 'Tam El Zeyara') ? 'Visited' : 'Pending';
              // @ts-ignore
              const inspector = safeString(item.inspectorName || '-');
              // @ts-ignore
              const date = safeString(item.lastInspectionDate || '-');

              if (reportType === 'TDM') {
                  const t = item as TDMInventoryItem;
                  return [
                      safeString(t.sector), safeString(t.region), safeString(t.mainExchange), safeString(t.exchangeCode), 
                      safeString(t.msanCode), safeString(t.cabinetNumber), safeString(t.boxNumber), status, inspector, date
                  ];
              } else {
                  const f = item as FTTHInventoryItem;
                  return [
                      safeString(f.sector), safeString(f.region), safeString(f.mainExchange), safeString(f.exchangeCode), 
                      safeString(f.msanCode), safeString(f.passiveCabinet), safeString(f.boxNumber), status, inspector, date
                  ];
              }
          });
          fileName = `${reportType}_Detailed_Report_${new Date().toISOString().slice(0,10)}.csv`;
      }

      const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const clearFilters = () => {
      setSelectedSector(''); setSelectedRegion(''); setSelectedExchange('');
      setSelectedStatus(''); setSelectedUser(''); setSearchTerm('');
      setSelectedStartDate(''); setSelectedEndDate('');
  };

  const hasFilters = selectedSector || selectedRegion || selectedExchange || selectedStatus || selectedUser || searchTerm || selectedStartDate || selectedEndDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <FileText className="mr-3 text-te-blue" />
                Reports & Audit
            </h2>
            <p className="text-slate-500 text-sm">Generate detailed inspection and activity reports.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setReportType('TDM')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${reportType === 'TDM' ? 'bg-white text-te-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Server size={14} className="inline mr-2" /> TDM Report
            </button>
            <button onClick={() => setReportType('FTTH')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${reportType === 'FTTH' ? 'bg-white text-te-magenta shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Wifi size={14} className="inline mr-2" /> FTTH Report
            </button>
            <button onClick={() => setReportType('LOGIN')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${reportType === 'LOGIN' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <LogIn size={14} className="inline mr-2" /> Login Activity
            </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                  <Filter size={16} className="mr-2 text-te-accent" />
                  Filter {reportType === 'LOGIN' ? 'Activity' : 'Records'}
              </h3>
              {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center">
                      <X size={14} className="mr-1" /> Clear All
                  </button>
              )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                   <input 
                        type="text" 
                        placeholder={reportType === 'LOGIN' ? "Search User Name..." : "Search Codes..."}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-te-blue/30 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              {/* Conditional Filters based on Report Type */}
              {reportType === 'LOGIN' ? (
                  <>
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] text-slate-400 mb-1">From Date</label>
                        <input 
                            type="date" 
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            value={selectedStartDate}
                            onChange={(e) => setSelectedStartDate(e.target.value)}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] text-slate-400 mb-1">To Date</label>
                        <input 
                            type="date" 
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            value={selectedEndDate}
                            onChange={(e) => setSelectedEndDate(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none h-10 mt-auto"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">All Users</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <select 
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none h-10 mt-auto"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="On Time">On Time (&lt; 9 AM)</option>
                        <option value="Delayed">Delayed (&gt; 9 AM)</option>
                    </select>
                  </>
              ) : (
                  <>
                    <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                        <option value="">All Sectors</option>
                        {filterOptions.sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                        <option value="">All Regions</option>
                        {filterOptions.regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Done">Visited</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">All Inspectors</option>
                        {filterOptions.inspectors.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </>
              )}
          </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="text-sm text-slate-500">
                  Found <span className="font-bold text-slate-800">{filteredData.length}</span> records
              </div>
              <button onClick={handleExport} className="flex items-center text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded transition-colors">
                  <Download size={16} className="mr-2" /> Export CSV
              </button>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
                      <tr>
                          {reportType === 'LOGIN' ? (
                              <>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Day</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">First Login</th>
                                <th className="px-4 py-3 text-center">Status</th>
                              </>
                          ) : (
                              <>
                                <th className="px-4 py-3">Region / Exchange</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">MSAN</th>
                                {reportType === 'TDM' ? <><th className="px-4 py-3">Cabinet</th><th className="px-4 py-3">Box</th></> : <><th className="px-4 py-3">Passive Cab</th><th className="px-4 py-3">Box NO</th></>}
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3">Inspector</th>
                              </>
                          )}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredData.slice(0, 100).map((item: any, idx) => (
                          <tr key={item.id || idx} className="hover:bg-slate-50">
                              {reportType === 'LOGIN' ? (
                                  <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{safeString(item.date)}</td>
                                    <td className="px-4 py-3 text-slate-500">{safeString(item.day)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mr-2 text-[10px] font-bold">
                                                {safeString(item.userName).charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-slate-800 font-medium">{safeString(item.userName)}</div>
                                                <div className="text-[9px] text-slate-400 capitalize">{safeString(item.userRole)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-slate-600">{safeString(item.time)}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.status === 'On Time' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                                                <CheckCircle size={10} className="mr-1" /> On Time
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                                                <AlertTriangle size={10} className="mr-1" /> Delayed
                                            </span>
                                        )}
                                    </td>
                                  </>
                              ) : (
                                  <>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-700">{safeString(item.mainExchange)}</div>
                                        <div className="text-slate-400 text-[10px]">{safeString(item.region)}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-slate-500">{safeString(item.exchangeCode)}</td>
                                    <td className="px-4 py-3 font-mono text-te-blue">{safeString(item.msanCode)}</td>
                                    {reportType === 'TDM' ? <><td className="px-4 py-3 font-bold">{safeString(item.cabinetNumber)}</td><td className="px-4 py-3">{safeString(item.boxNumber)}</td></> : <><td className="px-4 py-3 font-bold">{safeString(item.passiveCabinet)}</td><td className="px-4 py-3">{safeString(item.boxNumber)}</td></>}
                                    <td className="px-4 py-3 text-center">
                                        {(item.visitStatus === 'Done' || item.visitStatus === 'Tam El Zeyara') ? <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700"><CheckCircle size={10} className="mr-1" /> Visited</span> : <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500"><Clock size={10} className="mr-1" /> Pending</span>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {item.inspectorName ? <div className="flex flex-col"><div className="flex items-center"><UserIcon size={10} className="mr-1 text-slate-400" />{item.inspectorName}</div><div className="flex items-center text-[9px] text-slate-400 mt-0.5"><Calendar size={8} className="mr-1" />{safeString(item.lastInspectionDate)}</div></div> : <span className="text-slate-300">-</span>}
                                    </td>
                                  </>
                              )}
                          </tr>
                      ))}
                      {filteredData.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                                  {reportType === 'LOGIN' ? (
                                      <>
                                        <Briefcase size={32} className="mb-2 opacity-50" />
                                        <p>No login activity found.</p>
                                        <p className="text-xs mt-1">Try adjusting the date range.</p>
                                      </>
                                  ) : (
                                      'No matching records found.'
                                  )}
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
