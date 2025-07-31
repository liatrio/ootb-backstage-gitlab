# <compnay> backstage portal

## Overview

This is <compnay>'s implementation of [Backstage](https://backstage.io), an open platform for building developer portals.

[Official Backstage Architecture Overview](https://backstage.io/docs/overview/architecture-overview)

[<compnay> Backstage Architecture](https://gitlab.com/<compnay>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/design-doc/-/blob/main/docs/diagrams.md)

[Strategies for Adoption](https://backstage.io/docs/overview/adopting)

## Local Development

### Required Software (install locally)

> **Important**: Using the exact versions specified below is crucial for Backstage to work properly.

- Node.js 20 (required)
  - Recommended: Install via [nvm](https://github.com/nvm-sh/nvm)
  - Run: `nvm install lts/iron`
  - Verify version: `node --version` should show `v20.x.x`
- Yarn 4.4.1 (required)
  - Run: `corepack enable && yarn set version 4.4.1`
  - Verify version: `yarn --version` should show `4.4.1`
- Git
- Podman

## Local Development Setup

You can run on your machine or in a container.

> from root of repo <compnay>-backstage

### environment variables

> to start, you must set the following environment variables, but will later define more:

```.env
BACKSTAGE_ENVIRONMENT=local
NODE_OPTIONS=--no-node-snapshot
```

### Machine

1. Install dependencies:

```bash
yarn install --immutable
yarn tsc
```

1. Build the application:

```bash
yarn build:backend
```

1. Start the application:

```bash
yarn start
```

The app will be available at `http://localhost:3000`. This will be a locally ran Backstage without ANY auth (no read access to GitLab, no GitLab auth) or techdocs rendering.

#### Local TechDocs Rendering

To ensure TechDocs documentation renders correctly when triggered in the Backstage UI, you must set up Python and the required mkdocs dependencies in a virtual environment—just like our Docker image does.

**1. Install Python 3**

Make sure you have Python 3.11+ installed (matching the version in the Dockerfile).

**2. Create a Python Virtual Environment**

From the root of your repo (or wherever you want):

```bash
python3 -m venv .techdocs-venv
source .techdocs-venv/bin/activate
```

**3. Install TechDocs Python Packages**

Install the same mkdocs dependencies as the Dockerfile:

```bash
pip install --no-cache-dir mkdocs-techdocs-core mkdocs-mermaid2-plugin
```

**4. Start Backstage as Usual**

Start your Backstage app with:

```bash
yarn start
```

When you visit an entity’s TechDocs tab in the UI, Backstage will use your local Python environment and mkdocs installation to build and render the documentation on demand.

**Notes:**
- Always activate your `.techdocs-venv` before starting Backstage if you want to use your local Python/mkdocs for TechDocs builds.
- This setup matches the Python environment used in our Docker image, ensuring consistency between local and containerized TechDocs builds.
- You do **not** need the TechDocs CLI for normal UI-driven doc rendering.

### Container Build and Run

```bash
# Set up podman machine (macOS only)
podman machine init
podman machine start
podman machine list
```

```bash
export TMP_TKN=<your-gitlab-token>
podman build -f Dockerfile -t localhost/<compnay>-backstage:latest --env BACKSTAGE_ENVIRONMENT=ci .
podman run -d -p 7008:7008 --name backstage-app --env BACKSTAGE_ENVIRONMENT=ci --env BACKSTAGE_GITLAB_TOKEN=$TMP_TKN localhost/<compnay>-backstage:latest
```

### GitLab Authentication Setup Local Development

1. **Create a GitLab Personal Access Token** with at least "read_api" scope. See: [GitLab Personal Access Tokens Docs](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
2. **Set up the tokens and secrets for local development**:
   - Add the required environment variables, e.g.:

     ```bash
     export BACKSTAGE_GITLAB_TOKEN=your-gitlab-token-here
     export GITLAB_CLIENT_SECRET=your-gitlab-client-secret-here
     export GITLAB_CLIENT_ID=your-gitlab-client-id-here
     ```

   - Or add them to your `.env` file in the project root:

     ```env
     BACKSTAGE_GITLAB_TOKEN=your-gitlab-token-here
     GITLAB_CLIENT_SECRET=your-gitlab-client-secret-here
     GITLAB_CLIENT_ID=your-gitlab-client-id-here
     ```

3. Ensure your `app-config.local.yaml` or `app-config.yaml` includes the following:

   ```yaml
   integrations:
     gitlab:
       - host: gitlab.com
         token: ${BACKSTAGE_GITLAB_TOKEN}
   ```

For more details, see [Backstage GitLab Integration Docs](https://backstage.io/docs/integrations/gitlab/).

### How container is built

- The Backstage app is built from source code locally on the host machine.
- The Dockerfile copies the built app and backend files into the container.
- The Dockerfile points to the configuation file `app-config.yaml`.
- The container image is tagged as `localhost/<compnay>-backstage:latest`.
- The container is run with the following command: `podman run -d -p 7008:7007 --name backstage-app localhost/<compnay>-backstage:latest`.
- The container is accessible at `http://localhost:7008`.

## Understanding Backstage Repo

### Project Structure

The Backstage app will have the following structure:

```text
<compnay>-backstage
├── app-config.yaml     # Main configuration file
├── app-config.local.yaml # Local development configuration file
├── app-config.dev.yaml # Development environment configuration file
├── app-config.qa.yaml # QA environment configuration file
├── app-config.ci.yaml # CI environment configuration file (for pipeline build)
├── catalog-info.yaml   # Catalog entities descriptors
├── package.json        # Root package.json (don't add dependencies here)
└── packages/
    ├── app/           # Frontend application
    └── backend/       # Backend services
```

#### app-config.*.yaml

##### How configs are loaded by yarn

- The main app-config.yaml uses the $include keyword and ${BACKSTAGE_ENVIRONMENT} variable to dynamically include the correct environment-specific config file (e.g., app-config.dev.yaml, app-config.qa.yaml, etc.).
- When you run yarn start or build with yarn build:backend, the Backstage CLI reads app-config.yaml, resolves $include statements, and loads the appropriate config based on the value of BACKSTAGE_ENVIRONMENT.

##### Use of BACKSTAGE_ENVIRONMENT

- The BACKSTAGE_ENVIRONMENT environment variable determines which config file is loaded.
- Example: If BACKSTAGE_ENVIRONMENT=dev, then app-config.yaml will include app-config.dev.yaml.
- This enables seamless switching between environments (local, dev, qa, ci, prod) without changing code.

##### Why config files must live with the code

- These config files are tightly coupled to the codebase: they define plugin settings, integrations, and secrets that are required for the app to function.
- They must be version-controlled alongside the code to ensure consistency, reproducibility, and traceability across environments and deployments.
- Keeping configs with the code ensures that builds are portable and can be reliably reproduced in CI/CD pipelines and local development.

##### How the Dockerfile includes and uses the correct config

- The Dockerfile copies all app-config*.yaml files into the container.
- At runtime, the container is started with the appropriate BACKSTAGE_ENVIRONMENT variable (passed via --env).
- The Backstage process (node packages/backend --config app-config.yaml) loads the main config, which dynamically includes the correct environment config based on BACKSTAGE_ENVIRONMENT.
- This approach allows a single container image to support multiple

## Troubleshooting

### Node.js Version Conflicts

Issue: Build errors due to incompatible Node.js version

Solution: Use Node.js 20 or later. You can use nvm to manage Node.js versions:

```bash
nvm install 20
nvm use 20
```

### 2. Yarn Dependencies

Issue: Dependency resolution errors

Solution: Clear yarn cache and reinstall:

```bash
yarn cache clean
rm -rf node_modules
yarn install
```

## Available Scripts

- `yarn start` - Start the frontend and backend in development mode
- `yarn build` - Build the project
- `yarn lint` - Run linting
- `yarn test` - Run tests
- `yarn clean` - Clean up dependencies

## Contributing

1. Create a new branch from `main`
2. Make your changes
3. Submit a merge request

## Additional Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub](https://github.com/backstage/backstage)
- [Backstage Discord](https://discord.gg/backstage-687207715902193673)

## Backstage Configuration

### Current State

> statements listed here are not end state goals of the app but should reflect the current iteration of the app

- Backend is currently running with authentication as optional (`dangerouslyDisableDefaultAuthPolicy: true`), allowing all requests without user or service authentication.
  - This no-auth backend should be removed once real authentication providers (Microsoft SSO & GitLab SSO) are enabled and tested.
- Allowing guest sign-in
  - this should be disabled in production after auth for SSO is setup
- Localized sql database in use
  - this should be changed to use an approved external database

### Future Plans - Next Steps for Backstage

> ordered by priority

#### Authentication and User Catalog Management

- **Auth provider summary:**
  - ⏭️ `todo:` Microsoft authentication (default login)
    - Current there are servicenow tickets (and associated jira tickets) for dev and qa Azure App registraiont for SSO with the new domain
      - `what's left to do:` The azure team who is assigned to the tickt will give us the Client ID and Client secrets for each environment
        - we need to update the app-config.*.yaml files with the new Client ID and Client secrets for a [microsoft provider configuration](https://backstage.io/docs/auth/microsoft/provider/)
        - we then need to update the App.tsx file to add the new provider to the auth providers list
  - GitLab authentication (for accessing GitLab project information and pipeline views via the GitLab plugin)

- **Short-term workaround:**
  - We will maintain a hard-coded catalog of all current users, matching their emails to catalog `User` entities. This allows GitLab authentication and scaffolder actions to work, but requires manual updates as users change.
    - This catalog of users is currently the Azure Access GitLab Group.
    - This catalog can be automatically generated using this [backstage-users](https://gitlab.com/<compnay>/ccis/tech-infrastructure-can/sdp/elevate-devx/backstage/backstage-users) project.
    - ⏭️ `todo:` if Microsoft SSO is enabled, we need to make a new list of users that includes other non-gitlab technology employees since the current one is only Gitlab users. (or just switch to planned solution - org provider)
  - This is necessary because neither the Azure (Microsoft) nor GitLab auth providers support the `create` sign-in resolver, which would allow automatic user creation on first login.
  - Attempted workarounds using custom resolvers are not compatible with the new modular backend system, as only built-in resolvers (such as `catalog` or `email`) are supported for these providers.

- **Planned solution:**
  - ⏭️ `todo:` Integrate the [Microsoft Entra Tenant Data](https://backstage.io/docs/integrations/azure/org) to automatically sync all Azure AD users and groups into the Backstage catalog.
  - This will eliminate the need for manual user catalog maintenance, ensure all users can sign in with Microsoft SSO, and allow seamless mapping between Microsoft and GitLab identities (as long as emails match).
  - Once the org provider is in place, we will remove the hard-coded user catalog and rely on automated user management.

### Database

- ⏭️ `todo:` [Setup PostgreSQL database](https://backstage.io/docs/getting-started/config/database) for dev and qa
  - requires persistant storage for the dev and qa deployments
  - Backstage docs for deploying a database](https://backstage.io/docs/deployment/k8s#creating-the-postgresql-database)

### Health Monitoring

- ⏭️ `todo:` Setup health monitoring/alerting for dev and qa
  - [configure health endpoints](https://backstage.io/docs/plugins/observability#health-checks)
  - configure alerting is someway to know when health of environments has been impacted based on health endpoint
  