'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import ROUTES from '@/constants/routes';
import Answer, { IAnswerDocument } from '@/database/answer.model';
import Question from '@/database/question.model';
import { ActionResponse, ErrorResponse } from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { NotFoundError } from '../http-errors';
import { CreateAnswerSchema, GetAnswersSchema, GetUserAnswersSchema } from '../validation';

export async function getAllAnswers(params: GetAnswerParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({ params, schema: GetAnswersSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId, page = 1, pageSize = 10, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case 'latest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'oldest':
      sortCriteria = { createdAt: 1 };
      break;
    case 'popular':
      sortCriteria = { upvotes: -1, createdAt: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id name image')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = skip + answers.length < totalAnswers;

    return {
      success: true,
      data: {
        answers,
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDocument>> {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new NotFoundError('Question');
    }

    const [newAnswer] = await Answer.create(
      [
        {
          content,
          question: questionId,
          author: userId,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error('Failed to create answer');

    question.answer += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getUserAnswers(
  params: GetUserAnswersParams,
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean }>> {
  const validationResult = await action({ params, schema: GetUserAnswersSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .populate('author', '_id name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = skip + answers.length < totalAnswers;

    return {
      success: true,
      data: {
        answers,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
