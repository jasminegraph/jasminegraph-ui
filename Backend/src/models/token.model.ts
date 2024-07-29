import mongoose, { Schema, Model, Document } from 'mongoose';

type TokenDocument = Document & {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
};

type TokenInput = {
  userId: TokenDocument['userId'];
  accessToken: TokenDocument['accessToken'];
  refreshToken: TokenDocument['refreshToken'];
  expiryDate: TokenDocument['expiryDate'];
};

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

tokenSchema.index({createdAt: 1}, {expireAfterSeconds: 7*24*60*60});

const Token: Model<TokenDocument> = mongoose.model<TokenDocument>('Token', tokenSchema);

export { Token, TokenInput, TokenDocument };
