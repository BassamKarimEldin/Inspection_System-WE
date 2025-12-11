
import React, { useState, useMemo } from 'react';
import { Inspection } from '../../types';
import { FileText, Calendar, MapPin, CheckCircle, Clock, Eye, Server, Wifi, Filter, Search, X, ClipboardList, Info } from 'lucide-react';
import { MOCK_CENTERS } from '../../constants';

interface SubmissionsListProps {
  inspections: Inspection[];
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({ inspections }) => {
  const [filterType, setFilterType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal State
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  // Helper to resolve location name from data or center ID
  const getLocationName = (insp: Inspection) => {
      // Try to get specific location from form data first
      if (insp.data?.mainExchange) return insp.data.mainExchange;
      if (insp.data?.exchangeName) return insp.data.exchangeName;
      if (insp.data?.passiveCabinet) return `Cabinet: ${insp.data.passiveCabinet}`;
      
      // Fallback to center mapping
      return MOCK_CENTERS.find(c => c.id === insp.centerId)?.name || 'Unknown Location';
  };

  const getDetail = (insp: Inspection) => {
      if (insp.type === 'TDM') {
          return insp.data?.cabinetNumber ? `Cab: ${insp.data.cabinetNumber}, Box: ${insp.data.boxNumber}` : '';
      }
      if (insp.type.includes('FTTH')) {
          return insp.data?.passiveCabinet ? `${insp.data.passiveCabinet}` : '';
      }
      return '';
  }

  // Filter Logic
  const filteredInspections = useMemo(() => {
    return inspections.filter(insp => {
      // 1. Filter by Type
      let typeMatch = true;
      if (filterType === 'TDM') typeMatch = insp.type === 'TDM';
      else if (filterType === 'FTTH') typeMatch = insp.type.startsWith('FTTH');

      // 2. Filter by Location
      const locationName = getLocationName(insp).toLowerCase();
      const locationMatch = searchLocation === '' || locationName.includes(searchLocation.toLowerCase());

      // 3. Filter by Date
      const dateMatch = filterDate === '' || insp.date === filterDate;

      // 4. Filter by Status
      const statusMatch = filterStatus === '' || insp.status === filterStatus;

      return typeMatch && locationMatch && dateMatch && statusMatch;
    });
  }, [inspections, filterType, searchLocation, filterDate, filterStatus]);

  const clearFilters = () => {
    setFilterType('');
    setSearchLocation('');
    setFilterDate('');
    setFilterStatus('');
  };

  const hasFilters = filterType || searchLocation || filterDate || filterStatus;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <FileText className="mr-3 text-te-blue" />
              My Submissions
           </h2>
           <p className="text-slate-500 text-sm">
             History of your TDM and FTTH inspection reports.
           </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                  <Filter size={16} className="mr-2 text-te-accent" />
                  Filter Submissions
              </h3>
              {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center hover:underline">
                      <X size={14} className="mr-1" /> Clear All Filters
                  </button>
              )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Inspection Type</label>
                  <select 
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                  >
                      <option value="">All Types</option>
                      <option value="TDM">TDM Inspection</option>
                      <option value="FTTH">FTTH Inspection</option>
                  </select>
              </div>

              {/* Location Search */}
              <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                   <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search Location..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   </div>
              </div>

              {/* Date Filter */}
              <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date Submitted</label>
                  <input 
                      type="date" 
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                  />
              </div>

               {/* Status Filter */}
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                  <select 
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                  >
                      <option value="">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="pending">Pending Review</option>
                  </select>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         {filteredInspections.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                 <FileText size={48} className="mx-auto mb-4 opacity-50" />
                 <p>{hasFilters ? 'No submissions match your filters.' : 'No submissions found.'}</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Inspection Type</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Date Submitted</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredInspections.map((insp) => (
                            <tr key={insp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${insp.type === 'TDM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {insp.type === 'TDM' ? <Server size={18} /> : <Wifi size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">
                                                {insp.type === 'TDM' ? 'TDM Inspection' : 'FTTH Inspection'}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono">ID: {insp.id.replace('INS-', '')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex flex-col">
                                        <div className="flex items-center font-medium text-slate-700">
                                            <MapPin size={14} className="mr-1 text-slate-400" />
                                            {getLocationName(insp)}
                                        </div>
                                        <div className="text-xs text-slate-400 ml-5">
                                           {getDetail(insp)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex items-center">
                                        <Calendar size={14} className="mr-2 text-slate-400" />
                                        {insp.date}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {insp.status === 'submitted' ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            <CheckCircle size={10} className="mr-1" />
                                            Submitted
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                            <Clock size={10} className="mr-1" />
                                            Pending Review
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedInspection(insp)}
                                        className="text-te-blue hover:text-te-dark font-medium text-xs flex items-center justify-end w-full"
                                    >
                                        <Eye size={14} className="mr-1" /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         )}
      </div>

      {/* Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-[#5C2D91] p-6 flex justify-between items-center text-white">
                 <div className="flex items-center space-x-3">
                    {selectedInspection.type === 'TDM' ? <Server size={24} /> : <Wifi size={24} />}
                    <div>
                        <h3 className="font-bold text-lg">{selectedInspection.type === 'TDM' ? 'TDM Inspection Details' : 'FTTH Inspection Details'}</h3>
                        <p className="text-white/80 text-xs">ID: {selectedInspection.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedInspection(null)} className="text-white/70 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Meta Data */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 col-span-1 md:col-span-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                            <Info size={12} className="mr-1" /> General Info
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500">Date Submitted</label>
                                <p className="font-medium text-slate-800">{selectedInspection.date}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Status</label>
                                <p className="font-medium text-green-600 capitalize">{selectedInspection.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Form Data */}
                    {Object.entries(selectedInspection.data).map(([key, val]) => {
                         // Skip empty values or technical keys if needed, but showing all is safer
                         if (val === '' || val === null || val === undefined) return null;
                         
                         return (
                            <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-1 block">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <p className="text-sm font-medium text-slate-800 break-words">
                                    {String(val)}
                                </p>
                            </div>
                         );
                    })}
                 </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                  <button 
                    onClick={() => setSelectedInspection(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
