import api from './api';

export const offersApi = {
  getOffers: async () => {
    const response = await api.get('/offers');
    return response.data;
  },

  createOffer: async (offerData) => {
    const response = await api.post('/offers', offerData);
    return response.data;
  },

  acceptOffer: async (offerId) => {
    const response = await api.patch(`/offers/${offerId}/accept`);
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get(`/admin/jobs/${jobId}/applicants`);
    return response.data;
  }
};
