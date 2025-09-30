import React from 'react';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import Link from 'next/link';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

import ROUTES from '@/constants/routes';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: 'SIGN_IN' | 'SIGN_UP';
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async () => {};

  const buttonText = formType === 'SIGN_IN' ? 'Sign In' : 'Sign Up';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 space-y-6">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name === 'email'
                    ? 'Email address'
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === 'password' ? 'password' : 'text'}
                    placeholder={field.name}
                    {...field}
                    className="min-h-12 rounded-1.5 border light-border-2 background-light900_dark300 paragraph-regular text-dark300_light700 no-focus"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button className="min-h-12 w-full rounded-2 px-4 py-3 font-inter paragraph-medium text-light-900 primary-gradient">
          {form.formState.isSubmitting ? 'Processing...' : buttonText}
        </Button>

        {formType === 'SIGN_IN' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.SIGN_UP} className="primary-text-gradient paragraph-semibold">
              Sign Up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href={ROUTES.SIGN_IN} className="primary-text-gradient paragraph-semibold">
              Sign In
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
