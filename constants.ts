
import { Center, Inspection, TDMInventoryItem, FTTHInventoryItem, User, UserRole, LoginEvent } from './types';

export const TE_LOGO_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Telecom_Egypt_logo.svg/1200px-Telecom_Egypt_logo.svg.png"; // Placeholder path conceptual
export const TE_BRAND_BLUE = "#5C2D91"; // Updated to WE Purple

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', name: 'Bassam Karim', role: UserRole.ADMIN, status: 'active', lastLogin: '2023-10-27 14:30', password: 'password' },
  { id: 'u2', username: 'tech1', name: 'Walid Elsaaed', role: UserRole.INSPECTOR, status: 'active', lastLogin: '2023-10-27 09:15', password: 'password' },
];

export const MOCK_CENTERS: Center[] = [
  { id: 'c1', name: 'Ramsis Exchange', code: 'CAI-01', governorate: 'Cairo', status: 'active', lat: 30.0631, lng: 31.2469, supportedTypes: ['TDM', 'FTTH'] },
  { id: 'c2', name: 'Maadi Central', code: 'CAI-02', governorate: 'Cairo', status: 'active', lat: 29.9602, lng: 31.2569, supportedTypes: ['FTTH'] },
  { id: 'c3', name: 'Mansoura Main', code: 'DKH-01', governorate: 'Dakahlia', status: 'inactive', lat: 31.0409, lng: 31.3785, supportedTypes: ['TDM'] },
  { id: 'c4', name: 'Alexandria Core', code: 'ALX-05', governorate: 'Alexandria', status: 'active', lat: 31.2001, lng: 29.9187, supportedTypes: ['TDM', 'FTTH'] },
  { id: 'c5', name: 'Giza West', code: 'GIZ-03', governorate: 'Giza', status: 'active', lat: 30.0131, lng: 31.2089, supportedTypes: ['FTTH'] },
];

export const MOCK_LOGIN_EVENTS: LoginEvent[] = [
    {
        id: 'le1',
        userId: 'u1',
        userName: 'Bassam Karim',
        userRole: UserRole.ADMIN,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString(), // 45 mins ago
        lat: 30.0631,
        lng: 31.2469,
        address: 'Egypt, Cairo, Ramsis Street',
        status: 'provided'
    },
    {
        id: 'le2',
        userId: 'u2',
        userName: 'Walid Elsaaed',
        userRole: UserRole.INSPECTOR,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(), // 2 hours ago
        lat: 29.9602,
        lng: 31.2569,
        address: 'Egypt, Cairo, Maadi, Road 9',
        status: 'provided'
    },
    {
        id: 'le3',
        userId: 'u2',
        userName: 'Walid Elsaaed',
        userRole: UserRole.INSPECTOR,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toLocaleString(), // Yesterday
        lat: 29.9602,
        lng: 31.2569,
        address: 'Egypt, Cairo, Maadi',
        status: 'provided'
    },
    {
        id: 'le4',
        userId: 'u1',
        userName: 'Bassam Karim',
        userRole: UserRole.ADMIN,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toLocaleString(), // Yesterday
        lat: 30.0631,
        lng: 31.2469,
        address: 'Egypt, Cairo',
        status: 'provided'
    }
];

