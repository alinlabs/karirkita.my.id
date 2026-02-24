
import { Lowongan, Perusahaan, PencariKerja, Mitra, Testimoni, Notifikasi, City, Identitas, Kelas, Mentor, Promosi } from '../types';

/**
 * ============================================================================
 * CONFIGURATION & CONSTANTS
 * ============================================================================
 */
// NOTE: Change this to your actual Cloudflare Worker URL in production
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "https://api.karirkita.workers.dev/"; 

const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/IDR';

export type DataKey = "karirkita" | "halaman" | "options" | "skill" | "notifikasi" | "icon" | "grup" | "kelas" | "promosi";

/**
 * ============================================================================
 * LOGGING SYSTEM
 * ============================================================================
 */
export interface LogEntry {
    id: number;
    timestamp: string;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    source?: string;
}

export const apiLogs: LogEntry[] = [];

const log = (type: 'info' | 'success' | 'error' | 'warning', message: string, source: string) => {
    const lastLog = apiLogs[0];
    if (lastLog && lastLog.message === message && (Date.now() - lastLog.id < 1000)) return;

    const uniqueId = Date.now() + Math.random();
    apiLogs.unshift({ id: uniqueId, timestamp: new Date().toLocaleTimeString(), type, message, source });
    if(apiLogs.length > 50) apiLogs.pop();
    
    if (type !== 'info' && import.meta.env.DEV) {
        const color = type === 'error' ? 'red' : type === 'warning' ? 'orange' : type === 'success' ? 'green' : 'blue';
        console.log(`%c[${source}] ${message}`, `color: ${color}`);
    }
};

/**
 * ============================================================================
 * CACHING & STATE
 * ============================================================================
 */
interface CacheEntry {
    promise: Promise<any>;
    timestamp: number;
    ttl: number;
}

const requestCache: Record<string, CacheEntry | undefined> = {};
const translationCache: Record<string, string> = {};
let ratesCache: Record<string, number> | null = null;

// TTL Configuration (in milliseconds)
const CACHE_TTL = {
    STATIC: 24 * 60 * 60 * 1000, // 24 Hours for KV (options, icons, skills, halaman, karirkita)
    DYNAMIC: 60 * 1000,          // 1 Minute for API endpoints (Jobs, Users, Companies) to save requests
    SHORT: 10 * 1000             // 10 Seconds for semi-static
};

const getTTL = (endpoint: string): number => {
    if (endpoint.includes('api/v2')) return CACHE_TTL.DYNAMIC;
    if (['notifikasi'].includes(endpoint)) return CACHE_TTL.DYNAMIC;
    // KV Data Types are STATIC
    if (['karirkita', 'halaman', 'options', 'skill', 'icon'].includes(endpoint)) return CACHE_TTL.STATIC;
    return CACHE_TTL.STATIC;
};

