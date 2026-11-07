import api from './api';

export const jobsApi = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  toggleJobStatus: async (jobId, isOpen) => {
    const response = await api.patch(`/jobs/${jobId}/status`, null, {
      params: { is_open: isOpen }
    });
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  createCompany: async (companyName) => {
    const response = await api.post('/companies', { company_name: companyName });
    return response.data;
  },
};
