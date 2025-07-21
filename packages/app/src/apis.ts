import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  gitlabAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
  scmAuthApiRef
} from '@backstage/integration-react';
import { cicdStatisticsApiRef } from '@backstage-community/plugin-cicd-statistics';
import { CicdStatisticsApiGitlab } from '@backstage-community/plugin-cicd-statistics-module-gitlab';


export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: cicdStatisticsApiRef,
    deps: { gitlabAuthApi: gitlabAuthApiRef },
    factory: ({ gitlabAuthApi }) => new CicdStatisticsApiGitlab(gitlabAuthApi),
  }),
  createApiFactory({
    api: scmAuthApiRef,
    deps: { gitlabAuthApi: gitlabAuthApiRef },
    factory: ({ gitlabAuthApi }) => ScmAuth.forGitlab(gitlabAuthApi),
  }),
];
