
import React, { useState, useMemo } from 'react';
import { MOCK_TDM_INVENTORY, MOCK_FTTH_INVENTORY, MOCK_CENTERS } from '../../constants';
import { Inspection, User } from '../../types';
import { Save, Send, AlertCircle, CheckCircle2, ClipboardList, Server, ShieldAlert, Wifi, Activity, Router, MapPin, Zap, Thermometer, ArrowLeft, Box, Lock } from 'lucide-react';

// --- Reusable Form Components ---

interface FormSectionProps {
  title: string;
  icon?: React.ElementType;
}

const FormSection = ({ title, icon: Icon, children }: React.PropsWithChildren<FormSectionProps>) => (
  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-6 shadow-sm transition-all hover:shadow-md">
    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center space-x-2">
      {Icon && <Icon size={18} className="text-te-blue" />}
      <h3 className="font-bold text-te-blue">{title}</h3>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  name?: string;
  className?: string;
  required?: boolean;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  step?: string | number;
  placeholder?: string;
  disabled?: boolean;
}

const InputField = ({ label, error, className = "", required, ...props }: InputProps) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      required={required}
      className={`w-full px-3 py-2 bg-white text-slate-900 border rounded focus:outline-none focus:ring-2 transition-all ${
        error 
          ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
          : 'border-slate-300 focus:ring-te-blue/50 focus:border-te-blue'
      } ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 flex items-center"><AlertCircle size={10} className="mr-1"/> {error}</span>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  name?: string;
  className?: string;
  required?: boolean;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
}

const SelectField = ({ label, options, error, className = "", required, ...props }: SelectProps) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select 
      required={required}
      className={`w-full px-3 py-2 bg-white text-slate-900 border rounded focus:outline-none focus:ring-2 transition-all ${
        error 
          ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
          : 'border-slate-300 focus:ring-te-blue/50 focus:border-te-blue'
      } ${className}`}
      {...props}
    >
      <option value="">-- Select --</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <span className="text-xs text-red-500 flex items-center"><AlertCircle size={10} className="mr-1"/> {error}</span>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  name?: string;
  className?: string;
  required?: boolean;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const TextAreaField = ({ label, error, className = "", required, ...props }: TextAreaProps) => (
  <div className="flex flex-col space-y-1 col-span-1 md:col-span-2">
    <label className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea 
      required={required}
      className={`w-full px-3 py-2 bg-white text-slate-900 border rounded focus:outline-none focus:ring-2 transition-all min-h-[100px] ${
        error 
          ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
          : 'border-slate-300 focus:ring-te-blue/50 focus:border-te-blue'
      } ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 flex items-center"><AlertCircle size={10} className="mr-1"/> {error}</span>}
  </div>
);

// --- SHARED TYPES ---
interface FormProps {
  currentUser: User;
  onSubmit: (inspection: Inspection) => void;
}

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - (offset * 60 * 1000));
    return local.toISOString().split('T')[0];
};

// ==========================================
// TDM FORM IMPLEMENTATION
// ==========================================

interface TDMFormData {
  sector: string;
  region: string;
  exchangeName: string;
  exchangeCode: string;
  msanCode: string;
  cabinetNumber: string; 
  boxNumber: string;
  visitStatus: string;
  riserGuard: string;        
  properHeight: string;      
  boxCover: string;          
  boxFixation: string;       
  combFixation: string;      
  cableCombFixation: string; 
  grounding: string;         
  numbering: string;         
  aerialConnections: string; 
  roadCrossing: string;      
  electricConflict: string;  
  notes: string;
}

const INITIAL_TDM_DATA: TDMFormData = {
  sector: '', region: '', exchangeName: '', exchangeCode: '', msanCode: '', cabinetNumber: '', boxNumber: '', visitStatus: 'Done',
  riserGuard: '', properHeight: '', boxCover: '', boxFixation: '', combFixation: '', cableCombFixation: '', grounding: '', numbering: '', aerialConnections: '', roadCrossing: '', electricConflict: '', notes: ''
};

