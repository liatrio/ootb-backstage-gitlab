import { useEffect } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { useApi } from '@backstage/core-plugin-api';
import { scmAuthApiRef } from '@backstage/integration-react';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';

import { z } from 'zod';
import { makeFieldSchemaFromZod } from '@backstage/plugin-scaffolder';

export const GitLabCredentialFieldSchema = makeFieldSchemaFromZod(
  z.object({
    requestUserCredentials: z
      .object({
        secretsKey: z
          .string()
          .describe(
            'Key used within the template secrets context to store the credential',
          ),
        additionalScopes: z
          .object({
            gitlab: z
              .array(z.string())
              .optional()
              .describe('Additional GitLab scopes to request'),
          })
          .optional()
          .describe('Additional permission scopes to request'),
      })
      .describe(
        'If defined will request user credentials to auth against the given SCM platform',
      ),
  }),
);

export type GitLabCredentialFieldProps = typeof GitLabCredentialFieldSchema.type;

export const GitLabCredentialField = (
  props: FieldExtensionComponentProps<GitLabCredentialFieldProps>,
) => {
  const scmAuthApi = useApi(scmAuthApiRef);
  const { secrets, setSecrets } = useTemplateSecrets();
  const repoUrl = 'https://gitlab.com';

  useEffect(() => {
    const login = async () => {
      try {
        if (secrets.USER_OAUTH_TOKEN) {
          return;
        }

        const additionalScopes = props.schema?.requestUserCredentials?.additionalScopes?.gitlab;
        const { token } = await scmAuthApi.getCredentials({
          url: repoUrl,
          additionalScope: {
            repoWrite: true,
            ...(additionalScopes ? { customScopes: additionalScopes } : {}),
          },
        });

        setSecrets({ ['USER_OAUTH_TOKEN']: token });
      } catch (error) {
        // console.error('Failed to login', error);
      }
    };
    login();
  }, [scmAuthApi, props.schema?.requestUserCredentials, secrets, setSecrets, repoUrl]);

  return null;
};