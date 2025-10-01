interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface ITag {
  _id: string;
  name: string;
}

interface IAuthor {
  _id: string;
  name: string;
  image: string;
}

interface IQuestion {
  _id: string;
  title: string;
  tags: ITag[];
  author: IAuthor;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  answers: number;
  upvotes: number;
}
