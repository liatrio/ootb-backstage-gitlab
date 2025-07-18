# Setup Backstage

Outlining all the setup steps completed to get backstage up and running in live environment. Highlighting where we needed to get resources/configuration created/adjusted by external teams.

[Jira Backstage List View](https://<company>.atlassian.net/jira/software/c/projects/EECI/list?filter=parent%20IN%20(%22EECI-5628%22%2C%20%22EECI-5609%22%2C%20%22EECI-5608%22%2C%20%22EECI-5607%22%2C%20%22EECI-5606%22%2C%20%22EECI-5605%22%2C%20%22EECI-5630%22%2C%20%22EECI-5523%22%2C%20%22EECI-5510%22%2C%20%22EECI-5081%22)&sortBy=status&direction=DESC)

## App Repo

- Create MR for new group. Needed MR approval from SDP team to create dedicated SDP DevEx applications group for permanent location (instead of workshop).
  - [MR to Group Management Service repo](https://gitlab.com/<company>/<company>-internal/gitlab-self-serve/group-management-service/-/merge_requests/258)
- Created backstage app with fresh backstage installation
  - [Initial commit to backstage repo](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/commit/dc05dc750769fa15ddbe472041a8cd7545effa75)
- Containerized app
  - [MR to backstage repo](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/2)

## Deployment

- Created MR for namespace creation. Needed MR approval from Ek8s team for namespace creation.
  - [MR to Ek8s repo](https://gitlab.com/<company>/ccis/tech-infrastructure-can/ek8s/ek8s-secops-npd/-/merge_requests/1400)
- Created backstage argocd repo from Flowkit
  - insert jira ticket link
- Created Backstage deployment configuration (helm templates, dev & qa values)
- Created teams request to link temp ADrancher group (starterkit) to backstage namespaces
  - [Teams post/conversation requesting code change](https://teams.microsoft.com/l/message/19:3ef0ce7f0d774b1e83f3a19b21206b84@thread.tacv2/1750255922493?tenantId=59762c14-55e8-4b58-806e-f6cc47d75b19&groupId=688d6657-b341-4d26-a6b8-eeeb1fdd7719&parentMessageId=1749669002711&teamName=Enterprise%20Kubernetes%20(EK8S)&channelName=EK8s%20-%20Secure%20Delivery%20Platform%20(SDP)&createdTime=1750255922493)
  - Ek8s authored MR for AD starterkit group[(MR)](https://gitlab.com/<company>/ccis/tech-infrastructure-can/ek8s/ek8s-rancher-config/-/merge_requests/216/diffs)
- Created servicenow request to create new AD group for sdp-devex access to namespaces
  - [Servicenow ticket -  RITM1516087](https://luluprod.service-now.com/sp?id=ticket&table=sc_req_item&sys_id=0cfd5818c3d2ae908eb14fadc001314c)
- Created teams request to link AD temp rancher group (sdp-devex) to backstage namespaces
  - [Teams post/conversation requesting code change](https://teams.microsoft.com/l/message/19:3ef0ce7f0d774b1e83f3a19b21206b84@thread.tacv2/1752693313781?tenantId=59762c14-55e8-4b58-806e-f6cc47d75b19&groupId=688d6657-b341-4d26-a6b8-eeeb1fdd7719&parentMessageId=1752693313781&teamName=Enterprise%20Kubernetes%20(EK8S)&channelName=EK8s%20-%20Secure%20Delivery%20Platform%20(SDP)&createdTime=1752693313781)
  - Ek8s authored MR to AD sdp-devex group[(MR)](https://gitlab.com/<company>/ccis/tech-infrastructure-can/ek8s/ek8s-rancher-config/-/merge_requests/228)
  
## Domain

> had to shared domain with a subpath but Backstage works easiest/smoothest with a dedicated domain due to the frontend routing. temporarily used shared domain (paved path) while waiting for help with dedicated domain (not a paved path)

- Create Teams post to request help on created/configuring dedicated domain for backstage
  - [Teams post/conversation requesting help](https://teams.microsoft.com/l/message/19:3ef0ce7f0d774b1e83f3a19b21206b84@thread.tacv2/1750866016495?tenantId=59762c14-55e8-4b58-806e-f6cc47d75b19&groupId=688d6657-b341-4d26-a6b8-eeeb1fdd7719&parentMessageId=1750866016495&teamName=Enterprise%20Kubernetes%20(EK8S)&channelName=EK8s%20-%20Secure%20Delivery%20Platform%20(SDP)&createdTime=1750866016495)
  - [MR - Deployment - switch to new domain](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage-argocd/-/merge_requests/35)
  - [MR - Backstage App - switch to new domain](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/23)

## SSO/Auth

> Each SSO implementation requires a predictable/stable URL for the app registration redirect. We had to re-request the app registration for sso dev after the domain change.

- Created servicenow ticket for Azure app registration for sso dev
  - [RITM1523815](https://luluprod.service-now.com/sp?id=ticket&table=sc_req_item&sys_id=29f7a8e297962e50104f34c11153afcc)
- Created servicenow ticket for Azure app registration for sso qa
  - `still in progress` [RITM1536830](https://luluprod.service-now.com/sp?id=ticket&table=sc_req_item&sys_id=b3897c62c32aae500746e90599013165)
    - [child Jira ticket](https://<company>.atlassian.net/browse/IAM-9497)
- Created servicenow ticket for Azure app registration for sso dev (now with new url)
  - `still in progress` [RITM1541434](https://luluprod.service-now.com/sp?id=ticket&table=sc_req_item&sys_id=ea32cf2fc326a650e407afdc7a013123)
    - [child Jira ticket](https://<company>.atlassian.net/browse/IAM-9542)
- Created GitLab app registration for sso dev
- Created GitLab app registration for sso qa
- Created kubernetes secret for gitlab auth secret in dev namespace & in vault
- Created kubernetes secret for gitlab auth secret in qa namespace & in vault
- Requested a GitLab global read access token
  - insert link to teams post
- Created kubernetes secret for gitlab access token in dev namespace & in vault
- Created kubernetes secret for gitlab access token in qa namespace & in vault

## Vault

> Ideally we wanted to use Vault to store and retrieve secrets for Backstage. We are still troubleshooting access to vault secrets for our namespaces for a number of secrets.

- Initial Vault onboarding
  - ServiceNow ticket for vault access - RITM1524204
  - create group for vault access: pim-llaz-vault-sdp-devex-npd-readwrite group
  - [MR to add vault configuration for deployment](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage-argocd/-/merge_requests/32/diffs)
  - MR's to update vault configuration for Vault team controlled IaC repo
    - https://gitlab.com/<company>/<company>-internal/esms/hashicorp-vault-ent-config-npd/-/merge_requests/3288
    - https://gitlab.com/<company>/<company>-internal/esms/hashicorp-vault-ent-config-npd/-/merge_requests/3260
    - https://gitlab.com/<company>/<company>-internal/esms/hashicorp-vault-ent-config-npd/-/merge_requests/3250

- Requesting additional help with vault access/configuration after completing onboarding.
  - [Teams post/conversation requesting help](https://teams.microsoft.com/l/message/19:p7ZMEA45r9F8maTVX9mcLCKisywxmjD_9A7geYAtEsA1@thread.tacv2/1752158083983?tenantId=59762c14-55e8-4b58-806e-f6cc47d75b19&groupId=04f5cc71-434b-4ce6-9827-8686a98efaa7&parentMessageId=1752158083983&teamName=ESMS%20(Vault)%20Support%20Operations&channelName=General&createdTime=1752158083983)

## Features

Work committed to <company>-backstage repo.

> Not all MRs and commits are mentioned. These are some of the major highlights.

- Enable templates (and enable open source contribution for templates, with MRs required)
  - [MR - enable templates](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/17)
  - [MR - enable template list](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/18)
- Enable Gitlab Auth
  - [MR - enable Gitlab Auth](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/22)
  - [MR - switch Gitlab Auth to internal SDP DevEx owned GitLab App](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/35)
- Enable GitLab auth in templates
  - [MR - add custom GitLab auth field](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/32)
- Enable CICD pipeline statistics
  - [MR - enable CICD pipeline statistics](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/27)
- Define a Domain, system
  - [MR - define a domain/system](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/9)
- Customize layout of Backstage for user journeys
  - [MR - customize layout/homepage](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/11)
-Enable global Gitlab use/ingestion
  - [MR - enable global Gitlab](https://gitlab.com/<company>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/<company>-backstage/-/merge_requests/29)
