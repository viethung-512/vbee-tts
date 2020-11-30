import mongoose from 'mongoose';
import { Resource, Action } from '@tts-dev/common';

interface RoleAttrs {
  name: string;
  resources: {
    name: Resource;
    actions: Action[];
  }[];
  policy?: string;
}

interface RoleDoc extends mongoose.Document {
  name: string;
  resources: {
    name: Resource;
    actions: Action[];
  }[];
  policy: {
    official_version: string | null;
    draff_version: string | null;
  };
}

interface RoleModel extends mongoose.Model<RoleDoc> {
  build(attrs: RoleAttrs): RoleDoc;
}

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    resources: [
      {
        name: { type: String },
        actions: [String],
      },
    ],
    policy: {
      official_version: { type: String },
      draff_version: { type: String },
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

roleSchema.statics.build = (attrs: RoleAttrs) => {
  return new Role({
    ...attrs,
    policy: {
      official_version: null,
      draff_version: attrs.policy || null,
    },
  });
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', roleSchema);

export { Role, RoleAttrs, RoleDoc, RoleModel };
