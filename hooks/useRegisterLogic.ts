
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { authService } from '../services/authService';
import { isValidPhoneNumber } from '../utils/validators';

export const useRegisterLogic = () => {
  // --- STATE: STEP 1 (Personal) ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState<boolean | null>(null);
  const debouncedPhone = useDebounce(phoneNumber, 2000);

  // --- STATE: STEP 2 (Account) ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Suggestions
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const debouncedUsername = useDebounce(username, 1000);

  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const debouncedEmail = useDebounce(email, 2000);

  // --- LOGIC: NAME VALIDATION (No Numbers) ---
  const handleNameChange = (val: string, field: 'first' | 'last') => {
      // Regex: Only allow letters (a-z, A-Z) and spaces
      const cleanVal = val.replace(/[^a-zA-Z\s]/g, '');
      if (field === 'first') setFirstName(cleanVal);
      else setLastName(cleanVal);
  };

  // --- LOGIC: SMART USERNAME GENERATION ---
  const generateSuggestions = useCallback(() => {
      if (!firstName) return;
      const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const currentYear = new Date().getFullYear().toString().slice(-2); // "24"
      const uniqueSuffixes = ['01', '88', '99', '0808', currentYear, 'official'];
      
      const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      const opts = [
          `${cleanFirst}.${cleanLast || 'id'}${pick(uniqueSuffixes)}`,
          `${cleanFirst}_${cleanLast || 'user'}${pick(['.id', '01', '007'])}`,
          `${cleanLast || cleanFirst}.${pick(['indo', 'jabar', 'pwk'])}${pick(uniqueSuffixes)}`,
          `${cleanFirst}${cleanLast}${Math.floor(1000 + Math.random() * 9000)}`
      ];
      
      // Ensure unique and shuffle
      const uniqueOpts = Array.from(new Set(opts)).sort(() => 0.5 - Math.random()).slice(0, 3);
      setUsernameSuggestions(uniqueOpts);
  }, [firstName, lastName]);

  // --- EFFECT: PHONE VALIDATION ---
  useEffect(() => {
      const rawPhone = debouncedPhone.replace(/\D/g, '');
      // Minimal 9 digit, Valid Format, Not Repeating
      if (rawPhone.length >= 9 && isValidPhoneNumber(rawPhone)) {
          setIsPhoneChecking(true);
          authService.checkAvailability('telepon_kontak', rawPhone)
            .then((res: any) => {
                setIsPhoneAvailable(res.available);
                if (!res.available) setPhoneError('Nomor telepon sudah terdaftar');
                else setPhoneError('');
            })
            .catch(() => setIsPhoneAvailable(null))
            .finally(() => setIsPhoneChecking(false));
      } else if (rawPhone.length > 0 && rawPhone.length < 9) {
          setIsPhoneAvailable(false);
          setPhoneError('Nomor terlalu pendek');
      } else {
          setIsPhoneAvailable(null);
          setPhoneError('');
      }
  }, [debouncedPhone]);

  // --- EFFECT: USERNAME VALIDATION ---
  useEffect(() => {
      setIsUsernameAvailable(null);
      setUsernameError('');

      if (!debouncedUsername) return;

      if (debouncedUsername.length < 5) {
          setUsernameError('Minimal 5 karakter.');
          setIsUsernameAvailable(false);
          return;
      }

      const hasComplexChar = /[0-9._]/.test(debouncedUsername);
      if (!hasComplexChar) {
          setUsernameError('Harus menyertakan angka atau simbol (. / _ )');
          setIsUsernameAvailable(false);
          return;
      }

      const isValidChars = /^[a-z0-9._]+$/.test(debouncedUsername);
      if (!isValidChars) {
          setUsernameError('Hanya huruf kecil, angka, titik, dan underscore.');
          setIsUsernameAvailable(false);
          return;
      }

      // Geo Restriction Logic injected from component via props if needed, 
      // but strictly keeping it generic here.
      // Assuming 'admin', 'staff' check is generic.
      if (debouncedUsername.includes('admin') || debouncedUsername.includes('staff')) {
          setUsernameError('Username mengandung kata terlarang.');
          setIsUsernameAvailable(false);
          return;
      }

      setIsUsernameChecking(true);
      authService.checkAvailability('username', debouncedUsername)
        .then((res: any) => {
            setIsUsernameAvailable(res.available);
            if (!res.available) setUsernameError('Username sudah digunakan.');
        })
        .catch(() => {
            setIsUsernameAvailable(null);
            setUsernameError('Gagal mengecek username.');
        })
        .finally(() => setIsUsernameChecking(false));

  }, [debouncedUsername]);

  // --- EFFECT: EMAIL VALIDATION (STRICT GMAIL) ---
  useEffect(() => {
      if (!debouncedEmail) {
          setIsEmailAvailable(null);
          setEmailError('');
          return;
      }

      // 1. Strict GMAIL Check
      if (!debouncedEmail.toLowerCase().endsWith('@gmail.com')) {
          setIsEmailAvailable(false);
          setEmailError('Wajib menggunakan akun @gmail.com');
          return;
      }

      // 2. Length Check
      if (debouncedEmail.length < 11) { // x@gmail.com is 11 chars
          setIsEmailAvailable(false);
          setEmailError('Format email tidak valid');
          return;
      }

      // 3. Availability Check
      setEmailError('');
      setIsEmailChecking(true);
      authService.checkAvailability('email_kontak', debouncedEmail)
        .then((res: any) => {
            setIsEmailAvailable(res.available);
            if (!res.available) setEmailError('Email sudah terdaftar.');
        })
        .catch(() => setIsEmailAvailable(null))
        .finally(() => setIsEmailChecking(false));

  }, [debouncedEmail]);

  return {
      // Data
      firstName, lastName, phoneNumber,
      username, email, password,
      
      // Setters (Wrapped)
      setFirstName: (val: string) => handleNameChange(val, 'first'),
      setLastName: (val: string) => handleNameChange(val, 'last'),
      setPhoneNumber,
      setUsername: (val: string) => setUsername(val.toLowerCase().replace(/\s/g, '')),
      setEmail,
      setPassword,
      setShowPassword,
      showPassword,

      // Validation States
      phoneError, isPhoneChecking, isPhoneAvailable,
      usernameError, isUsernameChecking, isUsernameAvailable, usernameSuggestions,
      emailError, isEmailChecking, isEmailAvailable,

      // Actions
      generateSuggestions
  };
};
