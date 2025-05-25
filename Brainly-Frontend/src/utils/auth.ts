// Authentication utility functions

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  try {
    // Basic validation - check if token exists and is not empty
    if (token.trim() === '') {
      return false;
    }

    // You can add more sophisticated validation here:
    // 1. JWT token expiration check
    // 2. Token format validation
    // 3. API call to verify token with backend
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const logout = (): void => {
  removeToken();
  // You can add additional logout logic here if needed
  window.location.href = '/signin';
}; 