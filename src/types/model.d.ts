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
  upvotes: number;
  downvotes: number;
  answers: number;
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
  id: Types.ObjectId;
  type: 'question' | 'answer';
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
