/**
 * Formats a number for display with proper decimal places and thousands separators.
 * Removes trailing zeros and limits to maximum 2 decimal places for display.
 *
 * @param n - The number to format
 * @returns A formatted string representation suitable for UI display
 */
export function formatAmount(n: number): string {
  if (isNaN(n) || !isFinite(n)) {
    return '0';
  }

  // Round to 4 decimal places first (as per scaleRecipe utility), then format for display
  const rounded = Math.round(n * 10000) / 10000;
  
  // Convert to string with up to 2 decimal places
  let formatted = rounded.toFixed(2);
  
  // Remove trailing zeros after decimal point
  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }
  
  // Add thousands separators
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
}
