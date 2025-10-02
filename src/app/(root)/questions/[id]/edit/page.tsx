import React from 'react';

import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import ROUTES from '@/constants/routes';
import { getQuestionById } from '@/lib/actions/question.action';

import QuestionForm from '@/components/forms/question.from';

const EditQuestionPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);

  const { data: question, success } = await getQuestionById({ questionId: id });
  if (!success) return notFound();

  if (question?.author.toString() !== session?.user?.id) {
    return redirect(ROUTES.QUESTION(id));
  }

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestionPage;
