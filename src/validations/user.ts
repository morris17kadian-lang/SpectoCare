import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
});

/** App auth user shape (uid, displayName, etc.) used by Redux and AuthContext */
export const authUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional().nullable(),
  photoURL: z.string().url().nullable().optional(),
  role: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
