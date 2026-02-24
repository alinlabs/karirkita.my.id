
import { routingData } from './routingData';

export const profilService = {
  updateProfile: (data: any) => routingData.post('/api/v2/profile/update', data),
  uploadAvatar: (file: FormData) => routingData.post('/api/v2/profile/avatar', file),
};
