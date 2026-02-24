
import { routingData } from './routingData';

export const pekerjaanService = {
  getAll: (params?: any) => routingData.getJobs(), // Uses cached fetch
  getById: (id: string) => routingData.fetch(`/api/v2/jobs/${id}`), // Generic fetch if detail endpoint exists
  create: (data: any) => routingData.post('/api/v2/jobs', data),
};
