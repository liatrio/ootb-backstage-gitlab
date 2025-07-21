import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { GitLabCredentialField } from './GitLabCredentialField';

export const GitLabCredentialFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'GitLabCredentialField',
    component: GitLabCredentialField,
  }),
);