export const MOCK_TDM_INVENTORY: TDMInventoryItem[] = [
  // Existing Initial Data
  { id: 't1', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Alioh', exchangeCode: '3LISH', msanCode: '07-4-51-03', cabinetNumber: '3-2', boxNumber: '1:56', visitStatus: 'Done' },
  { id: 't2', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Alioh', exchangeCode: '3LISH', msanCode: '07-4-51-35', cabinetNumber: '2-2', boxNumber: '1:70', visitStatus: 'Done' },
  { id: 't3', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Alioh', exchangeCode: '3LISH', msanCode: '07-4-51-35', cabinetNumber: '2-3', boxNumber: '1:65', visitStatus: 'Pending' },
  { id: 't4', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Alioh', exchangeCode: '3LISH', msanCode: '07-4-51-35', cabinetNumber: '2-4', boxNumber: '1:60', visitStatus: 'Pending' },
  { id: 't5', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Alioh', exchangeCode: '3LISH', msanCode: '07-4-51-35', cabinetNumber: '3-1', boxNumber: '1:60', visitStatus: 'Pending' },
  { id: 't6', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '1', visitStatus: 'Done' },
  { id: 't7', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '2', visitStatus: 'Done' },
  { id: 't8', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '3', visitStatus: 'Done' },
  { id: 't9', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '4', visitStatus: 'Pending' },
  { id: 't9a', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '5', visitStatus: 'Pending' },
  { id: 't9b', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: 'Zagazig East', subExchange: 'El-Aslogy', exchangeCode: '3SLSH', msanCode: '07-3-299-04', cabinetNumber: '2-2', boxNumber: '6', visitStatus: 'Pending' },
  
  // Abu Hammad / Kafr Ayad (Sharqia)
  { id: 't10', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Kafr Ayad', exchangeCode: '3YDSH', msanCode: '07-4-22-04', cabinetNumber: '1-2', boxNumber: '1:51', visitStatus: 'Done' },
  { id: 't11', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Kafr Ayad', exchangeCode: '3YDSH', msanCode: '07-4-22-04', cabinetNumber: '3-3', boxNumber: '1:71', visitStatus: 'Done' },
  { id: 't12', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Kafr Ayad', exchangeCode: '3YDSH', msanCode: '07-4-22-04', cabinetNumber: '3-4', boxNumber: '1:55', visitStatus: 'Pending' },
  { id: 't13', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-15', cabinetNumber: 'zn-15', boxNumber: '1:47', visitStatus: 'Done' },
  { id: 't14', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-25', cabinetNumber: '18-1', boxNumber: '1:80', visitStatus: 'Pending' },
  { id: 't15', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-31', cabinetNumber: '7-1', boxNumber: '1:180', visitStatus: 'Pending' },
  { id: 't16', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-48', cabinetNumber: '8-3', boxNumber: '1:180', visitStatus: 'Done' },
  { id: 't17', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-48', cabinetNumber: '8-4', boxNumber: '1:180', visitStatus: 'Done' },
  { id: 't17a', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-226-05', cabinetNumber: '4-1', boxNumber: '1:84', visitStatus: 'Pending' },
  { id: 't18', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-70', cabinetNumber: '1-1', boxNumber: '31:50', visitStatus: 'Pending' },
  { id: 't18a', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-70', cabinetNumber: '3-1', boxNumber: '1:60', visitStatus: 'Pending' },
  { id: 't19', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-21', cabinetNumber: '13-5', boxNumber: '1:88', visitStatus: 'Done' },
  { id: 't20', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-32', cabinetNumber: '7-2', boxNumber: '1:180', visitStatus: 'Done' },
  { id: 't20a', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'Abu Hammad', subExchange: 'Abu Hammad', exchangeCode: 'ABHSH', msanCode: '07-4-22-50', cabinetNumber: 'z50', boxNumber: '1:49', visitStatus: 'Pending' },
  
  // Aga (Dakahlia)
  { id: 't21', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '1', visitStatus: 'Done' },
  { id: 't22', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '10', visitStatus: 'Done' },
  { id: 't23', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '11', visitStatus: 'Done' },
  { id: 't24', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '12', visitStatus: 'Pending' },
  { id: 't25', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '13', visitStatus: 'Pending' },
  { id: 't25a', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-01', cabinetNumber: '2-1', boxNumber: '14', visitStatus: 'Pending' },
  { id: 't26', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-02', cabinetNumber: '1-1', boxNumber: '10', visitStatus: 'Done' },
  { id: 't27', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-02', cabinetNumber: '1-1', boxNumber: '11', visitStatus: 'Done' },
  { id: 't28', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-02', cabinetNumber: '1-1', boxNumber: '12', visitStatus: 'Pending' },
  { id: 't29', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'Aga', subExchange: 'Aga', exchangeCode: 'AGADK', msanCode: '07-1-07-02', cabinetNumber: '1-1', boxNumber: '13', visitStatus: 'Pending' },
  
  // Nabaroh (Dakahlia)
  { id: 't30', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '1', visitStatus: 'Done' },
  { id: 't31', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '2', visitStatus: 'Done' },
  { id: 't32', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '3', visitStatus: 'Done' },
  { id: 't33', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '4', visitStatus: 'Pending' },
  { id: 't34', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '5', visitStatus: 'Pending' },
  { id: 't35', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '6', visitStatus: 'Pending' },
  { id: 't36', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Nabaroh', subExchange: 'Kafr El-Bahary Nabaroh', exchangeCode: 'ABHDK', msanCode: '07-2-635-01', cabinetNumber: '1-1', boxNumber: '7', visitStatus: 'Pending' },
  
  // Ismailia
  { id: 't40', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '1', visitStatus: 'Done' },
  { id: 't41', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '2', visitStatus: 'Done' },
  { id: 't42', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '3', visitStatus: 'Done' },
  { id: 't43', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '4', visitStatus: 'Pending' },
  { id: 't44', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '5', visitStatus: 'Pending' },
  { id: 't45', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 2', subExchange: 'Abu Atwa', exchangeCode: 'ABAAS', msanCode: '13-1-09-01', cabinetNumber: '2-1m', boxNumber: '6', visitStatus: 'Pending' },

  // Suez
  { id: 't50', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Suez Amer Village', subExchange: 'Suez Amer Village', exchangeCode: 'AMRSZ', msanCode: '14-1-80-11', cabinetNumber: '1-2', boxNumber: '21', visitStatus: 'Done' },
  { id: 't51', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Suez Amer Village', subExchange: 'Suez Amer Village', exchangeCode: 'AMRSZ', msanCode: '14-1-80-11', cabinetNumber: '1-2', boxNumber: '22', visitStatus: 'Done' },
  { id: 't52', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Suez Amer Village', subExchange: 'Suez Amer Village', exchangeCode: 'AMRSZ', msanCode: '14-1-80-11', cabinetNumber: '1-2', boxNumber: '23', visitStatus: 'Done' },
  { id: 't53', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Suez Amer Village', subExchange: 'Suez Amer Village', exchangeCode: 'AMRSZ', msanCode: '14-1-80-11', cabinetNumber: '1-2', boxNumber: '24', visitStatus: 'Pending' },
  { id: 't54', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Suez Amer Village', subExchange: 'Suez Amer Village', exchangeCode: 'AMRSZ', msanCode: '14-1-80-11', cabinetNumber: '1-2', boxNumber: '25', visitStatus: 'Pending' },
  
  // Qalyubia
  { id: 't60', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-05', cabinetNumber: '6-1', boxNumber: '1', visitStatus: 'Done' },
  { id: 't61', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-05', cabinetNumber: '6-1', boxNumber: '10', visitStatus: 'Done' },
  { id: 't62', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-05', cabinetNumber: '6-1', boxNumber: '11', visitStatus: 'Done' },
  { id: 't63', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-05', cabinetNumber: '6-1', boxNumber: '12', visitStatus: 'Pending' },
  { id: 't64', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-05', cabinetNumber: '6-1', boxNumber: '13', visitStatus: 'Pending' },

  // Damietta
  { id: 't70', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Abbasiya Damietta', exchangeCode: 'ABSDT', msanCode: '07-5-340-26', cabinetNumber: '5-1', boxNumber: '1', visitStatus: 'Done' },
  { id: 't71', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Abbasiya Damietta', exchangeCode: 'ABSDT', msanCode: '07-5-340-26', cabinetNumber: '5-1', boxNumber: '10', visitStatus: 'Done' },
  { id: 't72', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Abbasiya Damietta', exchangeCode: 'ABSDT', msanCode: '07-5-340-26', cabinetNumber: '5-1', boxNumber: '11', visitStatus: 'Done' },
  { id: 't73', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Abbasiya Damietta', exchangeCode: 'ABSDT', msanCode: '07-5-340-26', cabinetNumber: '5-1', boxNumber: '12', visitStatus: 'Pending' },
];

export const MOCK_FTTH_INVENTORY: FTTHInventoryItem[] = [
    // Existing Suez/Faisal Data
    { id: 'f1', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Faisal', subExchange: 'Faisal', exchangeCode: 'FYSSZ', msanCode: '14-1-02-900', passiveCabinet: 'ESM EL SHORTA FAISAL', boxCapacity: '36', boxNumber: 'BOX1', visitStatus: 'Done' },
    { id: 'f2', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Faisal', subExchange: 'Faisal', exchangeCode: 'FYSSZ', msanCode: '14-1-02-900', passiveCabinet: 'FUTURE GARDEN CB(1-1)', boxCapacity: '36', boxNumber: 'BOX1', visitStatus: 'Done' },
    { id: 'f3', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Faisal', subExchange: 'Faisal', exchangeCode: 'FYSSZ', msanCode: '14-1-02-900', passiveCabinet: 'FUTURE GARDEN CB(1-1)', boxCapacity: '36', boxNumber: 'BOX10', visitStatus: 'Done' },
    { id: 'f4', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Faisal', subExchange: 'Faisal', exchangeCode: 'FYSSZ', msanCode: '14-1-02-900', passiveCabinet: 'FUTURE GARDEN CB(1-1)', boxCapacity: '36', boxNumber: 'BOX11', visitStatus: 'Done' },
    { id: 'f5', sector: 'Suez Sector', region: 'Suez Telephones Zone', mainExchange: 'Faisal', subExchange: 'Faisal', exchangeCode: 'FYSSZ', msanCode: '14-1-02-900', passiveCabinet: 'FUTURE GARDEN CB(1-1)', boxCapacity: '16', boxNumber: 'BOX13', visitStatus: 'Done' },

    // 1. El-Senbellawein (Dakahlia 1)
    { id: 'dk1_1', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-953', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '3', visitStatus: 'Pending' },
    { id: 'dk1_2', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-953', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '4', visitStatus: 'Pending' },
    { id: 'dk1_3', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-953', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '2', visitStatus: 'Pending' },
    { id: 'dk1_4', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-953', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '1', visitStatus: 'Done' },
    { id: 'dk1_5', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-900', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '39', visitStatus: 'Done' },
    { id: 'dk1_6', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-900', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '37', visitStatus: 'Done' },
    { id: 'dk1_7', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 1', mainExchange: 'El-Senbellawein', subExchange: 'El-Senbellawein', exchangeCode: 'SNBDK', msanCode: '07-1-361-900', passiveCabinet: 'HAY EL TAYARA CB(4-1)', boxCapacity: '8', boxNumber: '40', visitStatus: 'Done' },
    
    // 2. Sherbin (Dakahlia 2)
    { id: 'dk2_1', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Sherbin', subExchange: 'Kafr El-Sheikh Attia Sherbin', exchangeCode: 'ATIDK', msanCode: '07-2-413-950', passiveCabinet: 'ALAHMADIA CB(B-1)', boxCapacity: '8', boxNumber: '3', visitStatus: 'Pending' },
    { id: 'dk2_2', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Sherbin', subExchange: 'Kafr El-Sheikh Attia Sherbin', exchangeCode: 'ATIDK', msanCode: '07-2-413-950', passiveCabinet: 'ALAHMADIA CB(B-1)', boxCapacity: '8', boxNumber: '6', visitStatus: 'Pending' },
    { id: 'dk2_3', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Sherbin', subExchange: 'Kafr El-Sheikh Attia Sherbin', exchangeCode: 'ATIDK', msanCode: '07-2-413-950', passiveCabinet: 'ALAHMADIA CB(B-1)', boxCapacity: '8', boxNumber: '2', visitStatus: 'Pending' },
    { id: 'dk2_4', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Sherbin', subExchange: 'Kafr El-Sheikh Attia Sherbin', exchangeCode: 'ATIDK', msanCode: '07-2-413-950', passiveCabinet: 'ALAHMADIA CB(B-1)', boxCapacity: '8', boxNumber: '7', visitStatus: 'Pending' },
    { id: 'dk2_5', sector: 'East Delta 1', region: 'Dakahlia Telephones Zone 2', mainExchange: 'Sherbin', subExchange: 'Kafr El-Sheikh Attia Sherbin', exchangeCode: 'ATIDK', msanCode: '07-2-413-950', passiveCabinet: 'ALAHMADIA CB(B-1)', boxCapacity: '8', boxNumber: '1', visitStatus: 'Pending' },

    // 3. Kafr Saad (Damietta)
    { id: 'dam_1', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Mit Abu Ghaleb', exchangeCode: 'MGHDT', msanCode: '07-5-239-850', passiveCabinet: 'KAFR EL MANAZLA CB(A1)', boxCapacity: '8', boxNumber: '8', visitStatus: 'Done' },
    { id: 'dam_2', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Mit Abu Ghaleb', exchangeCode: 'MGHDT', msanCode: '07-5-239-850', passiveCabinet: 'KAFR EL MANAZLA CB(A1)', boxCapacity: '8', boxNumber: '6', visitStatus: 'Done' },
    { id: 'dam_3', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Mit Abu Ghaleb', exchangeCode: 'MGHDT', msanCode: '07-5-239-850', passiveCabinet: 'KAFR EL MANAZLA CB(A1)', boxCapacity: '8', boxNumber: '3', visitStatus: 'Done' },
    { id: 'dam_4', sector: 'East Delta 1', region: 'Damietta Telephones Zone', mainExchange: 'Kafr Saad', subExchange: 'Mit Abu Ghaleb', exchangeCode: 'MGHDT', msanCode: '07-5-239-850', passiveCabinet: 'KAFR EL MANAZLA CB(A1)', boxCapacity: '8', boxNumber: '4', visitStatus: 'Done' },

    // 4. 10th of Ramadan 2 (Sharqia 1)
    { id: 'sh1_1', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: '10th of Ramadan 2', subExchange: '10th of Ramadan 2 Desert', exchangeCode: 'AS2SH', msanCode: '07-3-153-862', passiveCabinet: 'MASTER GOLD CB(1-4)', boxCapacity: '16', boxNumber: '37', visitStatus: 'Done' },
    { id: 'sh1_2', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: '10th of Ramadan 2', subExchange: '10th of Ramadan 2 Desert', exchangeCode: 'AS2SH', msanCode: '07-3-153-862', passiveCabinet: 'MASTER GOLD CB(1-4)', boxCapacity: '16', boxNumber: '3', visitStatus: 'Done' },
    { id: 'sh1_3', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: '10th of Ramadan 2', subExchange: '10th of Ramadan 2 Desert', exchangeCode: 'AS2SH', msanCode: '07-3-153-862', passiveCabinet: 'MASTER GOLD CB(1-4)', boxCapacity: '2', boxNumber: '13', visitStatus: 'Done' },
    { id: 'sh1_4', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: '10th of Ramadan 2', subExchange: '10th of Ramadan 2 Desert', exchangeCode: 'AS2SH', msanCode: '07-3-153-862', passiveCabinet: 'MASTER GOLD CB(1-4)', boxCapacity: '2', boxNumber: '14', visitStatus: 'Done' },
    { id: 'sh1_5', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 1', mainExchange: '10th of Ramadan 2', subExchange: '10th of Ramadan 2 Desert', exchangeCode: 'AS2SH', msanCode: '07-3-153-862', passiveCabinet: 'MASTER GOLD CB(1-4)', boxCapacity: '2', boxNumber: '18', visitStatus: 'Pending' },

    // 5. El-Husseiniya (Sharqia 2)
    { id: 'sh2_1', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Al-Akhiwah', exchangeCode: 'AKHSH', msanCode: '07-4-43-850', passiveCabinet: 'ELMONAGAA ELSAGHERA CB(1-1)', boxCapacity: '8', boxNumber: '2', visitStatus: 'Pending' },
    { id: 'sh2_2', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Al-Akhiwah', exchangeCode: 'AKHSH', msanCode: '07-4-43-850', passiveCabinet: 'ELMONAGAA ELSAGHERA CB(1-1)', boxCapacity: '8', boxNumber: '5', visitStatus: 'Pending' },
    { id: 'sh2_3', sector: 'East Delta 2', region: 'Sharqia Telephones Zone 2', mainExchange: 'El-Husseiniya', subExchange: 'Al-Akhiwah', exchangeCode: 'AKHSH', msanCode: '07-4-43-850', passiveCabinet: 'ELMONAGAA ELSAGHERA CB(1-1)', boxCapacity: '8', boxNumber: '6', visitStatus: 'Pending' },
    
    // 6. Shebin El-Qanater (Qalyubia)
    { id: 'qal_1', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-952', passiveCabinet: 'ARAB EL SAWALHA CB(3-1)', boxCapacity: '8', boxNumber: '6', visitStatus: 'Pending' },
    { id: 'qal_2', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-952', passiveCabinet: 'ARAB EL SAWALHA CB(3-1)', boxCapacity: '8', boxNumber: '4', visitStatus: 'Pending' },
    { id: 'qal_3', sector: 'East Delta 2', region: 'Qalyubia Telephones Zone', mainExchange: 'Shebin El-Qanater', subExchange: 'Arab Jehena', exchangeCode: 'AGHKB', msanCode: '08-3-205-952', passiveCabinet: 'ARAB EL SAWALHA CB(3-1)', boxCapacity: '8', boxNumber: '3', visitStatus: 'Pending' },

    // 7. Ismailia 1 (Ismailia)
    { id: 'ism_1', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 1', subExchange: 'Ismailia 1', exchangeCode: 'ISMAS', msanCode: '13-1-01-956', passiveCabinet: 'EL GALAA', boxCapacity: '16', boxNumber: 'BOX1', visitStatus: 'Pending' },
    { id: 'ism_2', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 1', subExchange: 'Ismailia 1', exchangeCode: 'ISMAS', msanCode: '13-1-01-970', passiveCabinet: 'MABNA EL MOHAFZA', boxCapacity: '36', boxNumber: 'BOX 1', visitStatus: 'Pending' },
    { id: 'ism_3', sector: 'Ismailia & North Sinai', region: 'Ismailia Telephones Zone', mainExchange: 'Ismailia 1', subExchange: 'Ismailia 1', exchangeCode: 'ISMAS', msanCode: '13-1-01-970', passiveCabinet: 'SUB_CABINET (1-1)', boxCapacity: '24', boxNumber: '(1-1)BOX07', visitStatus: 'Pending' },

    // 8. Tanta 1 (Gharbia 1)
    { id: 'gha1_1', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 1', mainExchange: 'Tanta 1', subExchange: 'Tanta 1', exchangeCode: 'TN1GH', msanCode: '', passiveCabinet: 'EL MAMALEK SQUARE CB(1-1)', boxCapacity: '16', boxNumber: '4', visitStatus: 'Done' },
    { id: 'gha1_2', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 1', mainExchange: 'Tanta 1', subExchange: 'Tanta 1', exchangeCode: 'TN1GH', msanCode: '', passiveCabinet: 'EL MAMALEK SQUARE CB(1-1)', boxCapacity: '16', boxNumber: '3', visitStatus: 'Done' },
    { id: 'gha1_3', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 1', mainExchange: 'Tanta 1', subExchange: 'Tanta 1', exchangeCode: 'TN1GH', msanCode: '', passiveCabinet: 'EL MAMALEK SQUARE CB(1-1)', boxCapacity: '16', boxNumber: '10', visitStatus: 'Done' },

    // 9. Mahalla 2 (Gharbia 2)
    { id: 'gha2_1', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 2', mainExchange: 'Mahalla 2', subExchange: 'Mahalla 2', exchangeCode: 'MH2GH', msanCode: '08-1-06-850', passiveCabinet: 'MAHALA2(2-1)', boxCapacity: '24', boxNumber: 'CAB 2-1 BOX 01', visitStatus: 'Done' },
    { id: 'gha2_2', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 2', mainExchange: 'Mahalla 2', subExchange: 'Mahalla 2', exchangeCode: 'MH2GH', msanCode: '08-1-06-850', passiveCabinet: 'MAHALA2(2-1)', boxCapacity: '24', boxNumber: 'CAB 2-1 BOX 02', visitStatus: 'Done' },
    { id: 'gha2_3', sector: 'Middle Delta', region: 'Gharbia Telephones Zone 2', mainExchange: 'Mahalla 2', subExchange: 'Mahalla 2', exchangeCode: 'MH2GH', msanCode: '08-1-06-850', passiveCabinet: 'MAHALA2(2-1)', boxCapacity: '24', boxNumber: 'CAB 2-1 BOX 03', visitStatus: 'Done' },

    // 10. Shebin El-Kom 1 (Menoufia)
    { id: 'men_1', sector: 'Middle Delta', region: 'Menoufia Telephones Zone', mainExchange: 'Shebin El-Kom 1', subExchange: 'El-Batanon', exchangeCode: 'BTNMF', msanCode: '08-2-412-905', passiveCabinet: 'TAKI EL DEEN CB(1-1-1)', boxCapacity: '8', boxNumber: '1', visitStatus: 'Pending' },
    { id: 'men_2', sector: 'Middle Delta', region: 'Menoufia Telephones Zone', mainExchange: 'Shebin El-Kom 1', subExchange: 'El-Batanon', exchangeCode: 'BTNMF', msanCode: '08-2-412-905', passiveCabinet: 'TAKI EL DEEN CB(1-1-1)', boxCapacity: '8', boxNumber: '3', visitStatus: 'Pending' },
    { id: 'men_3', sector: 'Middle Delta', region: 'Menoufia Telephones Zone', mainExchange: 'Shebin El-Kom 1', subExchange: 'El-Batanon', exchangeCode: 'BTNMF', msanCode: '08-2-412-905', passiveCabinet: 'TAKI EL DEEN CB(1-1-1)', boxCapacity: '8', boxNumber: '4', visitStatus: 'Pending' },
];

export const MOCK_INSPECTIONS: Inspection[] = [
  { id: 'i1', type: 'TDM', centerId: 'c1', inspectorId: 'u2', date: '2023-10-25', status: 'submitted', data: {} },
  { id: 'i2', type: 'FTTH_CABINET', centerId: 'c2', inspectorId: 'u2', date: '2023-10-26', status: 'submitted', data: {} },
  { id: 'i3', type: 'TDM', centerId: 'c1', inspectorId: 'u2', date: '2023-10-27', status: 'pending', data: {} },
  { id: 'i4', type: 'FTTH_BOX', centerId: 'c2', inspectorId: 'u2', date: '2023-10-28', status: 'submitted', data: {} },
];
