import { Types } from 'mongoose';

interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
}

interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
}

interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: 'question' | 'answer';
  voteType: 'upvote' | 'downvote';
}

interface ITagQuestion {
  question: Types.ObjectId;
  tag: Types.ObjectId;
}

interface ITag {
  name: string;
  questions: number;
}

interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: 'question' | 'answer';
}

interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}