export const TDMInspectionForm: React.FC<FormProps> = ({ currentUser, onSubmit }) => {
  const [formData, setFormData] = useState<TDMFormData>(INITIAL_TDM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof TDMFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cascading Logic
  const sectors = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.map(i => i.sector))).sort().map(s => ({ value: s, label: s })), []);
  const regions = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.filter(i => i.sector === formData.sector).map(i => i.region))).sort().map(r => ({ value: r, label: r })), [formData.sector]);
  const exchanges = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.filter(i => i.region === formData.region).map(i => i.mainExchange))).sort().map(m => ({ value: m, label: m })), [formData.region]);
  const msans = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.filter(i => i.mainExchange === formData.exchangeName).map(i => i.msanCode))).sort().map(m => ({ value: m, label: m })), [formData.exchangeName]);
  const cabinets = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.filter(i => i.msanCode === formData.msanCode).map(i => i.cabinetNumber))).sort().map(c => ({ value: c, label: c })), [formData.msanCode]);
  const boxes = useMemo(() => Array.from(new Set(MOCK_TDM_INVENTORY.filter(i => i.cabinetNumber === formData.cabinetNumber).map(i => i.boxNumber))).sort().map(b => ({ value: b, label: b })), [formData.cabinetNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Auto-Reset
    if (name === 'sector') setFormData(p => ({ ...p, sector: value, region: '', exchangeName: '', msanCode: '', cabinetNumber: '', boxNumber: '' }));
    else if (name === 'region') setFormData(p => ({ ...p, region: value, exchangeName: '', msanCode: '', cabinetNumber: '', boxNumber: '' }));
    else if (name === 'exchangeName') {
       const found = MOCK_TDM_INVENTORY.find(i => i.mainExchange === value);
       setFormData(p => ({ ...p, exchangeName: value, exchangeCode: found?.exchangeCode || '', msanCode: '', cabinetNumber: '', boxNumber: '' }));
    } else if (name === 'msanCode') setFormData(p => ({ ...p, msanCode: value, cabinetNumber: '', boxNumber: '' }));
    else if (name === 'cabinetNumber') setFormData(p => ({ ...p, cabinetNumber: value, boxNumber: '' }));
    else setFormData(p => ({ ...p, [name]: value }));

    if (errors[name as keyof TDMFormData]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sector || !formData.boxNumber) {
        alert("Please complete the location fields."); 
        return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit({
            id: `INS-${Date.now()}`,
            type: 'TDM',
            centerId: 'c1',
            inspectorId: currentUser.id,
            date: getLocalDateString(), // Fixed to use local time
            status: 'submitted',
            data: formData
        });
        setIsSubmitting(false);
        setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) return <SuccessView onReset={() => { setIsSuccess(false); setFormData(INITIAL_TDM_DATA); }} title="TDM Inspection Submitted" />;

  const yesNoOptions = [{ value: 'Yes', label: 'Yes / Good' }, { value: 'No', label: 'No / Bad' }, { value: 'NA', label: 'N/A' }];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><ClipboardList className="mr-3 text-te-blue" /> TDM Copper Network Inspection</h2>
      </div>
      <FormSection title="Asset Identification" icon={Server}>
        <SelectField label="Sector" name="sector" value={formData.sector} onChange={handleChange} options={sectors} required />
        <SelectField label="Region" name="region" value={formData.region} onChange={handleChange} options={regions} disabled={!formData.sector} required />
        <SelectField label="Exchange" name="exchangeName" value={formData.exchangeName} onChange={handleChange} options={exchanges} disabled={!formData.region} required />
        <InputField label="Exchange Code" name="exchangeCode" value={formData.exchangeCode} disabled className="bg-slate-50 text-slate-500" />
        <SelectField label="MSAN Code" name="msanCode" value={formData.msanCode} onChange={handleChange} options={msans} disabled={!formData.exchangeName} required />
        <SelectField label="Copper Cabinet No." name="cabinetNumber" value={formData.cabinetNumber} onChange={handleChange} options={cabinets} disabled={!formData.msanCode} required />
        <SelectField label="Box Number" name="boxNumber" value={formData.boxNumber} onChange={handleChange} options={boxes} disabled={!formData.cabinetNumber} required />
        <SelectField label="Visit Status" name="visitStatus" value={formData.visitStatus} onChange={handleChange} options={[{ value: 'Done', label: 'Visit Done' }, { value: 'Pending', label: 'Visit Pending' }]} />
      </FormSection>
      <FormSection title="Physical Inspection Checklist" icon={ShieldAlert}>
        <SelectField label="Cabinet Riser Guard" name="riserGuard" value={formData.riserGuard} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Suitable Height" name="properHeight" value={formData.properHeight} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Box Cover" name="boxCover" value={formData.boxCover} onChange={handleChange} options={yesNoOptions} required />
        <SelectField label="Box Fixation" name="boxFixation" value={formData.boxFixation} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Comb Fixation" name="combFixation" value={formData.combFixation} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Cable Fixation" name="cableCombFixation" value={formData.cableCombFixation} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Box Grounding" name="grounding" value={formData.grounding} onChange={handleChange} options={yesNoOptions} required />
        <SelectField label="Numbering" name="numbering" value={formData.numbering} onChange={handleChange} options={yesNoOptions} />
        <SelectField label="Aerial Connections" name="aerialConnections" value={formData.aerialConnections} onChange={handleChange} options={[{value: 'Organized', label: 'Organized'}, {value: 'Messy', label: 'Messy'}]} />
        <SelectField label="Road Crossing" name="roadCrossing" value={formData.roadCrossing} onChange={handleChange} options={[{value: 'Safe', label: 'Safe'}, {value: 'Unsafe', label: 'Unsafe'}]} />
        <SelectField label="Electric Conflict" name="electricConflict" value={formData.electricConflict} onChange={handleChange} options={[{value: 'No', label: 'No Conflict'}, {value: 'Yes', label: 'Yes (Dangerous)'}]} />
      </FormSection>
      <FormSection title="Observations"><TextAreaField label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} /></FormSection>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

// ==========================================
// FTTH FORM IMPLEMENTATION (SPLIT)
// ==========================================

// --- SHARED FTTH STATE ---
interface FTTHLocationState {
  sector: string; region: string; mainExchange: string; subExchange: string; msanCode: string; passiveCabinet: string;
}

// --- CABINET FORM ---
interface FTTHCabinetData extends FTTHLocationState {
  cabinetStatus: string;
  doorStatus: string;
  lockStatus: string;
  cleanliness: string;
  baseStatus: string;
  notes: string;
}

// --- BOX FORM ---
interface FTTHBoxData extends FTTHLocationState {
  boxNumber: string;
  visitStatus: string;
  dropWirePath: string; rings: string; boxCover: string; numbering: string; boxFixation: string;
  externalConnections: string; internalConnections: string; riserStatus: string; properHeight: string;
  roadCrossing: string; customerRiser: string; logo: string; otherProblems: string; notes: string; violationReason: string;
}

const INITIAL_FTTH_CABINET: FTTHCabinetData = {
  sector: '', region: '', mainExchange: '', subExchange: '', msanCode: '', passiveCabinet: '',
  cabinetStatus: '', doorStatus: '', lockStatus: '', cleanliness: '', baseStatus: '', notes: ''
};

const INITIAL_FTTH_BOX: FTTHBoxData = {
  sector: '', region: '', mainExchange: '', subExchange: '', msanCode: '', passiveCabinet: '', boxNumber: '', visitStatus: 'Done',
  dropWirePath: '', rings: '', boxCover: '', numbering: '', boxFixation: '', externalConnections: '', internalConnections: '',
  riserStatus: '', properHeight: '', roadCrossing: '', customerRiser: '', logo: '', otherProblems: '', notes: '', violationReason: ''
};

export const FTTHInspectionForm: React.FC<FormProps> = ({ currentUser, onSubmit }) => {
  const [subType, setSubType] = useState<'selection' | 'cabinet' | 'box'>('selection');
  
  // Separate State for Cabinet and Box to avoid conflicts
  const [cabinetData, setCabinetData] = useState<FTTHCabinetData>(INITIAL_FTTH_CABINET);
  const [boxData, setBoxData] = useState<FTTHBoxData>(INITIAL_FTTH_BOX);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Dynamic Options Helper ---
  const getOptions = (filterFn: (i: any) => boolean, key: string) => 
    Array.from(new Set(MOCK_FTTH_INVENTORY.filter(filterFn).map((i: any) => i[key]))).sort().map(v => ({ value: v, label: v }));

  // --- Handlers ---
  const handleCabinetSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
          onSubmit({
              id: `INS-CAB-${Date.now()}`,
              type: 'FTTH_CABINET',
              centerId: 'c1',
              inspectorId: currentUser.id,
              date: getLocalDateString(), // Fixed to use local time
              status: 'submitted',
              data: cabinetData
          });
          setIsSubmitting(false);
          setIsSuccess(true);
      }, 1000);
  };

  const handleBoxSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
          onSubmit({
              id: `INS-BOX-${Date.now()}`,
              type: 'FTTH_BOX',
              centerId: 'c1',
              inspectorId: currentUser.id,
              date: getLocalDateString(), // Fixed to use local time
              status: 'submitted',
              data: boxData
          });
          setIsSubmitting(false);
          setIsSuccess(true);
      }, 1000);
  };

  if (isSuccess) {
      return <SuccessView onReset={() => { setIsSuccess(false); setSubType('selection'); setCabinetData(INITIAL_FTTH_CABINET); setBoxData(INITIAL_FTTH_BOX); }} title="FTTH Inspection Submitted" />;
  }

  // --- SELECTION SCREEN ---
  if (subType === 'selection') {
      return (
          <div className="max-w-4xl mx-auto">
              <div className="mb-8 border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Wifi className="mr-3 text-te-blue" /> New FTTH Inspection</h2>
                  <p className="text-slate-500 text-sm mt-1 ml-9">Select the type of asset you are inspecting today.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <button onClick={() => setSubType('cabinet')} className="bg-white p-8 rounded-xl border-2 border-slate-200 hover:border-te-blue hover:shadow-lg transition-all group text-left">
                      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-te-blue transition-colors">
                          <Server size={28} className="text-te-blue group-hover:text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">FTTH Cabinet</h3>
                      <p className="text-slate-500 text-sm">Inspect passive cabinets, locks, door condition, and cleanliness.</p>
                  </button>
                  <button onClick={() => setSubType('box')} className="bg-white p-8 rounded-xl border-2 border-slate-200 hover:border-te-magenta hover:shadow-lg transition-all group text-left">
                      <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-te-magenta transition-colors">
                          <Box size={28} className="text-te-magenta group-hover:text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">FTTH Box</h3>
                      <p className="text-slate-500 text-sm">Inspect distribution boxes, drop wires, risers, and connectivity.</p>
                  </button>
              </div>
          </div>
      );
  }

  // --- RENDER FORM ---
  const isCabinet = subType === 'cabinet';
  const data = isCabinet ? cabinetData : boxData;
  // @ts-ignore
  const setData = isCabinet ? setCabinetData : setBoxData;

  // Shared Cascading Options based on current form state
  const sectors = getOptions(() => true, 'sector');
  const regions = getOptions(i => i.sector === data.sector, 'region');
  const mainExchanges = getOptions(i => i.region === data.region, 'mainExchange');
  const subExchanges = getOptions(i => i.mainExchange === data.mainExchange, 'subExchange');
  const msanCodes = getOptions(i => i.subExchange === data.subExchange, 'msanCode');
  const cabinets = getOptions(i => i.msanCode === data.msanCode, 'passiveCabinet');
  const boxes = getOptions(i => i.passiveCabinet === data.passiveCabinet, 'boxNumber');

  const handleFieldChange = (e: any) => {
      const { name, value } = e.target;
      // Auto-reset logic for location fields
      if (['sector', 'region', 'mainExchange', 'subExchange', 'msanCode', 'passiveCabinet'].includes(name)) {
          const resetFields = {
              sector: ['region', 'mainExchange', 'subExchange', 'msanCode', 'passiveCabinet', 'boxNumber'],
              region: ['mainExchange', 'subExchange', 'msanCode', 'passiveCabinet', 'boxNumber'],
              mainExchange: ['subExchange', 'msanCode', 'passiveCabinet', 'boxNumber'],
              subExchange: ['msanCode', 'passiveCabinet', 'boxNumber'],
              msanCode: ['passiveCabinet', 'boxNumber'],
              passiveCabinet: ['boxNumber']
          }[name] || [];
          
          const updates: any = { [name]: value };
          resetFields.forEach(f => updates[f] = '');
          setData((p: any) => ({ ...p, ...updates }));
      } else {
          setData((p: any) => ({ ...p, [name]: value }));
      }
  };

  return (
      <form onSubmit={isCabinet ? handleCabinetSubmit : handleBoxSubmit} className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center">
                  <button type="button" onClick={() => setSubType('selection')} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} className="text-slate-500" /></button>
                  <div>
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                          {isCabinet ? <Server className="mr-3 text-te-blue" /> : <Box className="mr-3 text-te-magenta" />}
                          {isCabinet ? 'FTTH Cabinet Inspection' : 'FTTH Box Inspection'}
                      </h2>
                  </div>
              </div>
          </div>

          <FormSection title="Location & Asset" icon={MapPin}>
              <SelectField label="Sector" name="sector" value={data.sector} onChange={handleFieldChange} options={sectors} required />
              <SelectField label="Region" name="region" value={data.region} onChange={handleFieldChange} options={regions} disabled={!data.sector} required />
              <SelectField label="Main Exchange" name="mainExchange" value={data.mainExchange} onChange={handleFieldChange} options={mainExchanges} disabled={!data.region} required />
              <SelectField label="Sub Exchange" name="subExchange" value={data.subExchange} onChange={handleFieldChange} options={subExchanges} disabled={!data.mainExchange} required />
              <SelectField label="MSAN Code" name="msanCode" value={data.msanCode} onChange={handleFieldChange} options={msanCodes} disabled={!data.subExchange} required />
              <SelectField label="Passive Cabinet" name="passiveCabinet" value={data.passiveCabinet} onChange={handleFieldChange} options={cabinets} disabled={!data.msanCode} required />
              {!isCabinet && (
                  <SelectField label="FTTH Box Number" name="boxNumber" value={(data as FTTHBoxData).boxNumber} onChange={handleFieldChange} options={boxes} disabled={!data.passiveCabinet} required />
              )}
          </FormSection>

          {isCabinet ? (
              // --- CABINET SPECIFIC FIELDS ---
              <FormSection title="Cabinet Checklist" icon={Lock}>
                  <SelectField label="Cabinet Status" name="cabinetStatus" value={cabinetData.cabinetStatus} onChange={handleFieldChange} options={[{value:'Good', label:'Good'}, {value:'Damaged', label:'Damaged'}]} required />
                  <SelectField label="Door Status" name="doorStatus" value={cabinetData.doorStatus} onChange={handleFieldChange} options={[{value:'Closed', label:'Closed'}, {value:'Broken', label:'Broken / Open'}]} required />
                  <SelectField label="Lock Status" name="lockStatus" value={cabinetData.lockStatus} onChange={handleFieldChange} options={[{value:'Secure', label:'Secure'}, {value:'Missing', label:'Missing'}]} />
                  <SelectField label="Cleanliness" name="cleanliness" value={cabinetData.cleanliness} onChange={handleFieldChange} options={[{value:'Clean', label:'Clean'}, {value:'Dirty', label:'Dirty'}]} />
                  <SelectField label="Base Status" name="baseStatus" value={cabinetData.baseStatus} onChange={handleFieldChange} options={[{value:'Stable', label:'Stable'}, {value:'Unstable', label:'Unstable'}]} />
                  <TextAreaField label="Notes" name="notes" value={cabinetData.notes} onChange={handleFieldChange} rows={3} />
              </FormSection>
          ) : (
              // --- BOX SPECIFIC FIELDS (Detailed) ---
              <>
                  <FormSection title="Cabling & Riser" icon={Router}>
                      <SelectField label="Drop Wire Path" name="dropWirePath" value={boxData.dropWirePath} onChange={handleFieldChange} options={[{value:'Good', label:'Good'}, {value:'Cut', label:'Cut'}]} />
                      <SelectField label="Rings" name="rings" value={boxData.rings} onChange={handleFieldChange} options={[{value:'Yes', label:'Exist'}, {value:'No', label:'Missing'}]} />
                      <SelectField label="Box Riser Status" name="riserStatus" value={boxData.riserStatus} onChange={handleFieldChange} options={[{value:'Yes', label:'Exist'}, {value:'No', label:'Missing'}]} />
                      <SelectField label="Customer Riser" name="customerRiser" value={boxData.customerRiser} onChange={handleFieldChange} options={[{value:'Yes', label:'Exist'}, {value:'No', label:'Missing'}]} />
                  </FormSection>
                  <FormSection title="Physical Condition" icon={Activity}>
                      <SelectField label="Box Cover" name="boxCover" value={boxData.boxCover} onChange={handleFieldChange} options={[{value:'Good', label:'Good'}, {value:'Bad', label:'Bad'}]} required />
                      <SelectField label="Numbering" name="numbering" value={boxData.numbering} onChange={handleFieldChange} options={[{value:'Yes', label:'Yes'}, {value:'No', label:'No'}]} />
                      <SelectField label="Box Fixation" name="boxFixation" value={boxData.boxFixation} onChange={handleFieldChange} options={[{value:'Good', label:'Good'}, {value:'Loose', label:'Loose'}]} />
                      <SelectField label="Proper Height" name="properHeight" value={boxData.properHeight} onChange={handleFieldChange} options={[{value:'Yes', label:'Yes'}, {value:'No', label:'No'}]} />
                      <SelectField label="Road Crossing" name="roadCrossing" value={boxData.roadCrossing} onChange={handleFieldChange} options={[{value:'Safe', label:'Safe'}, {value:'Unsafe', label:'Unsafe'}]} />
                      <SelectField label="TE Logo" name="logo" value={boxData.logo} onChange={handleFieldChange} options={[{value:'Yes', label:'Yes'}, {value:'No', label:'No'}]} />
                  </FormSection>
                  <FormSection title="Connections" icon={Zap}>
                      <SelectField label="External Connections" name="externalConnections" value={boxData.externalConnections} onChange={handleFieldChange} options={[{value:'Organized', label:'Organized'}, {value:'Random', label:'Random'}]} />
                      <SelectField label="Internal Connections" name="internalConnections" value={boxData.internalConnections} onChange={handleFieldChange} options={[{value:'Organized', label:'Organized'}, {value:'Random', label:'Random'}]} />
                  </FormSection>
                  <FormSection title="Observations">
                      <TextAreaField label="Other Problems" name="otherProblems" value={boxData.otherProblems} onChange={handleFieldChange} rows={2} />
                      <TextAreaField label="Violation Reason" name="violationReason" value={boxData.violationReason} onChange={handleFieldChange} rows={2} />
                      <TextAreaField label="Notes" name="notes" value={boxData.notes} onChange={handleFieldChange} rows={2} />
                  </FormSection>
              </>
          )}

          <SubmitButton isSubmitting={isSubmitting} />
      </form>
  );
};

// --- Helper Components ---
const SuccessView = ({ onReset, title }: { onReset: () => void, title: string }) => (
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center mt-10 border border-slate-100">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 mb-6">Inspection data recorded successfully.</p>
      <div className="flex justify-center space-x-4">
          <button onClick={onReset} className="px-6 py-2 bg-te-blue text-white rounded hover:bg-te-dark shadow-sm transition-colors">Start New Inspection</button>
      </div>
  </div>
);

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <div className="flex justify-end pt-4 pb-12 sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 -mx-6 md:mx-0 md:bg-transparent md:border-0 md:static z-10 gap-3">
      <button type="button" className="px-6 py-2 border border-slate-300 rounded text-slate-700 hover:bg-white bg-white shadow-sm transition-colors flex items-center"><Save size={18} className="mr-2" /> Save Draft</button>
      <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-te-blue text-white rounded shadow-sm hover:bg-te-dark disabled:opacity-70 flex items-center transition-colors min-w-[160px] justify-center">{isSubmitting ? <>Saving...</> : <><Send size={18} className="mr-2" /> Submit Final Report</>}</button>
  </div>
);
