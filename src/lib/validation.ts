import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .email({ message: 'Please provide a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must be at most 30 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: z
    .email({ message: 'Please provide a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    .regex(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' }),
});
