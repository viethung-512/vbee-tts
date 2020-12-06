import { Action, Resource } from '@tts-dev/common';

export interface Role {
  id: string;
  name: string;
  resources: RoleResource[];
  policy: RolePolicy;
}

export interface RoleResource {
  name: Resource;
  actions: Action[];
}

export interface RolePolicy {
  official_version: string | null;
  draft_version: string | null;
}
