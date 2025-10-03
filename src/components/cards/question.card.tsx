import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import ROUTES from '@/constants/routes';

import TagCard from './tag.card';
import Metric from '../shared/metric';

const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <div className="rounded-[10px] card-wrapper p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex subtle-regular text-dark400_light700 sm:hidden">
            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </span>

          <Link href={ROUTES.QUESTION(question._id)}>
            <h3 className="line-clamp-1 flex-1 base-semibold text-dark200_light900 sm:h3-semibold">
              {question.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {question.tags.map((tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="mt-6 flex-between w-full flex-wrap gap-3">
        <Metric
          imgUrl={question.author.image}
          alt={question.author.name}
          value={question.author.name}
          title={`• asked ${formatDistanceToNow(new Date(question.createdAt), {
            addSuffix: true,
          })}`}
          href={ROUTES.PROFILE(question.author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
      </div>
    </div>
  );
};

export default QuestionCard;
