import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ROUTES from '@/constants/routes';

import TagCard from '../cards/tag.card';

const hotQuestions = [
  { _id: '1', title: 'How to create a custom hook in React?' },
  { _id: '2', title: 'How to use React Query?' },
  { _id: '3', title: 'How to use Redux?' },
  { _id: '4', title: 'How to use React Router?' },
  { _id: '5', title: 'How to use React Context?' },
];

const popularTags = [
  { _id: '1', name: 'react', questions: 100 },
  { _id: '2', name: 'javascript', questions: 200 },
  { _id: '3', name: 'typescript', questions: 150 },
  { _id: '4', name: 'nextjs', questions: 50 },
  { _id: '5', name: 'react-query', questions: 75 },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen flex-col gap-6 overflow-y-auto border-l light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={ROUTES.PROFILE(question._id)}
              className="flex cursor-pointer items-center justify-between"
            >
              <p className="body-medium text-dark500_light700">{question.title}</p>

              <Image
                src={'/icons/chevron-right.svg'}
                alt="arrow right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <div key={tag._id}>
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questions={tag.questions}
                showCount
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
