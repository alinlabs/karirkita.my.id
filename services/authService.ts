
import { routingData } from './routingData';

export const authService = {
  // Login dengan cek Admin dari KV (Cloudflare), lalu user dari D1
  login: async (credentials: { identifier: string, password: string }): Promise<{ success: boolean, user?: any, error?: string }> => {
    // 1. CLOUDFLARE KV AUTH CHECK (ADMIN)
    try {
        const identity = await routingData.getIdentity();
        
        if (identity && identity.admin) {
            // Check against KV admin credentials
            if (credentials.identifier === identity.admin.email && credentials.password === identity.admin.password) {
                return {
                    success: true,
                    user: {
                        user_id: 'admin-kv-master',
                        nama_lengkap: 'Super Administrator',
                        email_kontak: identity.admin.email,
                        role: 'admin',
                        foto_profil_url: identity.logoUrl || 'https://placehold.co/100x100?text=Admin',
                        username: 'admin'
                    }
                };
            }
        }
    } catch (e) {
        console.error("KV Admin check failed, proceeding to user DB", e);
    }

    // 2. D1 DATABASE AUTH CHECK (REGULAR USERS)
    // The worker endpoint /api/v2/auth/login returns { success: true, user: ... } or { error: ... }
    return routingData.post<{ success: boolean, user?: any, error?: string }>('api/v2/auth/login', credentials);
  },

  // Real D1 Register
  register: (data: any) => 
    routingData.post('/api/v2/auth/register', data),

  // Check Availability (Real-time)
  checkAvailability: (field: 'username' | 'email_kontak' | 'telepon_kontak', value: string) => 
    routingData.post('/api/v2/auth/check', { field, value }),

  // Reset Password (Mock Implementation for Frontend Logic)
  resetPassword: (data: { identifier: string, newPassword: string }) => {
    // In a real app, this would hit an endpoint like '/api/v2/auth/reset-password'
    // For now, we return a success promise to allow the UI flow to complete
    return Promise.resolve({ success: true });
  },

  // Logout (Client side mainly)
  logout: () => Promise.resolve({ success: true }),
};
