import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, contactSchema } from '../../../shared/schema';

describe('Form Validation Tests', () => {
  describe('Login Schema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Register Schema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail when passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Contact Schema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        message: 'Test message',
      };
      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on missing required fields', () => {
      const invalidData = {
        firstName: 'John',
        email: 'test@example.com',
      };
      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
}); 