# [Backstage](https://backstage.io)

Out of the Box Backstage configured for GitLab

Add credentials and go!


## What you get

- A Homepage
- Backstage App configured for GitLab integreation and authentication
- [immobliare/backstage-plugin-gitlab](https://github.com/immobiliare/backstage-plugin-gitlab) to display GitLab stats & information for registered repositories

## Purpose

To get you started with the least amount of effort.

## Setup GitLab

To registry repositories from a GitLab instance,
you will need to create an access token with read api access.

https://backstage.io/docs/integrations/gitlab/locations

- currently the following configuration is set
- `GITLAB_TOKEN` just needs to be set in .env
  - read api
  - read repository
  - read user

for app-config.yaml config:

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

### GitHub OAuth

Instead of signing in as guest, you can sign in using GitLab.

This is optional, but currently configured.

[Create GitLab App and supply OAuth creds and add to .env](https://backstage.io/docs/auth/gitlab/provider)

- `AUTH_GITLAB_CLIENT_ID`
- `AUTH_GITLAB_CLIENT_SECRET`

for variables in app-config.yaml config:

```yaml
auth:
  environment: development
  providers:
    gitlab:
      development:
        clientId: ${AUTH_GITLAB_CLIENT_ID}
        clientSecret: ${AUTH_GITLAB_CLIENT_SECRET}
```

### Add user

Add yourself as a user in `examples/org.yaml`

```taml
---
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: <your-gitlab-user-name
spec:
  memberOf: [guests]
```

## Run the App

1. Install dependencies:

   ```sh
   yarn install
   ```

1. Start the application:

   ```sh
   yarn dev
   ```

> **Note**: The application runs on `http://localhost:3000` by default.

## Customize

There is a homepage configured at `packages/app/src/components/home/HomePage.tsx`

Here you can use html to alter the home page.

## Troubleshooting

Common issues and solutions:

- If `yarn install` fails, try clearing your yarn cache: `yarn cache clean`
- If the app doesn't start, check if all required environment variables are set in `.env`
- For plugin-related issues, ensure all plugin dependencies are correctly installed

### Enable dotenv (should be configured by default)

1. Modify the following scripts in the `package.json` file:

   ```json
   "scripts": {
     "dev": "concurrently \"yarn start\" \"yarn start-backend\"",
     "start": "dotenv -e .env yarn workspace app start",
     "start-backend": "dotenv -e .env yarn workspace backend start",
   ```

1. add dependencies:

   ```bash
   yarn add concurrently
   yarn add dotenv
   yarn add dotenv-cli
   ```
