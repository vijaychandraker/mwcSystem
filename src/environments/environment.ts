// Environment configuration
export const environment = {
  production: true,
  /**
   * Dynamic API URL resolver:
   * - In local Angular dev mode (port 4200): points to 'http://localhost:3000/api'
   * - When hosted / built for production: uses relative '/api' on the current domain
   */
  get apiUrl(): string {
    if (typeof window !== 'undefined') {
      if (window.location.port === '4200') {
        return 'http://localhost:3000/api';
      }
      return `${window.location.origin}/api`;
    }
    return '/api';
  }
};
