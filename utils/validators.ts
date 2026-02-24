
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Min 8 chars, at least one letter, one number, and one symbol
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= 8 && hasLetter && hasNumber && hasSymbol;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const clean = phone.replace(/\D/g, '');
  
  // 1. Minimum Length check (Indonesian mobile typically 10-13 digits)
  if (clean.length < 9) return false;

  // 2. Check for repeating digits (e.g., 55555) - Max 4 allowed
  if (/(.)\1{4,}/.test(clean)) return false;

  // 3. Check for sequential digits (e.g., 123456 or 654321)
  const sequences = "012345678909876543210";
  for (let i = 0; i < clean.length - 5; i++) {
      if (sequences.includes(clean.substring(i, i + 6))) return false;
  }

  // 4. Check for repetitive patterns (e.g., 12121212)
  if (/(\d{2,})\1{2,}/.test(clean)) return false;

  return true;
};

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const clean = value.replace(/\D/g, '');
  
  // Format: 812-3456-7891
  if (clean.length < 4) return clean;
  if (clean.length < 8) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 13)}`;
};
