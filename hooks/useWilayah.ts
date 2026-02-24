
import { useState, useEffect } from 'react';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export interface Wilayah {
  id: string;
  name: string;
}

export const useWilayah = () => {
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  const [loading, setLoading] = useState(false);

  // 1. Fetch Provinces on Init
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${BASE_URL}/provinces.json`);
        const data = await res.json();
        setProvinces(data);
      } catch (e) {
        console.error("Failed to fetch provinces", e);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Regencies (Kabupaten/Kota)
  const fetchRegencies = async (provinceId: string) => {
    if (!provinceId) { setRegencies([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
      const data = await res.json();
      setRegencies(data);
      setDistricts([]); // Reset children
      setVillages([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Districts (Kecamatan)
  const fetchDistricts = async (regencyId: string) => {
    if (!regencyId) { setDistricts([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
      const data = await res.json();
      setDistricts(data);
      setVillages([]); // Reset children
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch Villages (Kelurahan/Desa)
  const fetchVillages = async (districtId: string) => {
    if (!districtId) { setVillages([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/villages/${districtId}.json`);
      const data = await res.json();
      setVillages(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    provinces,
    regencies,
    districts,
    villages,
    loading,
    fetchRegencies,
    fetchDistricts,
    fetchVillages
  };
};
