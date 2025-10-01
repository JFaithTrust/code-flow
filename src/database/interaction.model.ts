import { Schema, model, models } from 'mongoose';

import { IInteraction } from '@/types/model';

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ['question', 'answer'], required: true },
  },
  { timestamps: true },
);

const Interaction = models.Interaction || model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;
