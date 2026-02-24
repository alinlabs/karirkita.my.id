
// --- CODE FOR CLOUDFLARE WORKER DASHBOARD ---

const CACHE_TTL = {
    KV: 300, // 5 minutes
    D1_LIST: 10, // 10 seconds
    D1_DETAIL: 30 // 30 seconds
};

const memoryCache = new Map();

function getCache(key) {
    const item = memoryCache.get(key);
    if (item && item.expiry > Date.now()) return item.value;
    return null;
}

function setCache(key, value, ttlSeconds) {
    memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
}

function invalidateCache(prefix) {
    for (const key of memoryCache.keys()) {
        if (key.startsWith(prefix)) memoryCache.delete(key);
    }
}

// Helper untuk parse JSON string dari Database SQL
const parseJSON = (data, keys) => {
    return data.map(item => {
        const newItem = { ...item };
        // Remove sensitive info
        delete newItem.password;
        
        // Convert 'Active'/'Inactive' strings or Integer (0/1) to Boolean for frontend
        if (newItem.promosi !== undefined) {
             const val = String(newItem.promosi).toLowerCase();
             newItem.promosi = (val === 'active' || newItem.promosi === 1 || newItem.promosi === true);
        }
        
        // New: aktifkan_label (Pengguna)
        if (newItem.aktifkan_label !== undefined) {
             const val = String(newItem.aktifkan_label).toLowerCase();
             newItem.aktifkan_label = (val === 'active' || val === '1' || val === 'true');
             // Map back to legacy status_saja field for frontend compatibility if needed
             newItem.status_saja = newItem.aktifkan_label; 
        }

        // New: popup_sambutan (Perusahaan)
        if (newItem.popup_sambutan !== undefined) {
             const val = String(newItem.popup_sambutan).toLowerCase();
             newItem.popup_sambutan = (val === 'active' || val === '1' || val === 'true');
        }

        // Notifikasi Logic: Check if tombol_ajakan exists to determine if button is active
        if (newItem.tombol_ajakan !== undefined) {
             newItem.tombol = Boolean(newItem.tombol_ajakan && newItem.tombol_ajakan.trim() !== '');
             // Map tombol_ajakan to legacy ajakan for frontend compatibility
             newItem.ajakan = newItem.tombol_ajakan;
        }
        
        // Legacy Boolean
        if (newItem.dipromosikan !== undefined) newItem.dipromosikan = Boolean(newItem.dipromosikan);
        
        // Parse JSON String columns
        keys.forEach(key => {
            if (newItem[key]) {
                if (typeof newItem[key] === 'string') {
                    try {
                        newItem[key] = JSON.parse(newItem[key]);
                    } catch (e) {
                        newItem[key] = (key === 'sosial_media') ? {} : []; 
                    }
                }
            } else {
                // Initialize default empty structure if null
                newItem[key] = (key === 'sosial_media') ? {} : [];
            }
        });
        return newItem;
    });
};

