import mongoose from 'mongoose';
import { Resource, Action } from '@tts-dev/common';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

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
    draft_version: string | null;
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
        // @ts-ignore
        name: String,
        actions: [String],
      },
    ],
    policy: {
      // @ts-ignore
      official_version: String,
      // @ts-ignore
      draft_version: String,
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

roleSchema.plugin(MongooseFuzzySearching, {
  fields: ['name'],
});

roleSchema.statics.build = (attrs: RoleAttrs) => {
  return new Role({
    ...attrs,
    policy: {
      official_version: null,
      draft_version: attrs.policy || null,
    },
  });
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', roleSchema);

export { Role, RoleAttrs, RoleDoc, RoleModel };