export const routingData = {
  
  getLogs: () => [...apiLogs],

  // 1. Universal GET Fetcher
  async fetch<T>(endpoint: string, forceRefresh = false): Promise<T> {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const now = Date.now();
      const cached = requestCache[cleanEndpoint];
      
      // Return cached if valid and not forced
      if (!forceRefresh && cached && (now - cached.timestamp < cached.ttl)) {
          // console.log(`[API] GET /${cleanEndpoint} (CACHE)`); // Optional: Uncomment for debug
          return cached.promise;
      }

      const fetchPromise = (async () => {
          let retries = 3;
          let delay = 1000;
          
          while (retries > 0) {
              try {
                  // Ensure WORKER_URL ends with slash if needed, or handle cleanEndpoint properly
                  const baseUrl = WORKER_URL.endsWith('/') ? WORKER_URL : `${WORKER_URL}/`;
                  const separator = cleanEndpoint.includes('?') ? '&' : '?';
                  const cacheBuster = `${separator}t=${now}`; 
                  const url = `${baseUrl}${cleanEndpoint}${cacheBuster}`;

                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 10000); 
                  
                  const response = await fetch(url, { 
                      signal: controller.signal,
                      headers: { 'Content-Type': 'application/json' }
                  });
                  clearTimeout(timeoutId);

                  const contentType = response.headers.get("content-type");
                  if (contentType && contentType.includes("text/html")) {
                     const text = await response.text();
                     console.error(`Received HTML response from ${url}:`, text.substring(0, 500));
                     throw new Error(`Received HTML response from ${url}. Check VITE_WORKER_URL configuration.`);
                  }

                  if (!response.ok) {
                      throw new Error(`Status ${response.status} ${response.statusText} from ${url}`);
                  }
                  
                  const data = await response.json();
                  if (!data) throw new Error("Empty response data");
                  if ((data as any).error) throw new Error((data as any).error);

                  if (import.meta.env.DEV) console.log(`[API] GET /${cleanEndpoint} (NETWORK)`);
                  return data as T;

              } catch (err: any) {
                  retries--;
                  if (retries === 0) {
                      const errorMsg = err.name === 'AbortError' ? 'Timeout' : err.message;
                      console.error(`[API] GET /${cleanEndpoint} FAILED: ${errorMsg}`);
                      throw err;
                  }
                  await new Promise(res => setTimeout(res, delay));
                  delay *= 2; // Exponential backoff
              }
          }
          throw new Error("Max retries reached");
      })();

      // Store in cache with TTL
      requestCache[cleanEndpoint] = {
          promise: fetchPromise,
          timestamp: now,
          ttl: getTTL(cleanEndpoint)
      };
      
      // Cleanup cache if promise fails (optional, but good for retries)
      fetchPromise.catch(() => { delete requestCache[cleanEndpoint]; });

      return fetchPromise;
  },

  // Prefetch Reference Data
  async prefetchReferenceData() {
      const keys = ['karirkita', 'options', 'skill', 'halaman', 'icon'];
      const now = Date.now();

      try {
          // Try batch fetch first
          const data = await routingData.fetch<any>('api/v2/reference');
          
          keys.forEach(key => {
              if (data[key]) {
                  requestCache[key] = {
                      promise: Promise.resolve(data[key]),
                      timestamp: now,
                      ttl: CACHE_TTL.STATIC
                  };
              }
          });
          if (import.meta.env.DEV) console.log('[API] Reference Data Prefetched (Batch)');
      } catch (e) {
          console.warn("Batch prefetch failed, falling back to individual fetches", e);
          
          // Fallback: Fetch individually in parallel
          keys.forEach(key => {
              // Trigger fetch and let it cache itself
              routingData.get(key as DataKey).catch(err => console.error(`Failed to prefetch ${key}`, err));
          });
      }
  },

  // 2. Universal POST Sender
  async post<T>(endpoint: string, body: any): Promise<T> {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const baseUrl = WORKER_URL.endsWith('/') ? WORKER_URL : `${WORKER_URL}/`;
      const url = `${baseUrl}${cleanEndpoint}`;

      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
              signal: controller.signal
          });
          clearTimeout(timeoutId);

          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
             const text = await res.text();
             console.error(`Received HTML response from ${url}:`, text.substring(0, 500));
             throw new Error(`Received HTML response from ${url}. Check VITE_WORKER_URL configuration.`);
          }

          const data = await res.json();
          if (!res.ok) {
              throw new Error(data.error || `API Error: ${res.status}`);
          }
          
          if (import.meta.env.DEV) console.log(`[API] POST /${cleanEndpoint} (SUCCESS)`);

          // Update Cache if it's a KV update (Admin Action)
          if (['karirkita', 'halaman', 'options', 'skill', 'icon'].includes(cleanEndpoint)) {
             requestCache[cleanEndpoint] = {
                 promise: Promise.resolve(body), // Optimistically update cache with the new data
                 timestamp: Date.now(),
                 ttl: CACHE_TTL.STATIC
             };
          }
          
          // Invalidate related caches for API endpoints
          if (cleanEndpoint.includes('api/v2')) {
              // Simple invalidation strategy: clear all dynamic endpoints or specific ones
              // For now, let's clear the specific endpoint and its paginated versions if possible
              // But simpler is to just clear the exact match if it exists, or rely on TTL
              // Better: Clear all keys that start with the endpoint base
              const baseKey = cleanEndpoint.split('?')[0];
              Object.keys(requestCache).forEach(key => {
                  if (key.startsWith(baseKey)) {
                      delete requestCache[key];
                  }
              });
          }

          return data as T;
      } catch (error: any) {
          const errorMsg = error.name === 'AbortError' ? 'Timeout' : error.message;
          console.error(`[API] POST /${cleanEndpoint} FAILED: ${errorMsg}`);
          return { success: false, error: errorMsg || 'Network error' } as any;
      }
  },

  // 3. Universal DELETE Sender
  async delete<T>(endpoint: string, body?: any): Promise<T> {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const baseUrl = WORKER_URL.endsWith('/') ? WORKER_URL : `${WORKER_URL}/`;
      const url = `${baseUrl}${cleanEndpoint}`;

      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const res = await fetch(url, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: body ? JSON.stringify(body) : undefined,
              signal: controller.signal
          });
          clearTimeout(timeoutId);

          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
             const text = await res.text();
             console.error(`Received HTML response from ${url}:`, text.substring(0, 500));
             throw new Error(`Received HTML response from ${url}. Check VITE_WORKER_URL configuration.`);
          }

          const data = await res.json();
          if (!res.ok) {
              throw new Error(data.error || `API Error: ${res.status}`);
          }
          
          if (import.meta.env.DEV) console.log(`[API] DELETE /${cleanEndpoint} (SUCCESS)`);
          
          // Invalidate related caches
          if (cleanEndpoint.includes('api/v2')) {
              const baseKey = cleanEndpoint.split('?')[0];
              Object.keys(requestCache).forEach(key => {
                  if (key.startsWith(baseKey)) {
                      delete requestCache[key];
                  }
              });
          }

          return data as T;
      } catch (error: any) {
          const errorMsg = error.name === 'AbortError' ? 'Timeout' : error.message;
          console.error(`[API] DELETE /${cleanEndpoint} FAILED: ${errorMsg}`);
          return { success: false, error: errorMsg || 'Network error' } as any;
      }
  },

  // --- REPOSITORY LAYER ---

  get: async (key: DataKey) => routingData.fetch<any>(key),
  save: async (key: DataKey, data: any) => routingData.post(key, data),
  
  // Updated: Notifications now fetch from SQL endpoint
  getNotifications: () => routingData.fetch<Notifikasi[]>('api/v2/notifications'),
  
  getSkills: () => routingData.fetch<any>('skill').then(d => Array.isArray(d) ? d[0] : d),
  getMasterOptions: () => routingData.fetch<any>('options').then(d => Array.isArray(d) ? d[0] : d),
  getPageData: async () => {
      try {
          const d = await routingData.fetch<any>('halaman');
          return Array.isArray(d) ? (d[0] || {}) : d;
      } catch (e) {
          console.warn("Failed to fetch halaman from API, falling back to local", e);
          try {
            const res = await fetch('/data/halaman.json');
            const json = await res.json();
            return Array.isArray(json) ? (json[0] || {}) : json;
          } catch (err) {
            return {};
          }
      }
  },
  
  // New: Get Social Media Icons
  getIcons: async () => routingData.fetch<any>('icon').then(d => Array.isArray(d) ? (d[0] || {}) : d),
  
  // New: Get Groups
  getGroups: async () => {
      try {
          const d = await routingData.fetch<any>('grup');
          return Array.isArray(d) ? d : (d ? [d] : []);
      } catch (e) {
          console.warn("Failed to fetch groups from API, falling back to local", e);
          try {
            const res = await fetch('/data/grup.json');
            return await res.json();
          } catch (err) {
            return [];
          }
      }
  },

  // New: Get Kelas & Mentors
  getKelas: async (): Promise<{ kelas: Kelas[], mentors: Mentor[] }> => {
      try {
          const d = await routingData.fetch<any>('kelas');
          return d || { kelas: [], mentors: [] };
      } catch (e) {
          console.warn("Failed to fetch kelas from API, falling back to local", e);
          try {
            const res = await fetch('/data/kelas.json');
            return await res.json();
          } catch (err) {
            return { kelas: [], mentors: [] };
          }
      }
  },

  // New: Get Promosi
  getPromosi: async (): Promise<Promosi[]> => {
      try {
          const d = await routingData.fetch<any>('promosi');
          return Array.isArray(d) ? d : (d ? [d] : []);
      } catch (e) {
          console.warn("Failed to fetch promosi from API, falling back to local", e);
          try {
            const res = await fetch('/data/promosi.json');
            return await res.json();
          } catch (err) {
            return [];
          }
      }
  },

  getIdentity: async (): Promise<Identitas | any> => {
      try {
          const data = await routingData.fetch<any>('karirkita');
          const identity = Array.isArray(data) ? (data[0] || {}) : data || {};
          return {
              ...identity,
              logoUrl: identity.logoUrl || "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png",
              icoUrl: identity.icoUrl || "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.ico"
          };
      } catch (e) {
          console.warn("Failed to fetch karirkita from API, falling back to local", e);
          try {
            const res = await fetch('/data/karirkita.json');
            const data = await res.json();
            const identity = Array.isArray(data) ? (data[0] || {}) : data || {};
            return {
                ...identity,
                logoUrl: identity.logoUrl || "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png",
                icoUrl: identity.icoUrl || "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.ico"
            };
          } catch (err) {
            return {};
          }
      }
  },
  getPartners: async () => (await routingData.getIdentity()).mitra || [],
  getTestimonials: async () => (await routingData.getIdentity()).testimoni || [],

  // D1 Database Entities
  getJobs: (page = 1, limit = 50) => routingData.fetch<Lowongan[]>(`api/v2/jobs?page=${page}&limit=${limit}`),
  getCompanies: (id?: string) => routingData.fetch<Perusahaan[]>(`api/v2/companies${id ? `?id=${id.trim()}` : ''}`),
  getUserCompany: (userId: string) => routingData.fetch<Perusahaan[]>(`api/v2/companies?user_id=${userId.trim()}`),
  getTalents: (id?: string) => routingData.fetch<PencariKerja[]>(`api/v2/users${id ? `?id=${id.trim()}` : ''}`),

  // --- CRUD OPERATIONS (Real-time Cloudflare) ---
  
  // Jobs
  createJob: (job: Lowongan) => routingData.post('api/v2/jobs', job),
  updateJob: (id: string, job: any) => routingData.post('api/v2/jobs', { ...job, lowongan_id: id }), // POST handles upsert
  deleteJob: (id: string) => routingData.delete('api/v2/jobs', { id }),

  // Companies
  createCompany: (company: Perusahaan) => routingData.post('api/v2/companies', company),
  updateCompany: (id: string, company: any) => routingData.post('api/v2/companies', { ...company, perusahaan_id: id }),
  deleteCompany: (id: string) => routingData.delete('api/v2/companies', { id }),

  // Users
  updateUser: (id: string, user: any) => routingData.post('api/v2/users', { ...user, id_pengguna: id }),
  deleteUser: (id: string) => routingData.delete('api/v2/users', { id }),

  // Notifications
  sendNotification: (notification: Notifikasi) => routingData.post('api/v2/notifications', notification),
  deleteNotification: (id: number) => routingData.delete('api/v2/notifications', { id }),

  // --- ADMIN ACTIONS ---
  updateUserStatus: (userId: string, type: 'verifikasi' | 'promosi', value: string | boolean) =>
      routingData.post('api/v2/admin/users/status', { userId, type, value }),

  updateCompanyStatus: (companyId: string, type: 'verifikasi' | 'promosi', value: string | boolean) =>
      routingData.post('api/v2/admin/companies/status', { companyId, type, value }),

  // --- NEW ACTIONS (Sync & Tracking) ---
  applyJob: (userId: string, companyId: string) => 
      routingData.post('api/v2/actions/apply', { userId, companyId }),
  
  callTalent: (userId: string, companyId: string) => 
      routingData.post('api/v2/actions/call', { userId, companyId }),
  
  incrementView: (id: string, type: 'user' | 'company') => 
      routingData.post('api/v2/actions/view', { id, type }),

  // Static Data Helper
  getCities: async (): Promise<City[]> => {
      return [
        { id: "3171", province: "DKI Jakarta", type: "Kota", name: "Jakarta Selatan" },
        { id: "3173", province: "DKI Jakarta", type: "Kota", name: "Jakarta Pusat" },
        { id: "3273", province: "Jawa Barat", type: "Kota", name: "Bandung" },
        { id: "3275", province: "Jawa Barat", type: "Kota", name: "Bekasi" },
        { id: "3578", province: "Jawa Timur", type: "Kota", name: "Surabaya" },
        { id: "3214", province: "Jawa Barat", type: "Kabupaten", name: "Purwakarta" },
        { id: "3215", province: "Jawa Barat", type: "Kabupaten", name: "Karawang" },
        { id: "3213", province: "Jawa Barat", type: "Kabupaten", name: "Subang" }
      ];
  },

  // External API Helpers
  async translate(text: string, source: string, target: string): Promise<string> {
      if (source === target) return text;
      const key = `${source}:${target}:${text}`;
      if (translationCache[key]) return translationCache[key];
      try {
          const params = new URLSearchParams({ q: text, langpair: `${source}|${target}` });
          const res = await fetch(`${TRANSLATE_API_URL}?${params.toString()}`);
          const json = await res.json();
          if (json.responseStatus === 200) {
              translationCache[key] = json.responseData.translatedText;
              return json.responseData.translatedText;
          }
      } catch (e) { /* silent fail */ }
      return text;
  },

  async getExchangeRates(): Promise<Record<string, number>> {
      if (ratesCache) return ratesCache;
      try {
          const res = await fetch(CURRENCY_API_URL);
          const json = await res.json();
          if (json.result === 'success') {
              ratesCache = json.rates;
              return json.rates;
          }
      } catch (e) { /* silent fail */ }
      return {};
  }
};
