/**
 * Validation utilities for JU Hall Management
 */

/**
 * Validates Bangladesh mobile number (exactly 11 digits starting with 01)
 * @param phone - Phone number to validate
 * @returns Validation result with isValid flag and message
 */
export function validateMobileNumber(phone: string): { isValid: boolean; message: string } {
  // Remove any spaces, dashes, or other characters
  const cleanedPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Check if empty
  if (!cleanedPhone) {
    return {
      isValid: false,
      message: 'Mobile number is required',
    };
  }

  // Check if only digits
  if (!/^\d+$/.test(cleanedPhone)) {
    return {
      isValid: false,
      message: 'Mobile number must contain only digits',
    };
  }

  // Check exact length (11 digits for Bangladesh)
  if (cleanedPhone.length !== 11) {
    return {
      isValid: false,
      message: `Mobile number must be exactly 11 digits (currently ${cleanedPhone.length} digits)`,
    };
  }

  // Check if starts with valid Bangladesh prefix (01)
  if (!cleanedPhone.startsWith('01')) {
    return {
      isValid: false,
      message: 'Mobile number must start with 01',
    };
  }

  // Check valid operator codes (013, 014, 015, 016, 017, 018, 019)
  const validOperators = ['013', '014', '015', '016', '017', '018', '019'];
  const operatorCode = cleanedPhone.substring(0, 3);
  
  if (!validOperators.includes(operatorCode)) {
    return {
      isValid: false,
      message: 'Invalid mobile operator code',
    };
  }

  return {
    isValid: true,
    message: 'Valid mobile number',
  };
}

/**
 * Formats phone number for display
 * @param phone - Raw phone number
 * @returns Formatted phone number
 */
export function formatMobileNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Cleans phone number for storage (removes formatting)
 * @param phone - Phone number with potential formatting
 * @returns Clean 11-digit number
 */
export function cleanMobileNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, '');
}

/**
 * Validates email address
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): { isValid: boolean; message: string } {
  if (!email) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    message: 'Valid email',
  };
}

/**
 * Validates required text field
 * @param value - Text value to validate
 * @param fieldName - Name of the field for error message
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (optional)
 * @returns Validation result
 */
export function validateTextField(
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength?: number
): { isValid: boolean; message: string } {
  const trimmed = value.trim();
  
  if (!trimmed || trimmed.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} is required${minLength > 1 ? ` (minimum ${minLength} characters)` : ''}`,
    };
  }

  if (maxLength && trimmed.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} must be less than ${maxLength} characters`,
    };
  }

  return {
    isValid: true,
    message: 'Valid',
  };
}
