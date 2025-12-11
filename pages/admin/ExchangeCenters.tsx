
import React, { useState, useMemo } from 'react';
import { MOCK_TDM_INVENTORY, MOCK_FTTH_INVENTORY } from '../../constants';
import { TDMInventoryItem, FTTHInventoryItem } from '../../types';
import { Search, Server, Wifi, Download, Filter, X } from 'lucide-react';

interface ExchangeCenterListProps {
  filterType: 'TDM' | 'FTTH';
  data: (TDMInventoryItem | FTTHInventoryItem)[];
}

export const ExchangeCenterList: React.FC<ExchangeCenterListProps> = ({ filterType, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Shared Filter States
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');

  // 1. Determine Data Source based on Type (Use prop data if available, else fallback to constants)
  // The passed 'data' prop is already the correct source from App.tsx, but we keep this robust.
  const dataSource = data && data.length > 0 
    ? data 
    : (filterType === 'TDM' ? MOCK_TDM_INVENTORY : MOCK_FTTH_INVENTORY);

  // 2. Cascading Options Logic
  const sectors = useMemo(() => 
    Array.from(new Set(dataSource.map(i => i.sector))).filter(Boolean).sort(), 
  [dataSource]);

  const regions = useMemo(() => {
    const filtered = selectedSector ? dataSource.filter(i => i.sector === selectedSector) : dataSource;
    return Array.from(new Set(filtered.map(i => i.region))).filter(Boolean).sort();
  }, [dataSource, selectedSector]);

  const mainExchanges = useMemo(() => {
    let filtered = dataSource;
    if (selectedSector) filtered = filtered.filter(i => i.sector === selectedSector);
    if (selectedRegion) filtered = filtered.filter(i => i.region === selectedRegion);
    return Array.from(new Set(filtered.map(i => i.mainExchange))).filter(Boolean).sort();
  }, [dataSource, selectedSector, selectedRegion]);

  const subExchanges = useMemo(() => {
    let filtered = dataSource;
    if (selectedSector) filtered = filtered.filter(i => i.sector === selectedSector);
    if (selectedRegion) filtered = filtered.filter(i => i.region === selectedRegion);
    if (selectedMain) filtered = filtered.filter(i => i.mainExchange === selectedMain);
    return Array.from(new Set(filtered.map(i => i.subExchange))).filter(Boolean).sort();
  }, [dataSource, selectedSector, selectedRegion, selectedMain]);

  // 3. Filter Logic for Table
  // @ts-ignore - TS struggles with Union Types here in map/filter, but keys overlap intentionally
  const filteredData = dataSource.filter(item => {
      // Text Search
      const code = item.exchangeCode.toLowerCase();
      const msan = item.msanCode?.toLowerCase() || '';
      // FTTH Specific Search
      // @ts-ignore
      const passive = filterType === 'FTTH' ? ((item as FTTHInventoryItem).passiveCabinet?.toLowerCase() || '') : '';
      
      const matchesSearch = 
        searchTerm === '' ||
        code.includes(searchTerm.toLowerCase()) ||
        msan.includes(searchTerm.toLowerCase()) ||
        passive.includes(searchTerm.toLowerCase());

      // Dropdown Filters
      const matchesSector = selectedSector ? item.sector === selectedSector : true;
      const matchesRegion = selectedRegion ? item.region === selectedRegion : true;
      const matchesMain = selectedMain ? item.mainExchange === selectedMain : true;
      const matchesSub = selectedSub ? item.subExchange === selectedSub : true;

      return matchesSearch && matchesSector && matchesRegion && matchesMain && matchesSub;
  });

  // 4. CSV Export Logic
  const handleExportCSV = () => {
        let headers: string[] = [];
        let rows: string[][] = [];

        if (filterType === 'TDM') {
            headers = ['Sector', 'Region', 'Main Exchange', 'Sub Exchange', 'Exchange Code', 'MSAN Code', 'TDM Cabinet', 'TDM Box'];
            rows = (filteredData as TDMInventoryItem[]).map(item => [
                `"${item.sector}"`, `"${item.region}"`, `"${item.mainExchange}"`, `"${item.subExchange}"`,
                `"${item.exchangeCode}"`, `"${item.msanCode}"`, `"${item.cabinetNumber}"`, `"${item.boxNumber}"`
            ]);
        } else {
            headers = ['Sector', 'Region', 'Main Exchange', 'Sub Exchange', 'Exchange Code', 'MSAN Code', 'Passive Cabinet', 'Box Capacity', 'Box NO', 'Status'];
            rows = (filteredData as FTTHInventoryItem[]).map(item => [
                `"${item.sector}"`, `"${item.region}"`, `"${item.mainExchange}"`, `"${item.subExchange}"`,
                `"${item.exchangeCode}"`, `"${item.msanCode}"`, `"${item.passiveCabinet}"`, `"${item.boxCapacity}"`, `"${item.boxNumber}"`, `"${item.visitStatus}"`
            ]);
        }

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filterType.toLowerCase()}_inventory_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  };

  const clearFilters = () => {
        setSelectedSector('');
        setSelectedRegion('');
        setSelectedMain('');
        setSelectedSub('');
        setSearchTerm('');
  };

  // Handlers with Reset Logic
  const handleSectorChange = (val: string) => {
      setSelectedSector(val);
      setSelectedRegion('');
      setSelectedMain('');
      setSelectedSub('');
  };

  const handleRegionChange = (val: string) => {
      setSelectedRegion(val);
      setSelectedMain('');
      setSelectedSub('');
  };

  const handleMainChange = (val: string) => {
      setSelectedMain(val);
      setSelectedSub('');
  };

  const hasActiveFilters = selectedSector || selectedRegion || selectedMain || selectedSub || searchTerm;

  return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  {filterType === 'TDM' ? <Server className="mr-3 text-te-blue" /> : <Wifi className="mr-3 text-te-blue" />}
                  {filterType} Network Inventory
              </h2>
              <p className="text-slate-500 text-sm">
                  {filterType === 'TDM' ? 'Detailed view of MSANs, Cabinets, and Boxes.' : 'Detailed view of Passive Cabinets and FTTH Boxes.'} 
                  Showing <span className="font-bold text-te-blue">{filteredData.length}</span> records.
              </p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors text-sm font-medium"
          >
            <Download size={18} className="mr-2" />
            Export to CSV
          </button>
        </div>

        {/* Filters Grid */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
           <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-bold text-slate-700 flex items-center">
                   <Filter size={16} className="mr-2 text-te-accent" />
                   Filter Records
               </h3>
               {hasActiveFilters && (
                   <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center hover:underline">
                       <X size={14} className="mr-1" /> Clear All Filters
                   </button>
               )}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
               {/* Search Box */}
               <div className="relative">
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Search</label>
                   <div className="relative">
                        <input 
                            type="text" 
                            placeholder={filterType === 'TDM' ? "Code, MSAN..." : "Code, Cabinet..."}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   </div>
               </div>

               {/* Sector Dropdown */}
               <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Sector</label>
                   <select 
                        className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                        value={selectedSector}
                        onChange={(e) => handleSectorChange(e.target.value)}
                   >
                       <option value="">All Sectors</option>
                       {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
               </div>

               {/* Region Dropdown */}
               <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Region</label>
                   <select 
                        className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                        value={selectedRegion}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        disabled={!selectedSector && sectors.length > 0} // Optional UX choice: disable if parent not selected
                   >
                       <option value="">All Regions</option>
                       {regions.map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
               </div>

               {/* Main Exchange Dropdown */}
               <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Main Exchange</label>
                   <select 
                        className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                        value={selectedMain}
                        onChange={(e) => handleMainChange(e.target.value)}
                        disabled={!selectedRegion && regions.length > 0}
                   >
                       <option value="">All Main Exchanges</option>
                       {mainExchanges.map(m => <option key={m} value={m}>{m}</option>)}
                   </select>
               </div>

               {/* Sub Exchange Dropdown */}
               <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Sub Exchange</label>
                   <select 
                        className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-te-blue/50 outline-none text-sm"
                        value={selectedSub}
                        onChange={(e) => setSelectedSub(e.target.value)}
                        disabled={!selectedMain && mainExchanges.length > 0}
                   >
                       <option value="">All Sub Exchanges</option>
                       {subExchanges.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
               </div>
           </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#5C2D91] text-white uppercase">
                    <tr>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">Sector</th>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">Region</th>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">Main Exchange</th>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">Sub Exchange</th>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">Ex. Code</th>
                        <th className="px-4 py-3 font-semibold border-r border-white/10">MSAN Code</th>
                        
                        {filterType === 'TDM' ? (
                            <>
                                <th className="px-4 py-3 font-semibold border-r border-white/10">TDM Cabinet</th>
                                <th className="px-4 py-3 font-semibold">TDM Box</th>
                            </>
                        ) : (
                            <>
                                <th className="px-4 py-3 font-semibold border-r border-white/10">Passive Cabinet</th>
                                <th className="px-4 py-3 font-semibold border-r border-white/10">Capacity</th>
                                <th className="px-4 py-3 font-semibold border-r border-white/10">Box NO</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.sector}</td>
                            <td className="px-4 py-3 text-slate-600">{item.region}</td>
                            <td className="px-4 py-3 text-slate-800 font-bold">{item.mainExchange}</td>
                            <td className="px-4 py-3 text-slate-600">{item.subExchange}</td>
                            <td className="px-4 py-3 text-slate-600 font-mono bg-slate-50">{item.exchangeCode}</td>
                            <td className="px-4 py-3 text-te-blue font-mono font-medium">{item.msanCode || '-'}</td>
                            
                            {filterType === 'TDM' ? (
                                <>
                                    <td className="px-4 py-3 text-slate-700 text-center font-bold bg-slate-50">{item.cabinetNumber}</td>
                                    <td className="px-4 py-3 text-slate-700 text-center">{item.boxNumber}</td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3 text-slate-700 font-bold bg-slate-50">{item.passiveCabinet}</td>
                                    <td className="px-4 py-3 text-slate-700 text-center">{item.boxCapacity}</td>
                                    <td className="px-4 py-3 text-slate-700 text-center">{item.boxNumber}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            item.visitStatus === 'Done' || item.visitStatus === 'Tam El Zeyara'
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {item.visitStatus}
                                        </span>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    {filteredData.length === 0 && (
                        <tr>
                            <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                                No records found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
  );
};
