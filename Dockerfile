FROM node:20-bookworm-slim

# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3

# Install dependencies including nginx
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3=3.11.2-1+b1 \
    g++=4:12.2.0-3 \
    build-essential=12.9 \
    libsqlite3-dev=3.40.1-2+deb12u1 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Create a Python virtual environment for TechDocs and install mkdocs-techdocs-core
RUN python3 -m venv /opt/techdocs-venv \
    && /opt/techdocs-venv/bin/pip install --no-cache-dir mkdocs-techdocs-core==1.* \
    && /opt/techdocs-venv/bin/pip install --no-cache-dir mkdocs-mermaid2-plugin
ENV PATH="/opt/techdocs-venv/bin:$PATH"


# From here on we use the least-privileged `node` user to run the backend.
USER node

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# Copy files needed by Yarn
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./
COPY --chown=node:node backstage.json ./

# NODE_ENV can be set at runtime
# Set to development for local development with guest access
ENV NODE_ENV=development

# This disables node snapshot for Node 20 to work with the Scaffolder
ENV NODE_OPTIONS="--no-node-snapshot"

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN pip3 install --no-cache-dir mkdocs-techdocs-core==1.*
RUN yarn workspaces focus --all --production && yarn cache clean

# This will include the examples, if you don't need these simply remove this line
COPY --chown=node:node examples ./examples
# This will include company static entities
COPY --chown=node:node company ./company

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz


CMD node packages/backend --config app-config.yaml