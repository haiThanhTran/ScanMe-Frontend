/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a date string to a localized format
 * @param {string|Date} dateString - The date to format (ISO string or Date object)
 * @param {string} formatType - The type of format to use: 'short' (default), 'long', 'datetime'
 * @param {string} locale - The locale to use (default: 'vi-VN')
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, formatType = 'short', locale = 'vi-VN') => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    switch (formatType) {
      case 'short':
        // 15/08/2023
        return date.toLocaleDateString(locale, { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        });
      
      case 'long':
        // 15 tháng 8, 2023
        return date.toLocaleDateString(locale, { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      
      case 'datetime':
        // 15/08/2023, 14:30
        return date.toLocaleDateString(locale, { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      
      default:
        return date.toLocaleDateString(locale);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a currency value to VND
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
