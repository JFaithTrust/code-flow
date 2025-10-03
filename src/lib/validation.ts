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

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(100, { message: 'Title must be at most 100 characters long' }),
  content: z.string().min(1, { message: 'Body is required' }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: 'Tag cannot be empty' })
        .max(30, { message: 'Tag must be at most 30 characters long' }),
    )
    .min(1, { message: 'At least one tag is required' })
    .max(3, { message: 'You can add up to 3 tags' }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  email: z
    .email({ message: 'Please provide a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  bio: z.string().optional(),
  image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
  location: z.string().optional(),
  portfolio: z.string().url({ message: 'Portfolio must be a valid URL' }).optional(),
  reputation: z.number().min(0, { message: 'Reputation cannot be negative' }).optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  image: z.string().url({ message: 'Please provide a valid URL.' }).optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .optional(),
  provider: z.string().min(1, { message: 'Provider is required.' }),
  providerAccountId: z.string().min(1, { message: 'Provider Account ID is required.' }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(['github', 'google']),
  providerAccountId: z.string().min(1, { message: 'Provider Account ID is required.' }),
  user: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    email: z
      .email({ message: 'Please provide a valid email address.' })
      .min(1, { message: 'Email is required.' }),
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const GetQuestionsSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const PaginatedSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
