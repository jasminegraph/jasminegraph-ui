import mongoose, { Schema, Model, Document } from 'mongoose';

type AuthDocument = Document & {
  username: string;
  password: string;
};

type AuthInput = {
  username: AuthDocument['username'];
  password: AuthDocument['password'];
};

const authSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'auth',
    timestamps: true,
  },
);

const Auth: Model<AuthDocument> = mongoose.model<AuthDocument>('Auth', authSchema);

export { AuthDocument, AuthInput, Auth };