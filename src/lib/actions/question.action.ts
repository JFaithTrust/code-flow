'use server';

import mongoose, { FilterQuery } from 'mongoose';

import Question, { IQuestionDocument } from '@/database/question.model';
import TagQuestion from '@/database/tag-question.model';
import Tag, { ITagDocument } from '@/database/tag.model';
import { ActionResponse, ErrorResponse } from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { NotFoundError, UnauthorizedError } from '../http-errors';
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionsSchema,
  IncrementViewSchema,
  PaginatedSearchSchema,
} from '../validation';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getAllQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({ params, schema: PaginatedSearchSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<Question> = {};

  if (filter === 'recomended') {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, 'i') } },
      { content: { $regex: new RegExp(query, 'i') } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case 'newest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'unanswered':
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case 'popular':
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate('tags', 'name')
      .populate('author', 'name image')
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = skip + questions.length < totalQuestions;

    return { success: true, data: { questions: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTopQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    const questions = await Question.find().sort({ upvotes: -1, views: -1 }).limit(5);

    return { success: true, data: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function getQuestionById(
  params: GetQuestionsParams,
): Promise<ActionResponse<Question>> {
  const validationResult = await action({ params, schema: GetQuestionsSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate('tags')
      .populate('author', 'name image');

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
      (tag: ITagDocument) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()), // use some instead of includes to compare names
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${escapeRegExp(tag)}$`, $options: 'i' } }, // changed by escapeRegExp function
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
        (tag: mongoose.Types.ObjectId) =>
          !tagsToRemoveIds.some((id: mongoose.Types.ObjectId) => id.equals(tag._id)),
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

export async function incrementQuestionViews(
  params: incrementQuestionViewsParams,
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({ params, schema: IncrementViewSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new NotFoundError('Question');

    question.views += 1;
    await question.save();

    // revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { views: question.views } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
