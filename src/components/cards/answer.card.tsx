import React, { Suspense } from 'react';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { hasVoted } from '@/lib/actions/vote.action';
import { cn } from '@/lib/utils';

import Preview from '../editor/preview';
import UserAvatar from '../shared/user-avatar';
import Votes from '../shared/votes';

interface AnswerCardProps {
  answer: Answer;
  containerClasses?: string;
  showReadMore?: boolean;
}

const AnswerCard = ({ answer, containerClasses, showReadMore = false }: AnswerCardProps) => {
  const hasVotedPromise = hasVoted({
    targetId: answer._id.toString(),
    targetType: 'answer',
  });

  return (
    <article className={cn('border-b light-border py-10', containerClasses)}>
      <span id={JSON.stringify(answer._id)} className="hash-span" />
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={answer.author._id}
            name={answer.author.name}
            imageUrl={answer.author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(answer.author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {answer.author.name ?? 'Anonymous'}
            </p>

            <p className="mt-0.5 ml-0.5 line-clamp-1 small-regular text-light400_light500">
              <span className="max-sm:hidden"> • </span>
              answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              targetType="answer"
              targetId={answer._id.toString()}
              hasVotedPromise={hasVotedPromise}
              upvotes={answer.upvotes}
              downvotes={answer.downvotes}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={answer.content} />

      {showReadMore && (
        <Link
          href={`/questions/${answer.question}#answer-${answer._id}`}
          className="relative z-10 font-space-grotesk body-semibold text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
