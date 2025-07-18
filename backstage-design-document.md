# Backstage Implementation Design Document

## Executive Summary

This document outlines the design and architecture for implementing Backstage as our Internal Developer Portal (IDP). It covers the logical design of how components will interact, the technical architecture for implementation, and key use cases that demonstrate the value for our developers.

## Design Overview

Backstage will provide:

- Fragmented system visibility and documentation
- Inconsistent onboarding and development processes
- Difficulty in discovering and reusing existing components
- Documentation scattered across various platforms

Backstage addresses these challenges by providing a unified developer portal that consolidates tools, services, and documentation in one place.

## Technical Architecture

The implementation will use the following components:

### Infrastructure

- **Kubernetes**: Deployment in existing cluster
- **PostgreSQL**: RDS database for persistent storage
- **Microsoft Authentication**: User access and SSO
- **GitLab**: Source control and CI/CD integration

### Core Components

- **Software Catalog**: Service and component discovery
- **TechDocs**: Documentation management
- **Templates**: FlowKit and scaffolding
- **Search**: Cross-platform resource discovery

## Use Cases

The IDP will enable the following use-cases.

### 1. Documentation Management

- Push Markdown documentation directly from repositories
- Automated documentation rendering and versioning
- Centralized access to all project documentation
- Integration with existing documentation workflows

### 2. Project Creation and Templates

- Use FlowKit templates through a form-based interface
- Automated project setup in GitLab
- Standardized repository structure and configurations
- Template-driven scaffolding for new services

### 3. Service Discovery

- Visual representation of services within products and domains
- Team ownership and relationships
- Product hierarchies and dependencies
- Clear visibility of the entire technology ecosystem

### 4. Developer Tools Integration

Streamline developer workflows through integrated tooling:

- Single sign-on with Microsoft authentication
- GitLab integration for source code and CI/CD
- Automated scaffolding and template application
- Unified search across all developer resources
- Integrated documentation and API specifications

## Scope

### Scope of Access

- Respects all existing GitLab access limitations. Users will not see or have write access to any resources they do not already have access to; OAuth is used to borrow GitLab permissions.
- Makes metadata about a given repository available to users, such as the repository name, description, and tags as provided by and controlled by the GitLab authors through the catalog-info.yaml files in the repository.

### Scope of Functionality

- Backstage is an enhancement to GitLab and Confluence, not a replacement. It provides a unified interface that ties together repositories, documentation, and onboarding or team offering flows.
- Backstage does not store code or documentation. Instead, it catalogs code repositories and renders documentation stored as code in GitLab.
- The platform enables discoverability and visibility of projects, services, and documentation, streamlining onboarding and access to team offerings.
- Backstage’s templating and scaffolding features do not replace CI/CD pipelines. Instead, they automate the required human actions for updating repositories, such as generating configuration files or onboarding resources, while actual code changes and pipeline executions remain managed by GitLab.
- Backstage is intended to centralize and standardize the inventory and discoverability of existing tools, enabling teams to find, offer, and contribute to shared resources."

## Rollout Phases

The rollout of Backstage will proceed in the following phases:

**Phase 1: Centralization and Standardization**

- Transition from GitLab project template FlowKit to Backstage template FlowKits.
- Register other platform team offerings like ek8s repositories and render onboarding documentation within Backstage.
- Encourage teams to contribute templates that automate pipeline configuration, project contents, and merge requests.
- Use Backstage as the single source of truth for best practices and team offerings.

**Phase 2: Repository Cataloging**

- Guide teams to add catalog-info.yaml files so their applications and repositories are properly cataloged in Backstage.
- Enable teams to manage and maintain their own catalog entries.

**Phase 3: TBD**

## Appendix

### Glossary

- **IDP**: Internal Developer Portal
- **System Modeling**: Visual representation of system architecture
- **Cataloging**: Process of registering and tagging components
- **TechDocs**: Backstage's documentation system based on MkDocs
- **Templating**: Creation of standardized component scaffolding

### References

1. [Backstage Official Documentation](https://backstage.io/docs)
2. [Spotify Engineering Blog - Backstage Journey](https://engineering.atspotify.com/2020/03/17/what-the-heck-is-backstage-anyway/)
3. [CNCF Backstage Project](https://www.cncf.io/projects/backstage/)
