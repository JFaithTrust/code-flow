'use server';

import mongoose from 'mongoose';

import Question, { IQuestionDocument } from '@/database/question.model';
import TagQuestion from '@/database/tag-question.model';
import Tag, { ITagDocument } from '@/database/tag.model';
import { ActionResponse, ErrorResponse } from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { NotFoundError, UnauthorizedError } from '../http-errors';
import { AskQuestionSchema, EditQuestionSchema, GetQuestionsSchema } from '../validation';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getQuestionById(
  params: GetQuestionsParams,
): Promise<ActionResponse<Question>> {
  const validationResult = await action({ params, schema: GetQuestionsSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate('tags').lean<Question>();

    if (!question) throw new NotFoundError('Question');

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<IQuestionDocument>> {
  const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create([{ title, content, author: userId }], { session });

    if (!question) throw new Error('Question creation failed');

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: new RegExp(`^${escapeRegExp(tag)}$`, 'i') }, // changed by escapeRegExp function
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({ tag: existingTag._id, question: question._id });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    question.tags.push(...tagIds);
    await question.save({ session }); // Save the question with the associated tags
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function updateQuestion(
  params: EditQuestionParams,
): Promise<ActionResponse<IQuestionDocument>> {
  const validationResult = await action({ params, schema: EditQuestionSchema, authorize: true });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId, title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate('tags');

    if (!question) throw new NotFoundError('Question');

    if (question.author.toString() !== userId) {
      throw new UnauthorizedError();
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.some((t: ITagDocument) => t.name.toLowerCase() === tag.toLowerCase()), // use some instead of includes to compare names
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITagDocument) => !tags.includes(tag.name.toLowerCase()),
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: new RegExp(`^${escapeRegExp(tag)}$`, 'i') }, // changed by escapeRegExp function
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          newTagDocuments.push({ tag: existingTag._id, question: question._id });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagsToRemoveIds = tagsToRemove.map((tag: ITagDocument) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagsToRemoveIds } },
        { $inc: { questions: -1 } },
        { session },
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagsToRemoveIds }, question: questionId },
        { session },
      );

      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagsToRemoveIds.includes(tagId),
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
