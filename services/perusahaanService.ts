
import { routingData } from './routingData';

export const perusahaanService = {
  getAll: () => routingData.getCompanies(),
  getBySlug: (slug: string) => routingData.fetch(`/api/v2/companies/${slug}`),
};
