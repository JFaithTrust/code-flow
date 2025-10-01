import { model, models, Schema } from 'mongoose';

import { IAccount } from '@/types/model';

const AccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String },
  password: { type: String },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
});

const Account = models?.Account || model<IAccount>('Account', AccountSchema);

export default Account;
