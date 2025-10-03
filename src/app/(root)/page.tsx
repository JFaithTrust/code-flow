import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { EMPTY_QUESTION } from '@/constants/states';
import { getAllQuestions } from '@/lib/actions/question.action';

import QuestionCard from '@/components/cards/question.card';
import DataRenderer from '@/components/shared/data-renderer';
import HomeFilter from '@/components/shared/home-filter';
import LocalSearch from '@/components/shared/locale-search';
import { Button } from '@/components/ui/button';

export default async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getAllQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { questions } = data || {};

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

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
}
