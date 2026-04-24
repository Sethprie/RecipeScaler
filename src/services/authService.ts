/**
 * Authentication service stub for future backend integration.
 * These functions currently do nothing and will be implemented when backend is added.
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Stub for user login.
 * Will be implemented with JWT authentication when backend is added.
 */
export async function login(credentials: LoginCredentials): Promise<User | null> {
  // Stub implementation - does nothing
  console.log('Login stub called with:', credentials);
  return null;
}

/**
 * Stub for user logout.
 * Will be implemented with JWT token invalidation when backend is added.
 */
export async function logout(): Promise<void> {
  // Stub implementation - does nothing
  console.log('Logout stub called');
}

/**
 * Stub for user registration.
 * Will be implemented with user creation when backend is added.
 */
export async function register(data: RegisterData): Promise<User | null> {
  // Stub implementation - does nothing
  console.log('Register stub called with:', data);
  return null;
}
