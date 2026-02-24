
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lowongan, Perusahaan, PencariKerja } from '../types';
import { routingData } from '../services/routingData';

interface DataContextType {
  jobs: Lowongan[];
  companies: Perusahaan[];
  talents: PencariKerja[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addJob: (job: Lowongan) => void;
  addCompany: (company: Perusahaan) => void;
  deleteJob: (id: string) => void;
  deleteCompany: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Lowongan[]>([]);
  const [companies, setCompanies] = useState<Perusahaan[]>([]);
  const [talents, setTalents] = useState<PencariKerja[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch from routingData (Strictly Cloudflare Worker)
      // Force refresh for critical data
      const [jobsResult, companiesResult, talentsResult] = await Promise.allSettled([
        routingData.getJobs(),
        routingData.getCompanies(),
        routingData.getTalents()
      ]);

      const jobsData = jobsResult.status === 'fulfilled' ? jobsResult.value : [];
      const companiesData = companiesResult.status === 'fulfilled' ? companiesResult.value : [];
      const talentsData = talentsResult.status === 'fulfilled' ? talentsResult.value : [];

      if (jobsResult.status === 'rejected') console.error("Jobs failed", jobsResult.reason);
      if (companiesResult.status === 'rejected') console.error("Companies failed", companiesResult.reason);
      if (talentsResult.status === 'rejected') console.error("Talents failed", talentsResult.reason);

      // Join relational data for jobs (map companyId to full company object)
      const jobsWithCompany = jobsData.map(job => {
          const company = companiesData.find(c => c.perusahaan_id === job.perusahaan_id);
          return {
              ...job,
              perusahaan: company || ({} as Perusahaan) // Fallback empty if not found in relation
          }
      });

      setJobs(jobsWithCompany);
      setCompanies(companiesData);
      setTalents(talentsData);
      
    } catch (error) {
      console.error("Failed to load data from Cloudflare:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data from Cloudflare API
  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => loadData();

  const addJob = async (job: Lowongan) => {
    try {
        const res: any = await routingData.createJob(job);
        if (res.success) {
            setJobs(prev => {
                const exists = prev.find(j => j.lowongan_id === job.lowongan_id);
                if (exists) return prev.map(j => j.lowongan_id === job.lowongan_id ? job : j);
                return [job, ...prev];
            });
        }
    } catch (e) { console.error("Failed to save job", e); }
  };

  const deleteJob = async (id: string) => {
    try {
        const res: any = await routingData.deleteJob(id);
        if (res.success) {
            setJobs(prev => prev.filter(j => j.lowongan_id !== id));
        }
    } catch (e) { console.error("Failed to delete job", e); }
  };

  const addCompany = async (company: Perusahaan) => {
    try {
        const res: any = await routingData.createCompany(company);
        if (res.success) {
             setCompanies(prev => {
                const exists = prev.find(c => c.perusahaan_id === company.perusahaan_id);
                if (exists) return prev.map(c => c.perusahaan_id === company.perusahaan_id ? company : c);
                return [company, ...prev];
            });
        }
    } catch (e) { console.error("Failed to save company", e); }
  };

  const deleteCompany = async (id: string) => {
    try {
        const res: any = await routingData.deleteCompany(id);
        if (res.success) {
            setCompanies(prev => prev.filter(c => c.perusahaan_id !== id));
            // Also remove jobs from this company locally
            setJobs(prev => prev.filter(j => j.perusahaan_id !== id));
        }
    } catch (e) { console.error("Failed to delete company", e); }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, companies, talents, loading, refreshData,
      addJob, addCompany, deleteJob, deleteCompany
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
