
import { routingData } from './routingData';

export const pelamarService = {
  getAll: (params?: any) => routingData.getTalents(),
  getByUsername: (username: string) => routingData.fetch(`/api/v2/users/${username}`),
};
