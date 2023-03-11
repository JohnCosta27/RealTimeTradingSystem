import jwt_decode from 'jwt-decode';

/**
 * Checks if the access token is valid by:
 * A. Of a correct form
 * B. Not experired
 * @returns boolen = valid
 */
export function isTokenValid(type: 'access' | 'refresh'): boolean {
  const access = localStorage.getItem(type);
  if (!access) return false;

  try {
    const decoded = jwt_decode(access) as { [key: string]: string };
    if (!('Type' in decoded && 'Uuid' in decoded && 'Exp' in decoded)) {
      return false;
    }

    const expDate = new Date(decoded.Exp);
    const timeNow = new Date();

    return timeNow.getTime() < expDate.getTime();
  } catch (e) {
    return false;
  }
}
