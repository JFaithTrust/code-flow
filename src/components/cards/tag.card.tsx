import React from 'react';

import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { getDeviconClassName } from '@/lib/utils';

import { Badge } from '../ui/badge';

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ _id, name, questions, showCount, compact }: TagCardProps) => {
  const iconClass = getDeviconClassName(name);

  return (
    <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
      <Badge className="flex-center space-x-2 rounded-md border-none background-light800_dark300 px-4 py-2 subtle-medium text-light400_light500 uppercase">
        <i className={`${iconClass} text-sm`} />
        <span>{name}</span>
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </Link>
  );
};

export default TagCard;
