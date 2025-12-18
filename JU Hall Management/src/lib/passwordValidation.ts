import { z } from "zod";

export const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*]/,
  noSpaces: /^\S*$/,
};

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(passwordRequirements.hasUppercase, "Must include uppercase letter")
  .regex(passwordRequirements.hasLowercase, "Must include lowercase letter")
  .regex(passwordRequirements.hasNumber, "Must include a number")
  .regex(passwordRequirements.hasSpecial, "Must include special character (!@#$%^&*)")
  .regex(passwordRequirements.noSpaces, "Password cannot contain spaces");

export interface PasswordValidation {
  isValid: boolean;
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    noSpaces: boolean;
  };
  message: string;
}

export function validatePassword(password: string): PasswordValidation {
  const checks = {
    minLength: password.length >= passwordRequirements.minLength,
    hasUppercase: passwordRequirements.hasUppercase.test(password),
    hasLowercase: passwordRequirements.hasLowercase.test(password),
    hasNumber: passwordRequirements.hasNumber.test(password),
    hasSpecial: passwordRequirements.hasSpecial.test(password),
    noSpaces: passwordRequirements.noSpaces.test(password),
  };

  const isValid = Object.values(checks).every(Boolean);

  return {
    isValid,
    checks,
    message: isValid
      ? "Password meets all requirements"
      : "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  };
}

export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  const validation = validatePassword(password);
  const passedChecks = Object.values(validation.checks).filter(Boolean).length;
  return Math.round((passedChecks / 6) * 100);
}

// Simple hash function for client-side mock auth (NOT for production - use server-side bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "hallhub_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}
