import { Schema, model, models } from 'mongoose';

import { IVote } from '@/types/model';

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['question', 'answer'], required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
  },
  { timestamps: true },
);

const Vote = models.Vote || model<IVote>('Vote', VoteSchema);

export default Vote;
