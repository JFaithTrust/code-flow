import React from 'react';

import ROUTES from '@/constants/routes';
import { EMPTY_TAGS } from '@/constants/states';
import { getAllTags } from '@/lib/actions/tag.question';

import TagCard from '@/components/cards/tag.card';
import DataRenderer from '@/components/shared/data-renderer';
import LocalSearch from '@/components/shared/locale-search';

const TagsPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getAllTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-3xl text-dark100_light900">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          placeholder="Search tags..."
          imgSrc="/icons/search.svg"
          route={ROUTES.TAGS}
          otherClasses="flex-1"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagsPage;
