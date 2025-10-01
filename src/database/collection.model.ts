import { Schema, model, models } from 'mongoose';

import { ICollection } from '@/types/model';

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  { timestamps: true },
);

const Collection = models.Collection || model<ICollection>('Collection', CollectionSchema);

export default Collection;
