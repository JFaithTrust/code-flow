import React from 'react';

import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ROUTES from '@/constants/routes';
import { EMPTY_ANSWERS } from '@/constants/states';
import { getAllAnswers } from '@/lib/actions/answer.action';
import { getQuestionById, incrementQuestionViews } from '@/lib/actions/question.action';
import { formatNumber } from '@/lib/utils';

import AnswerCard from '@/components/cards/answer.card';
import TagCard from '@/components/cards/tag.card';
import Preview from '@/components/editor/preview';
import AnswerForm from '@/components/forms/answer.form';
import DataRenderer from '@/components/shared/data-renderer';
import Metric from '@/components/shared/metric';
import UserAvatar from '@/components/shared/user-avatar';

const QuestionDetailPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { success: incrementSuccess } = await incrementQuestionViews({ questionId: id });
  const { success, data } = await getQuestionById({ questionId: id });

  if (!success || !data) notFound();

  const {
    success: answersSuccess,
    data: answersResult,
    error: answersError,
  } = await getAllAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: 'latest',
  });

  if (!answersSuccess || answersError || !answersResult) {
    console.error('Failed to load answers:', answersError);
    notFound();
  }

  if (!incrementSuccess) console.error('Failed to increment question views');

  const { _id, author, title, content, tags, createdAt, views, answers: answersCount } = data;
  const { totalAnswers, answers } = answersResult;

  return (
    <>
      <div className="flex-start w-full flex-col">
        {/* delete flex-col-reverse */}
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>

          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>

        <h2 className="mt-3.5 w-full h2-semibold text-dark200_light900">{title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answersCount}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />

        <Preview content={content} />

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag: Tag) => (
            <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
          ))}
        </div>
      </div>

      <section className="my-5">
        <div className="flex items-center justify-between">
          <h3 className="primary-text-gradient">
            {totalAnswers} {totalAnswers === 1 ? 'Answer' : 'Answers'}
          </h3>
          <p>Filters</p>
        </div>

        <DataRenderer
          data={answers}
          error={answersError}
          success={answersSuccess}
          empty={EMPTY_ANSWERS}
          render={(answers) => answers.map((a) => <AnswerCard key={a._id} answer={a} />)}
        />
      </section>

      <section className="my-5">
        <AnswerForm questionId={_id} questionTitle={title} questionContent={content} />
      </section>
    </>
  );
};

export default QuestionDetailPage;
