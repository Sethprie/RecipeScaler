/**
 * Generates a simple UUID using timestamp and random number.
 * This is sufficient for local storage and client-side identification.
 * 
 * @returns A unique string identifier
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}
