import React from 'react';

const QuestionDetailPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>QuestionDetailPage {id}</div>;
};

export default QuestionDetailPage;
