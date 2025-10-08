interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface Tag {
  _id: string;
  name: string;
  questions?: number;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
}

interface Answer {
  _id: string;
  content: string;
  author: Author;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

interface Collection {
  _id: string;
  author: string | Author;
  question: Question;
}