const jsonResponse = (data, status = 200, corsHeaders) => {
    return new Response(JSON.stringify(data, null, 2), {
        status: status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/|\/$/g, '');
    const query = url.searchParams;
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (path === '') {
        return jsonResponse({ status: "ok", message: "KarirKita API Service Running (New Schema v3.5 - Verified)", version: "3.5" }, 200, corsHeaders);
    }

    const kvBinding = env.kv_karirkita || env.karirkita;
    const dbBinding = env.db_karirkita;

    // --- ACTIONS ROUTES ---
    if (path.startsWith('api/v2/actions')) {
        if (!dbBinding) return jsonResponse({ error: 'Database binding not found' }, 500, corsHeaders);

        if (request.method === 'POST') {
            const body = await request.json();
            const timestamp = Date.now();

            // 1. APPLY JOB (Melamar)
            if (path === 'api/v2/actions/apply') {
                const { userId, jobId } = body; 
                if (!userId || !jobId) return jsonResponse({ error: 'Missing userId or jobId' }, 400, corsHeaders);

                try {
                    const job = await dbBinding.prepare("SELECT lamaran FROM lowongan WHERE id_lowongan = ?").bind(jobId).first();
                    if (!job) return jsonResponse({ error: 'Job not found' }, 404, corsHeaders);

                    let currentApplicants = [];
                    try { currentApplicants = JSON.parse(job.lamaran || '[]'); } catch(e) { currentApplicants = []; }

                    const alreadyApplied = currentApplicants.some(a => a.user_id === userId);
                    if (!alreadyApplied) {
                        currentApplicants.push({ user_id: userId, timestamp: timestamp });
                        await dbBinding.prepare("UPDATE lowongan SET lamaran = ? WHERE id_lowongan = ?").bind(JSON.stringify(currentApplicants), jobId).run();
                        invalidateCache('jobs'); // Invalidate jobs cache
                        return jsonResponse({ success: true, message: 'Lamaran berhasil disimpan' }, 200, corsHeaders);
                    } else {
                        return jsonResponse({ success: false, message: 'Sudah melamar sebelumnya' }, 200, corsHeaders);
                    }
                } catch (e) {
                    return jsonResponse({ error: e.message }, 500, corsHeaders);
                }
            }

            // 2. CALL TALENT (Panggilan Interview)
            if (path === 'api/v2/actions/call') {
                const { userId, jobId, companyId, pesan, jadwal } = body;
                if (!userId || !jobId) return jsonResponse({ error: 'Missing Data' }, 400, corsHeaders);

                try {
                    const job = await dbBinding.prepare("SELECT interview FROM lowongan WHERE id_lowongan = ?").bind(jobId).first();
                    if (!job) return jsonResponse({ error: 'Job not found' }, 404, corsHeaders);

                    let currentInterviews = [];
                    try { currentInterviews = JSON.parse(job.interview || '[]'); } catch(e) { currentInterviews = []; }

                    currentInterviews = currentInterviews.filter(i => i.user_id !== userId);
                    currentInterviews.push({
                        user_id: userId,
                        timestamp: timestamp,
                        pesan: pesan || "Undangan Interview",
                        jadwal: jadwal || (timestamp + 86400000)
                    });

                    await dbBinding.prepare("UPDATE lowongan SET interview = ? WHERE id_lowongan = ?").bind(JSON.stringify(currentInterviews), jobId).run();

                    // Create Notification
                    const notifTitle = "Panggilan Interview";
                    const notifMsg = pesan || "Anda diundang interview.";
                    // dari = companyId, kepada = userId
                    // Removed 'tombol' column, using 'tombol_ajakan'
                    await dbBinding.prepare(
                        "INSERT INTO notifikasi (kepada, dari, type, title, message, tombol_ajakan, hyperlink, created_at) VALUES (?, ?, ?, ?, ?, 'Lihat Detail', '/user/jobs', ?)"
                    ).bind(userId, companyId || 'System', 'info', notifTitle, notifMsg, timestamp).run();
                    
                    invalidateCache('jobs');
                    invalidateCache('notifications');

                    return jsonResponse({ success: true, message: 'Undangan Interview terkirim' }, 200, corsHeaders);
                } catch (e) {
                    return jsonResponse({ error: e.message }, 500, corsHeaders);
                }
            }

            // 3. VIEW INCREMENT
            if (path === 'api/v2/actions/view') {
                const { id, type } = body;
                if (!id || !type) return jsonResponse({ error: 'Missing id or type' }, 400, corsHeaders);
                try {
                    if (type === 'user') {
                        await dbBinding.prepare("UPDATE pengguna SET dilihat = IFNULL(dilihat, 0) + 1 WHERE id_pengguna = ?").bind(id).run();
                        invalidateCache('users');
                    }
                    else if (type === 'company') {
                        await dbBinding.prepare("UPDATE perusahaan SET dilihat = IFNULL(dilihat, 0) + 1 WHERE id_perusahaan = ?").bind(id).run();
                        invalidateCache('companies');
                    }
                    return jsonResponse({ success: true }, 200, corsHeaders);
                } catch (e) {
                    return jsonResponse({ error: e.message }, 500, corsHeaders);
                }
            }
        }
    }

    // --- AUTH ROUTES ---
    if (path.startsWith('api/v2/auth')) {
        if (!dbBinding) return jsonResponse({ error: 'DB Error' }, 500, corsHeaders);
        if (path === 'api/v2/auth/login' && request.method === 'POST') {
             try {
                const { identifier, password } = await request.json();
                const user = await dbBinding.prepare("SELECT *, id_pengguna as user_id FROM pengguna WHERE (username = ? OR email_kontak = ?) AND password = ? LIMIT 1").bind(identifier, identifier, password).first();
                if (!user) return jsonResponse({ error: 'Kredensial salah' }, 401, corsHeaders);
                const parsedUser = parseJSON([user], ['keahlian', 'keahlian_detail', 'sosial_media', 'layanan', 'portofolio', 'sertifikasi', 'organisasi', 'pengalaman_kerja', 'riwayat_pendidikan', 'galeri_kegiatan'])[0];
                return jsonResponse({ success: true, user: parsedUser }, 200, corsHeaders);
            } catch (e) { return jsonResponse({ error: e.message }, 500, corsHeaders); }
        }
        // ... Register and Check ...
        if (path === 'api/v2/auth/check' && request.method === 'POST') {
            const { field, value } = await request.json();
            
            // Validate allowed fields
            const allowedFields = ['username', 'email_kontak', 'telepon_kontak'];
            if (!allowedFields.includes(field)) {
                return jsonResponse({ error: 'Invalid field' }, 400, corsHeaders);
            }

            const result = await dbBinding.prepare(`SELECT 1 FROM pengguna WHERE ${field} = ? LIMIT 1`).bind(value).first();
            return jsonResponse({ available: !result }, 200, corsHeaders);
        }
        if (path === 'api/v2/auth/register' && request.method === 'POST') {
             const body = await request.json();
             const userId = `u-${Date.now()}`;
             // Added: verifikasi = 'proses'
             await dbBinding.prepare("INSERT INTO pengguna (id_pengguna, username, password, nama_lengkap, email_kontak, telepon_kontak, provinsi, kota, kecamatan, kelurahan, verifikasi, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'proses', ?, ?)").bind(userId, body.username, body.password, body.nama_lengkap, body.email_kontak, body.telepon_kontak, body.provinsi, body.kota, body.kecamatan, body.kelurahan, Date.now(), Date.now()).run();
             invalidateCache('users');
             return jsonResponse({ success: true, userId }, 201, corsHeaders);
        }
    }

    // --- ADMIN STATUS UPDATES ---
    if (path === 'api/v2/admin/users/status' && request.method === 'POST') {
        const { userId, type, value } = await request.json();
        if (!userId || !type) return jsonResponse({ error: 'Missing data' }, 400, corsHeaders);
        try {
            const field = type === 'verifikasi' ? 'verifikasi' : 'promosi';
            // Handle boolean for promosi, string for verifikasi
            let dbValue = value;
            if (field === 'promosi') dbValue = value ? 'Active' : 'Inactive';
            
            await dbBinding.prepare(`UPDATE pengguna SET ${field} = ? WHERE id_pengguna = ?`).bind(dbValue, userId).run();
            invalidateCache('users');
            return jsonResponse({ success: true }, 200, corsHeaders);
        } catch (e) { return jsonResponse({ error: e.message }, 500, corsHeaders); }
    }

    if (path === 'api/v2/admin/companies/status' && request.method === 'POST') {
        const { companyId, type, value } = await request.json();
        if (!companyId || !type) return jsonResponse({ error: 'Missing data' }, 400, corsHeaders);
        try {
            const field = type === 'verifikasi' ? 'verifikasi' : 'promosi';
            let dbValue = value;
            if (field === 'promosi') dbValue = value ? 'Active' : 'Inactive';

            await dbBinding.prepare(`UPDATE perusahaan SET ${field} = ? WHERE id_perusahaan = ?`).bind(dbValue, companyId).run();
            invalidateCache('companies');
            return jsonResponse({ success: true }, 200, corsHeaders);
        } catch (e) { return jsonResponse({ error: e.message }, 500, corsHeaders); }
    }

    // --- DATA ROUTES ---
    if (path.startsWith('api/v2')) {
        
        // --- REFERENCE DATA BATCH FETCH (KV Only) ---
        if (path === 'api/v2/reference') {
             const cacheKey = 'reference_data';
             const cached = getCache(cacheKey);
             if (cached) return jsonResponse(cached, 200, corsHeaders);
     
             if (!kvBinding) return jsonResponse({ error: 'KV binding not found' }, 500, corsHeaders);
     
             const keys = ['karirkita', 'options', 'skill', 'halaman', 'icon', 'grup', 'kelas', 'promosi'];
             try {
                 const results = await Promise.all(keys.map(key => kvBinding.get(key, { type: 'json' })));
                 const data = {};
                 keys.forEach((key, index) => {
                     data[key] = results[index] || {};
                 });
         
                 setCache(cacheKey, data, CACHE_TTL.KV);
                 return jsonResponse(data, 200, corsHeaders);
             } catch (e) {
                 return jsonResponse({ error: e.message }, 500, corsHeaders);
             }
        }

        if (!dbBinding) return jsonResponse({ error: 'DB Error' }, 404, corsHeaders);

        try {
            let result;
            let data = [];

            // --- JOBS CRUD ---
            if (path === 'api/v2/jobs') {
                if (request.method === 'GET') {
                    const page = parseInt(query.get('page')) || 1;
                    const limit = parseInt(query.get('limit')) || 50;
                    const offset = (page - 1) * limit;
                    const cacheKey = `jobs_${page}_${limit}`;
                    
                    const cached = getCache(cacheKey);
                    if (cached) return jsonResponse(cached, 200, corsHeaders);

                    result = await dbBinding.prepare('SELECT *, id_lowongan as lowongan_id, id_perusahaan as perusahaan_id FROM lowongan LIMIT ? OFFSET ?').bind(limit, offset).all();
                    data = parseJSON(result.results, ['kualifikasi', 'fasilitas', 'lamaran', 'interview', 'kontak']);
                    data = data.map(job => ({ 
                        ...job, 
                        lokasi: [job.kota, job.provinsi].filter(Boolean).join(', '),
                        total_pelamar: Array.isArray(job.lamaran) ? job.lamaran.length : 0 
                    }));
                    setCache(cacheKey, data, CACHE_TTL.D1_LIST);
                } else if (request.method === 'POST') {
                    const job = await request.json();
                    // Upsert logic
                    const existing = await dbBinding.prepare('SELECT 1 FROM lowongan WHERE id_lowongan = ?').bind(job.lowongan_id).first();
                    
                    const kualifikasi = JSON.stringify(job.kualifikasi || []);
                    const fasilitas = JSON.stringify(job.fasilitas || []);
                    const kontak = JSON.stringify(job.kontak || []);
                    const jenis_submit = job.jenis_submit || 'karirkita';
                    
                    if (existing) {
                        await dbBinding.prepare(`
                            UPDATE lowongan SET 
                            posisi=?, id_perusahaan=?, banner=?, provinsi=?, kota=?, kecamatan=?, kelurahan=?, jalan=?, kode_pos=?, maps=?, 
                            tipe_pekerjaan=?, sistem_kerja=?, sistem_gaji=?, pendidikan_minimal=?, rentang_gaji=?, deskripsi_pekerjaan=?, kualifikasi=?, fasilitas=?, 
                            jenis_submit=?, kontak=?, promosi=?, status=?, updated_at=?
                            WHERE id_lowongan=?
                        `).bind(
                            job.posisi, job.perusahaan_id, job.banner, job.provinsi, job.kota, job.kecamatan, job.kelurahan, job.jalan, job.kode_pos, job.maps,
                            job.tipe_pekerjaan, job.sistem_kerja, job.sistem_gaji, job.pendidikan_minimal, job.rentang_gaji, job.deskripsi_pekerjaan, kualifikasi, fasilitas,
                            jenis_submit, kontak, job.promosi ? 'Active' : 'Inactive', job.status, Date.now(),
                            job.lowongan_id
                        ).run();
                    } else {
                        await dbBinding.prepare(`
                            INSERT INTO lowongan (
                                id_lowongan, slug, posisi, id_perusahaan, banner, provinsi, kota, kecamatan, kelurahan, jalan, kode_pos, maps,
                                tipe_pekerjaan, sistem_kerja, sistem_gaji, pendidikan_minimal, rentang_gaji, deskripsi_pekerjaan, kualifikasi, fasilitas,
                                jenis_submit, kontak, promosi, status, created_at, updated_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `).bind(
                            job.lowongan_id, job.slug, job.posisi, job.perusahaan_id, job.banner, job.provinsi, job.kota, job.kecamatan, job.kelurahan, job.jalan, job.kode_pos, job.maps,
                            job.tipe_pekerjaan, job.sistem_kerja, job.sistem_gaji, job.pendidikan_minimal, job.rentang_gaji, job.deskripsi_pekerjaan, kualifikasi, fasilitas,
                            jenis_submit, kontak, job.promosi ? 'Active' : 'Inactive', job.status, Date.now(), Date.now()
                        ).run();
                    }
                    invalidateCache('jobs');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                } else if (request.method === 'DELETE') {
                    const { id } = await request.json();
                    await dbBinding.prepare('DELETE FROM lowongan WHERE id_lowongan = ?').bind(id).run();
                    invalidateCache('jobs');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                }
            }
            
            // --- COMPANIES CRUD ---
            else if (path === 'api/v2/companies') {
                if (request.method === 'GET') {
                    const id = query.get('id');
                    const cacheKey = id ? `company_${id}` : 'companies_list';
                    const cached = getCache(cacheKey);
                    if (cached) return jsonResponse(cached, 200, corsHeaders);

                    if (id) {
                        result = await dbBinding.prepare('SELECT *, id_perusahaan as perusahaan_id, id_pengguna as user_id FROM perusahaan WHERE id_perusahaan = ?').bind(id).all();
                    } else {
                        result = await dbBinding.prepare('SELECT *, id_perusahaan as perusahaan_id, id_pengguna as user_id FROM perusahaan').all();
                    }
                    
                    const rawData = parseJSON(result.results, ['teknologi', 'penghargaan', 'galeri', 'struktural']);
                    data = rawData.map(c => ({
                        ...c,
                        sosial_media: {
                            linkedin: c.linkedin,
                            instagram: c.instagram,
                            facebook: c.facebook
                        }
                    }));
                    setCache(cacheKey, data, id ? CACHE_TTL.D1_DETAIL : CACHE_TTL.D1_LIST);
                } else if (request.method === 'POST') {
                    const comp = await request.json();
                    const existing = await dbBinding.prepare('SELECT 1 FROM perusahaan WHERE id_perusahaan = ?').bind(comp.perusahaan_id).first();
                    
                    const struktural = JSON.stringify(comp.struktural || []);
                    const teknologi = JSON.stringify(comp.teknologi || []);
                    const penghargaan = JSON.stringify(comp.penghargaan || []);
                    const galeri = JSON.stringify(comp.galeri || []);

                    if (existing) {
                        await dbBinding.prepare(`
                            UPDATE perusahaan SET 
                            nama=?, slug=?, deskripsi=?, provinsi=?, kota=?, kecamatan=?, kelurahan=?, jalan=?, kode_pos=?,
                            website_url=?, industri=?, ukuran_perusahaan=?, promosi=?, verifikasi=?, tagline=?, tahun_berdiri=?,
                            email_kontak=?, nomor_telepon=?, fax=?, whatsapp=?, visi=?, misi=?, struktural=?,
                            popup_sambutan=?, ukuran_banner_url=?, ukuran_banner_sambutan=?, teks_sambutan=?, tombol_ajakan=?, link_ajakan=?,
                            linkedin=?, instagram=?, facebook=?, teknologi=?, penghargaan=?, galeri=?, logo_url=?, banner_url=?, video_profil=?,
                            updated_at=?
                            WHERE id_perusahaan=?
                        `).bind(
                            comp.nama, comp.slug, comp.deskripsi, comp.provinsi, comp.kota, comp.kecamatan, comp.kelurahan, comp.jalan, comp.kode_pos,
                            comp.website_url, comp.industri, comp.ukuran_perusahaan, comp.promosi ? 'Active' : 'Inactive', comp.verifikasi, comp.tagline, comp.tahun_berdiri,
                            comp.email_kontak, comp.nomor_telepon, comp.fax, comp.whatsapp, comp.visi, comp.misi, struktural,
                            comp.popup_sambutan, comp.ukuran_banner_url, comp.ukuran_banner_sambutan, comp.teks_sambutan, comp.tombol_ajakan, comp.link_ajakan,
                            comp.linkedin, comp.instagram, comp.facebook, teknologi, penghargaan, galeri, comp.logo_url, comp.banner_url, comp.video_profil,
                            Date.now(), comp.perusahaan_id
                        ).run();
                    } else {
                        await dbBinding.prepare(`
                            INSERT INTO perusahaan (
                                id_perusahaan, id_pengguna, nama, slug, deskripsi, provinsi, kota, kecamatan, kelurahan, jalan, kode_pos,
                                website_url, industri, ukuran_perusahaan, promosi, verifikasi, tagline, tahun_berdiri,
                                email_kontak, nomor_telepon, fax, whatsapp, visi, misi, struktural,
                                popup_sambutan, ukuran_banner_url, ukuran_banner_sambutan, teks_sambutan, tombol_ajakan, link_ajakan,
                                linkedin, instagram, facebook, teknologi, penghargaan, galeri, logo_url, banner_url, video_profil,
                                created_at, updated_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `).bind(
                            comp.perusahaan_id, comp.user_id, comp.nama, comp.slug, comp.deskripsi, comp.provinsi, comp.kota, comp.kecamatan, comp.kelurahan, comp.jalan, comp.kode_pos,
                            comp.website_url, comp.industri, comp.ukuran_perusahaan, comp.promosi ? 'Active' : 'Inactive', comp.verifikasi, comp.tagline, comp.tahun_berdiri,
                            comp.email_kontak, comp.nomor_telepon, comp.fax, comp.whatsapp, comp.visi, comp.misi, struktural,
                            comp.popup_sambutan, comp.ukuran_banner_url, comp.ukuran_banner_sambutan, comp.teks_sambutan, comp.tombol_ajakan, comp.link_ajakan,
                            comp.linkedin, comp.instagram, comp.facebook, teknologi, penghargaan, galeri, comp.logo_url, comp.banner_url, comp.video_profil,
                            Date.now(), Date.now()
                        ).run();
                    }
                    invalidateCache('companies');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                } else if (request.method === 'DELETE') {
                    const { id } = await request.json();
                    // Cascade delete jobs
                    await dbBinding.prepare('DELETE FROM lowongan WHERE id_perusahaan = ?').bind(id).run();
                    await dbBinding.prepare('DELETE FROM perusahaan WHERE id_perusahaan = ?').bind(id).run();
                    invalidateCache('companies');
                    invalidateCache('jobs');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                }
            } 
            
            // --- USERS CRUD ---
            else if (path === 'api/v2/users') {
                if (request.method === 'GET') {
                    const id = query.get('id');
                    const cacheKey = id ? `user_${id}` : 'users_list';
                    const cached = getCache(cacheKey);
                    if (cached) return jsonResponse(cached, 200, corsHeaders);

                    if (id) {
                        // Fetch specific user
                        result = await dbBinding.prepare('SELECT * FROM pengguna WHERE id_pengguna = ?').bind(id).all();
                    } else {
                        // Fetch all users
                        result = await dbBinding.prepare('SELECT * FROM pengguna').all();
                    }
                    
                    // Parse JSON columns including 'layanan'
                    data = parseJSON(result.results, [
                        'keahlian', 'keahlian_detail', 'sosial_media', 'layanan', 
                        'portofolio', 'sertifikasi', 'organisasi', 'pengalaman_kerja', 
                        'riwayat_pendidikan', 'galeri_kegiatan'
                    ]);
                    
                    // If fetching by ID, return the single object, not array
                    if (id && data.length > 0) {
                        setCache(cacheKey, data[0], CACHE_TTL.D1_DETAIL);
                        return jsonResponse(data[0], 200, corsHeaders); // Return object directly
                    } else if (id && data.length === 0) {
                        return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
                    }

                    setCache(cacheKey, data, CACHE_TTL.D1_LIST);
                } else if (request.method === 'POST') {
                    const user = await request.json();
                    const id = user.id_pengguna;
                    if (!id) return jsonResponse({ error: 'User ID required' }, 400, corsHeaders);

                    // Check if user exists
                    const existing = await dbBinding.prepare('SELECT 1 FROM pengguna WHERE id_pengguna = ?').bind(id).first();
                    
                    if (existing) {
                        // Dynamic Update Logic - Safe for partial updates like 'layanan' only
                        const allowedFields = [
                            'nama_lengkap', 'headline', 'email_kontak', 'telepon_kontak', 
                            'tempat_lahir', 'tanggal_lahir', 'foto_profil', 'banner', 
                            'tentang_saya', 'provinsi', 'kota', 'kecamatan', 'kelurahan', 'jalan', 'kode_pos',
                            'status_ketersediaan', 'keahlian', 'keahlian_detail', 'sosial_media', 
                            'pengalaman_kerja', 'riwayat_pendidikan', 'portofolio', 'sertifikasi', 'organisasi', 'galeri_kegiatan', 'layanan',
                            'promosi', 'verifikasi', 'aktifkan_label'
                        ];
                        
                        const updates = [];
                        const values = [];
                        
                        const jsonFields = [
                            'keahlian', 'keahlian_detail', 'sosial_media', 'layanan', 
                            'portofolio', 'sertifikasi', 'organisasi', 'pengalaman_kerja', 
                            'riwayat_pendidikan', 'galeri_kegiatan'
                        ];

                        for (const field of allowedFields) {
                            if (user[field] !== undefined) {
                                updates.push(`${field} = ?`);
                                if (jsonFields.includes(field)) {
                                    // Ensure it's an object/array before stringifying, or use empty structure
                                    const val = user[field];
                                    values.push(JSON.stringify(val !== null ? val : []));
                                } else {
                                    values.push(user[field]);
                                }
                            }
                        }
                        
                        updates.push('updated_at = ?');
                        values.push(Date.now());
                        values.push(id); // Bind ID for WHERE clause
                        
                        if (updates.length === 1) {
                             return jsonResponse({ success: true, message: 'No changes detected' }, 200, corsHeaders);
                        }
                        
                        const sql = `UPDATE pengguna SET ${updates.join(', ')} WHERE id_pengguna = ?`;
                        
                        try {
                            await dbBinding.prepare(sql).bind(...values).run();
                            invalidateCache(`user_${id}`);
                            invalidateCache('users_list');
                            return jsonResponse({ success: true }, 200, corsHeaders);
                        } catch (err) {
                            return jsonResponse({ error: `Update failed: ${err.message}` }, 500, corsHeaders);
                        }
                        
                    } else {
                        // Insert Logic (Full Record)
                        // ... (existing insert logic) ...
                        const keahlian = JSON.stringify(user.keahlian || []);
                        const keahlian_detail = JSON.stringify(user.keahlian_detail || []);
                        const sosial_media = JSON.stringify(user.sosial_media || {});
                        const pengalaman_kerja = JSON.stringify(user.pengalaman_kerja || []);
                        const riwayat_pendidikan = JSON.stringify(user.riwayat_pendidikan || []);
                        const portofolio = JSON.stringify(user.portofolio || []);
                        const sertifikasi = JSON.stringify(user.sertifikasi || []);
                        const organisasi = JSON.stringify(user.organisasi || []);
                        const galeri_kegiatan = JSON.stringify(user.galeri_kegiatan || []);
                        const layanan = JSON.stringify(user.layanan || []);

                        await dbBinding.prepare(`
                            INSERT INTO pengguna (
                                id_pengguna, username, nama_lengkap, headline, email_kontak, telepon_kontak,
                                tempat_lahir, tanggal_lahir, foto_profil, banner, tentang_saya,
                                provinsi, kota, kecamatan, kelurahan, jalan, kode_pos,
                                status_ketersediaan, keahlian, keahlian_detail, sosial_media,
                                pengalaman_kerja, riwayat_pendidikan, portofolio, sertifikasi, organisasi, galeri_kegiatan, layanan,
                                created_at, updated_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `).bind(
                            user.id_pengguna, user.username || user.id_pengguna, user.nama_lengkap || '', user.headline, user.email_kontak, user.telepon_kontak,
                            user.tempat_lahir, user.tanggal_lahir, user.foto_profil, user.banner, user.tentang_saya,
                            user.provinsi, user.kota, user.kecamatan, user.kelurahan, user.jalan, user.kode_pos,
                            user.status_ketersediaan || 'job_seeking', keahlian, keahlian_detail, sosial_media,
                            pengalaman_kerja, riwayat_pendidikan, portofolio, sertifikasi, organisasi, galeri_kegiatan, layanan,
                            Date.now(), Date.now()
                        ).run();
                        
                        invalidateCache('users_list');
                        return jsonResponse({ success: true }, 200, corsHeaders);
                    }
                } else if (request.method === 'DELETE') {
                    const { id } = await request.json();
                    await dbBinding.prepare('DELETE FROM pengguna WHERE id_pengguna = ?').bind(id).run();
                    invalidateCache('users');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                }
            }

            // --- NOTIFICATIONS CRUD ---
            else if (path === 'api/v2/notifications') {
                if (request.method === 'GET') {
                    const cacheKey = 'notifications_list';
                    const cached = getCache(cacheKey);
                    if (cached) return jsonResponse(cached, 200, corsHeaders);

                    result = await dbBinding.prepare('SELECT * FROM notifikasi ORDER BY created_at DESC LIMIT 50').all();
                    data = parseJSON(result.results, []); 
                    setCache(cacheKey, data, CACHE_TTL.D1_LIST);
                } else if (request.method === 'POST') {
                    const notif = await request.json();
                    await dbBinding.prepare(`
                        INSERT INTO notifikasi (kepada, dari, type, title, message, tombol_ajakan, hyperlink, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        notif.kepada || 'all', notif.dari || 'System', notif.type, notif.title, notif.message, 
                        notif.tombol_ajakan, notif.hyperlink, Date.now()
                    ).run();
                    invalidateCache('notifications');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                } else if (request.method === 'DELETE') {
                    const { id } = await request.json();
                    await dbBinding.prepare('DELETE FROM notifikasi WHERE id = ?').bind(id).run();
                    invalidateCache('notifications');
                    return jsonResponse({ success: true }, 200, corsHeaders);
                }
            }
            
            else {
                return jsonResponse({ error: 'Resource not found' }, 404, corsHeaders);
            }
            
            return jsonResponse(data, 200, corsHeaders);
        } catch (e) {
            return jsonResponse({ error: e.message }, 500, corsHeaders);
        }
    }

    // KV Handler (Read & Write)
    const validKvKeys = ['karirkita', 'options', 'skill', 'halaman', 'icon', 'grup', 'kelas', 'promosi']; 
    if (validKvKeys.includes(path)) {
        if (!kvBinding) return jsonResponse({ error: 'KV binding not found' }, 500, corsHeaders);

        if (request.method === 'POST') {
            try {
                const body = await request.json();
                await kvBinding.put(path, JSON.stringify(body));
                invalidateCache(`kv_${path}`);
                return jsonResponse({ success: true }, 200, corsHeaders);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500, corsHeaders);
            }
        }

        // GET
        const cacheKey = `kv_${path}`;
        const cached = getCache(cacheKey);
        if (cached) return jsonResponse(cached, 200, corsHeaders);

        const value = await kvBinding.get(path, { type: 'json' });
        setCache(cacheKey, value || {}, CACHE_TTL.KV);
        return jsonResponse(value || {}, 200, corsHeaders);
    }

    return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
  },
};
