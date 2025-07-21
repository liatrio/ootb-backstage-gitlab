import { GitLabCredentialField } from './fields/GitLabCredentialField';

export const customFieldExtensions = [
  // ...other field extensions,
  {
    name: 'GitLabCredentialField',
    component: GitLabCredentialField,
  },
];