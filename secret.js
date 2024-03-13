import crypto from 'crypto';

// Genera una cadena aleatoria segura de longitud 64
export const generateRandomString = () => {
  return crypto.randomBytes(32).toString('hex');
};