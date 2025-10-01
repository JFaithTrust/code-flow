import React from 'react';

import Image from 'next/image';
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
  remove?: boolean;
  isButton?: boolean;
  onRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  onRemove,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="flex-center space-x-2 rounded-md border-none background-light800_dark300 px-4 py-2 subtle-medium text-light400_light500 uppercase">
        <i className={`${iconClass} text-sm`} />
        <span>{name}</span>

        {remove && (
          <Image
            src="/icons/close.svg"
            alt="Remove Tag"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={onRemove}
          />
        )}
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
};

export default TagCard;
