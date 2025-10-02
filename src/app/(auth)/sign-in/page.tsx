'use client';

import React from 'react';

import { signInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validation';

import AuthForm from '@/components/forms/auth.form';

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;
