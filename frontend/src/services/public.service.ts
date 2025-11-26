import api from './api';

export interface Package {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number; // Aylık fiyat (temel fiyat)
  price1Month?: number | null; // 1 ay için özel fiyat
  price6Months?: number | null; // 6 ay için özel fiyat
  price12Months?: number | null; // 12 ay için özel fiyat
  duration: number;
  isActive: boolean;
  displayOrder: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const publicService = {
  getPackages: async (): Promise<Package[]> => {
    const response = await api.get('/public/packages');
    return response.data.packages;
  },

  getPackage: async (id: string): Promise<Package> => {
    const response = await api.get(`/public/packages/${id}`);
    return response.data.package;
  },

  submitContact: async (data: ContactFormData) => {
    const response = await api.post('/public/contact', data);
    return response.data;
  },
};

