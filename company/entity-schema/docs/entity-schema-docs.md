# Backstage Entity Schema Guide

## What is an Entity?

In Backstage, an **entity** is a piece of metadata that describes something important in your software ecosystem—such as a service, library, documentation, team, or resource. Entities are defined in YAML files (usually named `catalog-info.yaml`) and are used to populate the Backstage software catalog, making it easier to discover, manage, and document your infrastructure.

For more details, see the official Backstage documentation: [Backstage Entities](https://backstage.io/docs/features/software-catalog/descriptor-format/).

---

## 1. Entity Naming Standard

- **Use lowercase, hyphen-separated names** for entities (e.g., `my-service`, `data-pipeline`).
- Names should be descriptive and concise.
- Avoid special characters and spaces.
- Prefix names with the domain or group if relevant (e.g., `flowkit-<name>`, `pipeline-components-<name>`).

## 2. Tagging Standard

Tags help organize and discover entities. Example tags:

- **flowkit**: For starter GitLab projects that provide working code. Also used for handbooks related to onboarding or usage of flowkit projects.
- **pipeline-components**: For GitLab pipeline components intended for broad use and to set engineering defaults.
- **handbook**: For guides with clear how-to or onboarding steps for offerings.
- **ek8s**: For Kubernetes resources repositories supported by the ek8s team.
- **java**: For Java repositories.
- **maven**: For Maven repositories.
- **python**: For Python repositories.

### Tagging Guidelines

- Tags should be lowercase.
- Tags should use hyphens instead of underscores (e.g., `python` instead of `python_`).
- Use multiple tags if an entity fits more than one category.
- Add additional tags as needed for searchability, but keep them relevant and concise.
- Avoid tags that are too generic (e.g., `service`, `library`, `website`).

#### Example Tag Usage

```yaml
metadata:
  tags:
    - flowkit
    - handbook
```

---

## 3. Authoring a `catalog-info.yaml`

Every Backstage entity is described by a YAML file. Here’s a general template and best practices:

### Minimal Example

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  description: A short description of the service.
  tags:
    - flowkit
spec:
  type: service
  owner: team-name
  lifecycle: production
```

### Field Guidelines

- **apiVersion**: Use the latest supported version (usually `backstage.io/v1alpha1`).
- **kind**: The type of entity (e.g., `Component`, `Resource`, `System`).
- **metadata.name**: Follows the naming standard above.
- **metadata.description**: Briefly describe the entity’s purpose.
- **metadata.tags**: See tagging standard above.
- **spec.type**: What kind of component (e.g., `service`, `library`, `website`).
- **spec.owner**: The responsible team or group.
- **spec.lifecycle**: One of `experimental`, `production`, `deprecated`, etc.

### Annotations

Annotations are key-value pairs that provide additional metadata about an entity. They can be used for a variety of purposes that are supported by Backstage or by plugins. ([Backstage docs annotation definition](https://backstage.io/docs/features/software-catalog/descriptor-format#annotations-optional))

[Common annotations](https://backstage.io/docs/features/software-catalog/well-known-annotations/)

---

## 4. Example: Handbook Entity (with TechDocs)

For documentation entities that should be rendered by TechDocs, add the following annotation:

```yaml
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
```

This tells Backstage TechDocs to use the documentation found in the root of the repository. Adjust the path if your docs are in a subfolder (e.g., `dir:docs`).

### Full Example

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: onboarding-handbook
  description: Guide for onboarding to the <company> engineering platform.
  tags:
    - handbook
  annotations:
    backstage.io/techdocs-ref: dir:.
spec:
  type: documentation
  owner: developer-experience
  lifecycle: production
```

---

## 5. Additional Best Practices

- Keep YAML files in source control and up to date.
- Use clear, descriptive `description` fields.
- Review tags regularly to ensure consistency.
- Reference this guide when creating new entities.

---

For questions or updates to this guide, contact the Elevate DevEx team.
