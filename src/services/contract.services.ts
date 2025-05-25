// @/api/missions.ts
import axios from 'axios';
// import { Contract, ContractStatus } from '@/types/contract';
import { delay } from '@/utils/helpers.utils';
import { SettingServices } from './setting.services';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';

// Types (à définir dans src/types/contract.ts)
/*
export type ContractStatus = 'draft' | 'pending' | 'active' | 'terminated' | 'cancelled';

export interface Contract {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: ContractStatus;
  clientId: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  updatedAt: string;
}
*/

// Mock data - À remplacer par des appels API réels
const mockContracts: any[] = [
  {
    id: '1',
    title: 'Contrat Garde Enfant',
    description: 'Garde régulière après l\'école',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    amount: 1200,
    status: 'active',
    clientId: 'user1',
    clientName: 'Dupont Jean',
    clientPhone: '+33612345678',
    createdAt: '2023-08-15',
    updatedAt: '2023-08-20'
  },
  {
    id: '2',
    title: 'Contrat Garde Ponctuelle',
    description: 'Garde occasionnelle week-end',
    startDate: '2023-10-01',
    endDate: '2024-05-31',
    amount: 800,
    status: 'pending',
    clientId: 'user2',
    clientName: 'Martin Sophie',
    clientPhone: '+33687654321',
    createdAt: '2023-09-10',
    updatedAt: '2023-09-10'
  }
];



interface Family {
  id: string;
  name: string;
  photo: string;
  rating: number;
  phone: string;
}

interface Mission {
  id: string;
  startTime: string;
  endTime: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  price: number;
  status: string;
  family: Family;
}

export const fetchMission = async (id: string): Promise<Mission> => {
  const response = SettingServices().listSetting(`${URL_API_ROUTE.CONTRACT_FIND_ONE}/${id}`);
  return response;
};

export const confirmMission = async (id: string): Promise<void> => {
  const response = SettingServices().createSetting(`${URL_API_ROUTE.CONTRACT_STATUS.replace(':id', id)}`, { status: 'Accepted' });
  return response;
};

export const cancelMission = async (id: string): Promise<void> => {
  const response = SettingServices().createSetting(`${URL_API_ROUTE.CONTRACT_STATUS.replace(':id', id)}`, { status: 'Canceled' });
  return response;
};

// Simule un appel API avec délai
const fakeApiCall = <T>(data: T, success: boolean = true, errorMsg?: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    delay(500).then(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error(errorMsg || 'Erreur API simulée'));
      }
    });
  });
};

export const fetchContracts = async (): Promise<any[]> => {
  const response = SettingServices().listSetting(`${URL_API_ROUTE.CONTRACT_ALL}`);
  return response;
};

export const confirmContract = async (contractId: string): Promise<any> => {
  // En production: await fetch(`/api/contracts/${contractId}/confirm`, { method: 'POST' });
  
  const contract = mockContracts.find(c => c.id === contractId);
  if (!contract) {
    return fakeApiCall(null, false, 'Contrat non trouvé');
  }
  
  if (contract.status !== 'pending') {
    return fakeApiCall(null, false, 'Seuls les contrats en attente peuvent être confirmés');
  }
  
  contract.status = 'active';
  contract.updatedAt = new Date().toISOString();
  return fakeApiCall(undefined);
};

export const terminateContract = async (contractId: string): Promise<any> => {
  // En production: await fetch(`/api/contracts/${contractId}/terminate`, { method: 'POST' });
  
  const contract = mockContracts.find(c => c.id === contractId);
  if (!contract) {
    return fakeApiCall(null, false, 'Contrat non trouvé');
  }
  
  if (contract.status !== 'active') {
    return fakeApiCall(null, false, 'Seuls les contrats actifs peuvent être résiliés');
  }
  
  contract.status = 'terminated';
  contract.updatedAt = new Date().toISOString();
  return fakeApiCall(undefined);
};

export const requestTermination = async (contractId: string): Promise<any> => {
  // En production: await fetch(`/api/contracts/${contractId}/request-termination`, { method: 'POST' });
  
  const contract = mockContracts.find(c => c.id === contractId);
  if (!contract) {
    return fakeApiCall(null, false, 'Contrat non trouvé');
  }
  
  if (contract.status !== 'active') {
    return fakeApiCall(null, false, 'Seuls les contrats actifs peuvent faire l\'objet d\'une demande de résiliation');
  }
  
  // Dans une vraie implémentation, on créerait une demande de résiliation
  return fakeApiCall(undefined);
};

export const getContractDetails = async (contractId: string): Promise<any> => {
  // En production: const response = await fetch(`/api/contracts/${contractId}`);
  // return await response.json();
  
  const contract = mockContracts.find(c => c.id === contractId);
  if (!contract) {
    return fakeApiCall(null, false, 'Contrat non trouvé');
  }
  
  return fakeApiCall(contract);
};

// Utils (à mettre dans src/utils/helpers.ts)
/*
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
*/