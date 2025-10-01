import Link from 'next/link';

import ROUTES from '@/constants/routes';

import QuestionCard from '@/components/cards/question.card';
import HomeFilter from '@/components/shared/home-filter';
import LocalSearch from '@/components/shared/locale-search';
import { Button } from '@/components/ui/button';

const questions: IQuestion[] = [
  {
    _id: '1',
    title: 'How to learn React?',
    tags: [
      { _id: '1', name: 'React' },
      { _id: '2', name: 'JavaScript' },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      image:
        'https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'How to learn JavaScript?',
    tags: [
      { _id: '1', name: 'React' },
      { _id: '2', name: 'JavaScript' },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      image:
        'https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export default async function Home({ searchParams }: RouteParams) {
  const { query = '', filter = '' } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="min-h-[46px] px-4 py-3 !text-light-900 primary-gradient" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}
