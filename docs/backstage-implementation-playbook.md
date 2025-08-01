# Backstage Implementation Playbook

This playbook provides a structured approach to implementing Backstage as the Internal Developer Portal (IDP). It follows a walk-crawl-run methodology to help you progressively build and enhance the Backstage instance.

If at any point you have questions, need clarification, or want to contribute back to the Backstage playbook, please reach out to the [Backstage foundations channel in Slack](https://liatrio.slack.com/archives/C05MA4MMD71). No Backstage question is too small, too big, too basic, too advanced; we ALL will struggled with something in Backstage eventually. Definitely don't sit on troubleshooting for too long before doing a sanity check with someone 🆘.

## Introduction

[Backstage](https://backstage.io) is an open platform for building developer portals, created by Spotify and now part of the CNCF. It provides a unified interface for all your infrastructure tooling, services, and documentation.

This playbook will guide you through the implementation process in three phases:

1. **Crawl**: `demo quick capability` Get Backstage working locally with basic configuration and capabilities and demo-able.
2. **Walk**: `real use cases` Deploy live containerized instances with GitLab auth, guest login, Techdocs (machine built), GitLab integration, in memory db, health endpoint, defined users, and working templates.
3. **Run**: `productionalize` Production-ready setup with persistent database, Org provider (dynamic users), Techdocs hosted on S3.

> the ootb backstage in this repo only gets you to the **WALK** phase

📓 **most custom config can be copied from the ootb backstage repo, but we will still explain the steps taken below**

## Start these conversations NOW/ASAP

> these will become MUST HAVES for the implementation of live environments

- how can we go about getting a dedicated dns
  - `work around?` -- partial -- for some functionality in Backstage, it was configurable to use a prefix path on a shared domain like mycompany.com/backstage-dev, but GitLab plugin was not built to support this and there are possibly undiscovered issues with other plugins too.
- how can we go about setting up a Azure app registration for SSO
  - `work around?` -- yes -- keep guest access but MUST restrict access to backstage through some other means (like requiring availability over company vpn and restricting all GitLab resources to OAuth prompts) -- don't take this workaround to a production environment
- how can we get namespaces for hosting backstage environments and access to them
  - `work around?` -- maybe? -- backstage needs to be hosted somewhere; find out what hosting options are available
- how can we go about getting a READ ALL reporter access token to GitLab
  - `work around?` -- yes -- use personal access token from GitLab for a user that has read access to all repos, or at least the repos you need to view -- don't take this workaround to a production environment

## Phase 1: Crawl - Local Setup and Basic Configuration

The goal of this phase is to get Backstage working locally to demonstrate its value and familiarize yourself with its capabilities.

### Step 1: Set Up Development Environment

1. Fresh install of Backstage using the [official Backstage documentation](https://backstage.io/docs/getting-started)
2. Confirm fresh install by running `yarn start` and ensuring Backstage starts successfully

### Step 2: Configure Local Instance & Basic Capability

#### 1. **Configure local development environment**

- update the app-config.yaml file to use $include for environment specific config (this will be important for containerization supporting multiple environments)
> we will use this to dynamically include config for local, dev, qa, ci, and prod environments at build and run time of the container
- create a app-config.local.yaml file with localhost config
- **📁 Relevant Code:**
  - [`app-config.yaml`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml) - Main configuration with environment-specific includes
  - [`app-config.local.yaml`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.local.yaml) - Local development configuration

#### 2. **Setup GitLab integration**

- add the GitLab client ID and client secret to the app-config.local.yaml file for the auth provider
- GitLab provider requires defined users (the catalog.create setting only works for github and google as of 7/28/25)
- **📁 Relevant Code:**
  - [`app-config.local.yaml#L24-L31`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.local.yaml#L24-L31) - GitLab OAuth configuration
  - [`app-config.yaml#L56-L58`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L56-L58) - GitLab integration token setup
  - [`app-config.yaml#L47-L55`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L47-L55) - GitLab plugin configuration
- **💻 Code Implementation:**
  - [`packages/backend/src/index.ts#L59-L62`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/backend/src/index.ts#L59-L62) - GitLab auth provider backend setup
  - [`packages/backend/src/index.ts#L51`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/backend/src/index.ts#L51) - GitLab catalog provider backend setup
  - [`packages/backend/src/index.ts#L64-L68`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/backend/src/index.ts#L64-L68) - GitLab plugin backend integration
  - [`packages/app/src/App.tsx#L67-L73`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L67-L73) - GitLab auth frontend configuration
  - [`packages/app/src/apis.ts#L24-L32`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/apis.ts#L24-L32) - GitLab API integrations
- use email resolver if you plan to later access the email address during templates executions
- add the GitLab token to the app-config.local.yaml file
- add yourself as a defined user company/gitlab-users.yaml (create the company, or name of company directory)
  - add the email address your GitLab account is associated with
- add the company/gitlab-users.yaml location to app-config.local.yaml

#### 3. **Additional Catalog Configuration:**

- [`app-config.local.yaml#L39-L81`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.local.yaml#L39-L81) - Catalog locations for local development
- [`app-config.yaml#L65-L77`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L65-L77) - GitLab catalog provider configuration
- [`app-config.yaml#L79-L84`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L79-L84) - Environment-specific catalog locations include
- **💻 Code Implementation:**
  - [`packages/backend/src/index.ts#L26-L32`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/backend/src/index.ts#L26-L32) - Catalog backend plugin setup
  - [`packages/app/src/App.tsx#L3-L7`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L3-L7) - Catalog frontend imports
  - [`packages/app/src/App.tsx#L83-L87`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L83-L87) - Catalog routing configuration
  - [`packages/app/src/components/catalog/EntityPage.tsx`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/components/catalog/EntityPage.tsx) - Entity page customization with GitLab integration

#### 4. **Add GitLab plugins**

- [backstage-plugin-gitlab](https://github.com/immobiliare/backstage-plugin-gitlab)
  - can we used with GitLab token (default) or OAuth (config change for OAuth)
  - recommended to use OAuth configuration for this plugin
- [backstage-community/plugin-cicd-statistics](https://www.npmjs.com/package/@backstage-community/plugin-cicd-statistics)
  - requires GitLab OAuth

#### 5. **Add TechDocs plugin**

- [backstage/plugin-techdocs](https://backstage.io/docs/features/techdocs/getting-started)
  - chose `builder: 'local'`
  - setup python virtual environment and install mkdocs-techdocs-core and mkdocs-mermaid2-plugin (needed to render docs on local machine)
- **📁 Relevant Code:**
  - [`app-config.yaml#L40-L45`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L40-L45) - TechDocs configuration with local builder
- **💻 Code Implementation:**
  - [`packages/backend/src/index.ts#L17`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/backend/src/index.ts#L17) - TechDocs backend plugin setup
  - [`packages/app/src/App.tsx#L17-L19`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L17-L19) - TechDocs frontend imports
  - [`packages/app/src/App.tsx#L86-L95`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L86-L95) - TechDocs routing configuration
  - [`packages/app/src/components/catalog/EntityPage.tsx#L62-L68`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/components/catalog/EntityPage.tsx#L62-L68) - TechDocs entity page integration

#### 6. **Customize Home Page & Tabs Column for User Journeys**

- Homepage cards (use journeys)
  - onboard new app (links to app starter kits)
  - adopt/migrate existing app (links to templates for MRs)
- Tabs
  - starter kits (link to stater kit tag filtered templates)
  - resusable shared components (link to shared component tag filtered components)
  - onboarding guides (link to onboarding tag filtered docs)
- **💻 Code Implementation:**
  - [`packages/app/src/components/HomePage.tsx`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/components/HomePage.tsx) - Homepage customization with journey cards
  - [`packages/app/src/App.tsx#L82`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L82) - Homepage routing setup
  - [`packages/app/src/App.tsx#L96-L112`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/App.tsx#L96-L112) - Scaffolder page customization with GitLab field extensions
  - [`packages/app/src/scaffolder/fields/index.ts`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/packages/app/src/scaffolder/fields/index.ts) - Custom GitLab credential field extension

## Phase 2: Walk - Live environment(s)

> disclaimer: it is BEST to have a dedicated dns ready for the backstage app to be hosted on. Most Backstage plugins are not built anticipate a prefix path on a shared domain like mycompany.com/backstage-dev.

### Step 1: Configure Container Build

#### 1. **Configure [Dockerfile](https://backstage.io/docs/deployment/docker)**

- add techdoc package installation
- adjust for Node development runtime
  - update to `ENV NODE_ENV=production`
  - update to `yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"`
- **📁 Relevant Code:**
  - [`Dockerfile`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/Dockerfile) - Container configuration for Backstage deployment

#### 2. **Add CI App Config**

- Add a app-config.ci.yaml file (copy from local) -- this will be used for pipeline build of backstage app
- **📁 Relevant Code:**
  - [`app-config.ci.yaml`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.ci.yaml) - CI/CD pipeline configuration

#### 3. **Build Container**

- confirm local container builds & runs successfully with app.config-ci.yaml and local auth

#### 4. **Setup build pipeline**

- follow the [host build directions](https://backstage.io/docs/deployment/docker#host-build) to have an app build job and then a image build job following that using the built app packages (skeleton.tar.gz and bundle.tar.gz)
- **📁 Relevant Code:**
  - [`.gitlab-ci.yml`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/.gitlab-ci.yml) - GitLab CI/CD pipeline configuration

### Step 2: Configure Authentication

#### 1. **Add Auth Config**

- Setup GitLab auth App for live environments, store secrets in namespaces (best if vault is used for storage and access)**
- **📁 Relevant Code:**
  - [`app-config.dev.yaml#L18-L30`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.dev.yaml#L18-L30) - Development environment auth configuration
  - [`app-config.qa.yaml`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.qa.yaml) - QA environment auth configuration

#### 2. **Setup Auth for Other Providers**

- Complete the same for other auth providers (Microsoft, Okta, etc.) to expand access beyond just GitLab users
  - will require an update to users file to include new non-gitlab users OR add new Org provider to create users

### Step 3: Deployment

1. Follow [Kubernetes Deployment](https://backstage.io/docs/deployment/k8s) directions OR reference [argo deployment example used at a previous client](/backstage-argo-cd/)
2. Define secrets for GitLab token and GitLab app registration in the deployment definition so they are available as environment variables.

### Step 4: Implement Real Examples

1. Set up a client relavent Domain & System
2. Setup and test Templates
  - template that creates MR
  - template that create repo
3. Setup Components that demonstrate type
  - library
  - website
  - service

## Phase 3: Run - Production-Ready Configuration

> This phase focuses on making Backstage production-ready with persistent storage, monitoring, and advanced features

### Step 1: Set Up Persistent Storage

#### 1. **Configure persistent volumes for Backstage**:

- Set up persistent volumes for each environment (dev, qa, prod)
- Configure volume claims in deployment manifests
- Implement backup strategy for persistent volumes

#### 2. **Configure PostgreSQL database**:

- Set up a managed PostgreSQL instance or deploy to Kubernetes
- Update app-config files to use external PostgreSQL database
  ```yaml
  backend:
    database:
      client: pg
      connection:
        host: ${POSTGRES_HOST}
        port: ${POSTGRES_PORT}
        user: ${POSTGRES_USER}
        password: ${POSTGRES_PASSWORD}
        database: ${POSTGRES_DATABASE}
  ```
- Set up database backup and recovery procedures
- **📁 Configuration Reference:**
  - [`app-config.yaml#L23-L25`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L23-L25) - Current in-memory database configuration (to be replaced)

#### 3. **Configure object storage for TechDocs**:

- Set up S3-compatible storage for TechDocs
- Update app-config files to use external storage (untested example below)
  - *(this requires that the techdocs for EVERY entity is built and published to the storage by another mechanism that is NOT Backstage)*

      ```yaml
      techdocs:
        builder: 'external'
        publisher:
          type: 'awsS3'
          awsS3:
            bucketName: ${TECHDOCS_S3_BUCKET_NAME}
            credentials:
              accessKeyId: ${TECHDOCS_AWS_ACCESS_KEY_ID}
              secretAccessKey: ${TECHDOCS_AWS_SECRET_ACCESS_KEY}
            region: ${TECHDOCS_AWS_REGION}
      ```

- Configure TechDocs to use external builder
- **📁 Configuration Reference:**
  - [`app-config.yaml#L40-L45`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L40-L45) - Current local TechDocs configuration (to be replaced)

### Step 2: Implement Monitoring and Observability

#### 1. **Set up health checks**:

- Set up monitoring for these endpoints
- Configure alerts for health check failures

#### 2. **Set up usage metrics**:

  - setup [analytics plugin](https://backstage.io/docs/plugins/analytics/)

### Step 3: Enhance Security

#### 1. **Implement proper secret management**:

- Set up Vault integration for secrets
- Move all secrets from Relevant Code to Vault
- Configure Backstage to retrieve secrets from Vault
- Implement secret rotation policies

#### 2. **Configure role-based access control**:

- Set up admin groups for Backstage
  - Set up admin policy for access to write and read to specific Backstage endpoints
- Eliminate guest access completely

### Step 4: Advanced Features

#### 1. **Implement Microsoft Entra Tenant Data integration**:

- Configure the Microsoft Entra provider
  ```yaml
  catalog:
  providers:
    microsoftGraphOrg:
      providers:
        - target: https://graph.microsoft.com/v1.0
          authority: https://login.microsoftonline.com
          tenantId: ${MICROSOFT_TENANT_ID}
          clientId: ${MICROSOFT_CLIENT_ID}
          clientSecret: ${MICROSOFT_CLIENT_SECRET}
  ```
- Set up automatic user and group synchronization
- Replace static user definitions with dynamic user management
- **📁 Configuration Reference:**
  - [`app-config.yaml#L65-L77`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.yaml#L65-L77) - Current GitLab catalog provider (to be supplemented with Microsoft Entra)
  - [`app-config.local.yaml#L44-L57`](https://github.com/liatrio/ootb-backstage-gitlab/blob/main/app-config.local.yaml#L44-L57) - Current static user definitions (to be replaced)

## Conclusion

Following this playbook will help you implement Backstage in a structured and progressive manner. Each phase builds upon the previous one, allowing you to demonstrate value early while working towards a production-ready deployment.

Remember that Backstage is highly customizable, and you should adapt this playbook to your client's specific needs and constraints.

## Contribute Back!

As you walk through this playbook and you find any new gotchas, friction, or missing steps, please contribute back to the Backstage playbook. If you are unsure, please post in the [Backstage foundations channel](https://liatrio.slack.com/archives/C05MA4MMD71) for help, confirmation, or suggestions!

## References

- [Backstage Official Documentation](https://backstage.io/docs)
- [Backstage GitHub Repository](https://github.com/backstage/backstage)
- [CNCF Backstage Project](https://www.cncf.io/projects/backstage/)
