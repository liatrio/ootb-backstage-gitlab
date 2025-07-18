# Backstage Implementation Playbook

This playbook provides a structured approach to implementing Backstage as the Internal Developer Portal (IDP). It follows a walk-crawl-run methodology to help you progressively build and enhance the Backstage instance.

## Introduction

[Backstage](https://backstage.io) is an open platform for building developer portals, created by Spotify and now part of the CNCF. It provides a unified interface for all your infrastructure tooling, services, and documentation.

This playbook will guide you through the implementation process in three phases:

1. **Crawl**: `demo quick capability` Get Backstage working locally with basic configuration and capabilities and demo-able.
2. **Walk**: `real use cases` Deploy live containerized instances with GitLab auth, guest login, Techdocs (machine built), GitLab integration, in memory db, health endpoint, defined users, and working templates.
3. **Run**: `productionalize` Production-ready setup with persistent database, Org provider (dynamic users), Techdocs hosted on S3.

> the ootb backstage in this repo only gets you to the **WALK** phase

📓 **most custom config can be copied from the ootb backstage repo, but we will still explain the steps taken below

## Start these conversations NOW/ASAP

> these will become MUST HAVES for the implementation of live environments

- how can we go about getting a dedicated dns
  - `work around?` -- partial -- for some functionality in Backstage, it was configurable to use a prefix path on a shared domain like mycompany.com/backstage-dev, but GitLab plugin was not built to support this and there are possibly undiscovered issues with other plugins too.
- how can we go about setting up a Azure app registration for SSO
  - `work around?` -- yes -- keep guest access but MUST restrict access to backstage through some other means (like requiring availability over company vpn and restricting all GitLab resources to OAuth prompts) -- don't take this workaround to a production environment
- how can we get namespaces for hosting backstage environments and access to them
  - `work around?` -- maybe? -- backstage needs to be hosted somewhere; find out what hosting options are available
- how can we go about getting a READ ALL reporter access token to GitLab
  - `work around?` -- yes -- yes, use personal access token from GitLab for a user that has read access to all repos, or at least the repos you need to view -- don't take this workaround to a production environment

## Phase 1: Crawl - Local Setup and Basic Configuration

The goal of this phase is to get Backstage working locally to demonstrate its value and familiarize yourself with its capabilities.

### Step 1: Set Up Development Environment

1. Fresh install of Backstage using the [official Backstage documentation](https://backstage.io/docs/getting-started)
2. Confirm fresh install by running `yarn start` and ensuring Backstage starts successfully

### Step 2: Configure Local Instance & Basic Capability

1. Configure local development environment
  - update the app-config.yaml file to use $include for environment specific config (this will be important for containerization supporting multiple environments)
  > we will use this to dynamically include config for local, dev, qa, ci, and prod environments at build and run time of the container
  - create a app-config.local.yaml file with localhost config
2. Setup GitLab integration
  - add the GitLab client ID and client secret to the app-config.local.yaml file for the auth provider
    - GitLab provider requires defined users (the catalog.create setting only works for github and google as of 7/28/25)
    - use email resolver if you plan to later access the email address during templates executions
  - add the GitLab token to the app-config.local.yaml file
  - add yourself as a defined user company/gitlab-users.yaml (create the company, or name of company directory)
    - add the email address your GitLab account is associated with
  - add the company/gitlab-users.yaml location to app-config.local.yaml
3. Add GitLab plugins
  - [backstage-plugin-gitlab](https://github.com/immobiliare/backstage-plugin-gitlab)
    - can we used with GitLab token (default) or OAuth (config change for OAuth)
    - recommended to use OAuth configuration for this plugin
  - [backstage-community/plugin-cicd-statistics](https://www.npmjs.com/package/@backstage-community/plugin-cicd-statistics)
    - requires GitLab OAuth
4. Add TechDocs plugin
  - [backstage/plugin-techdocs](https://backstage.io/docs/features/techdocs/getting-started)
  - chose `builder: 'local'`
  - setup python virtual environment and install mkdocs-techdocs-core and mkdocs-mermaid2-plugin (needed to render docs on local machine)
5. Customize Home Page & Tabs Column for User Journeys
  - Homepage cards (use journeys)
    - onboard new app (links to app starter kits)
    - adopt/migrate existing app (links to templates for MRs)
  - tabs
    - starter kits (link to stater kit tag filtered templates)
    - resusable shared components (link to shared component tag filtered components)
    - onboarding guides (link to onboarding tag filtered docs)

## Phase 2: Walk - Live environment(s)

> disclaimer: it is BEST to have a dedicated dns ready for the backstage app to be hosted on. Most Backstage plugins are not built anticipate a prefix path on a shared domain like mycompany.com/backstage-dev.

1. Configure [Dockerfile](https://backstage.io/docs/deployment/docker)
  - add techdoc package installation
  - adjust for Node development runtime
    - update to `ENV NODE_ENV=production`
    - update to `yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"`

2. Add a app-config.ci.yaml file (copy from local) -- this will be used for pipeline build of backstage app

3. Build container
  - confirm local container builds & runs successfully with app.config-ci.yaml and local auth

4. Setup build pipeline
  - follow the [host build directions](https://backstage.io/docs/deployment/docker#host-build) to have an app build job and then a image build job following that using the built app packages (skeleton.tar.gz and bundle.tar.gz)

### Step 2: Configure Authentication

1. Setup GitLab auth App for live environments, store secrets in namespaces (best if vault is used for storage and access)
2. Complete the same for other auth providers (Microsoft, Okta, etc.) to expand access beyond just GitLab users
  - will require an update to users file to include new non-gitlab users OR add new Org provider to create users

### Step 3: Deployment

1. Follow [Kubernetes Deployment](https://backstage.io/docs/deployment/k8s) directions OR reference [argo deployment example used at a previous client](/backstage-argo-cd/)


### Step 4: Implement Real Examples

1. **Add real components to the catalog**:
2. **Set up templates for your organization**:
3. **Integrate with your GitLab instance**:

## Phase 3: Run - Production-Ready Configuration
### Step 1: Set Up Persistent Storage
1. **Configure PostgreSQL database**:
2. **Configure object storage for TechDocs**:

### Step 2: Implement Monitoring and Observability
1. **Implement logging**:
2. **Set up metrics**:

### Step 3: Enhance Security
1. **Implement proper secret management**:
2. **Configure role-based access control**:
  - admin groups for backstage

### Step 4: Scale and Optimize

1. **Configure horizontal scaling**:
2. **Implement caching**:

### Step 5: Advanced Features

1. **Implement Microsoft Entra Tenant Data integration**:
2. **Set up advanced search**:

## Conclusion

Following this playbook will help you implement Backstage in a structured and progressive manner. Each phase builds upon the previous one, allowing you to demonstrate value early while working towards a production-ready deployment.

Remember that Backstage is highly customizable, and you should adapt this playbook to your client's specific needs and constraints.

## References

- [Backstage Official Documentation](https://backstage.io/docs)
- [Backstage GitHub Repository](https://github.com/backstage/backstage)
- [CNCF Backstage Project](https://www.cncf.io/projects/backstage/)
