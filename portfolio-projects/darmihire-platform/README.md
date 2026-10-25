# DarmiHire

### Modern hiring, powered by AI.

DarmiHire is a modern AI-powered recruitment and applicant tracking platform designed to help hiring teams manage jobs, candidates, interviews, evaluations, offers, and the complete hiring lifecycle from one workspace.

The platform combines structured recruitment workflows, team collaboration, public careers pages, candidate management, and AI-assisted hiring capabilities in a multi-tenant architecture built for modern organizations.

## Modern infrastructure for smarter hiring

DarmiHire brings the core parts of recruitment into a single platform—from publishing a job and receiving applications to evaluating candidates, scheduling interviews, managing offers, and completing a hire.

The platform is designed around structured hiring workflows rather than disconnected recruitment tools. Organizations operate inside isolated tenant workspaces with role-based access, while candidates interact through branded public careers pages without requiring a DarmiHire account.

DarmiHire is being developed with a production-oriented architecture that supports future AI capabilities, automation, integrations, analytics, and scalable cloud deployment.

## The DarmiHire stack

| Component | Purpose |
| --- | --- |
| **Frontend** | React and TypeScript application providing the recruiter workspace, hiring workflows, public careers portal, candidate applications, and administrative interfaces. |
| **Backend** | Java and Spring Boot REST API implementing authentication, authorization, tenant isolation, recruitment workflows, business rules, and platform services. |
| **Database** | PostgreSQL relational database storing tenants, users, jobs, candidates, applications, interviews, evaluations, offers, and related recruitment data. |
| **Migrations** | Flyway-managed database migrations providing versioned and reproducible schema evolution. |
| **Security** | JWT authentication, tenant-aware authorization, role and permission controls, BCrypt password hashing, and protected recruiter resources. |
| **Careers Portal** | Public tenant-specific careers pages for published jobs, job details, candidate applications, resume uploads, branding, and application confirmation. |
| **File Storage** | Abstracted resume storage with private recruiter access and local development storage that can be replaced by cloud object storage. |
| **Formatting & Quality** | Prettier and ESLint for the frontend, Spotless and Google Java Format for the backend, with TypeScript and Maven validation. |
| **Containers** | Docker-ready application architecture for reproducible local and production deployments. |

Together, these components provide an end-to-end path from creating a job to hiring a candidate.

## Core recruitment workflow

DarmiHire currently supports the primary hiring lifecycle:

```text
Create Job
    ↓
Publish Job
    ↓
Public Careers Portal
    ↓
Candidate Application
    ↓
Resume Upload
    ↓
Candidate Pipeline
    ↓
Screening
    ↓
Interview
    ↓
Scorecard & Evaluation
    ↓
Offer
    ↓
Hire
```

## Platform capabilities

### Jobs

Create and manage job openings with departments, teams, locations, recruiters, hiring managers, employment types, workplace types, openings, and structured job statuses.

Jobs can be independently published or unpublished from the public careers portal.

### Candidates

Maintain tenant-isolated candidate profiles containing contact information, professional links, source information, resumes, and related applications.

Candidate email deduplication prevents duplicate candidate records inside the same organization.

### Application pipeline

Applications move through a structured recruitment pipeline:

```text
APPLIED
   ↓
SCREENING
   ↓
INTERVIEW
   ↓
OFFER
   ↓
HIRED
```

Applications can also be rejected or withdrawn while maintaining their recruitment history.

### Interviews

Hiring teams can create and manage candidate interviews, interview types, scheduling information, interviewers, and interview status.

### Scorecards and evaluations

Structured candidate evaluations allow hiring teams to record interview feedback and hiring recommendations using a consistent assessment process.

Hiring recommendations include:

```text
STRONG_NO
NO
NEUTRAL
YES
STRONG_YES
```

### Offers and hiring

Recruiters can create and manage candidate offers through a controlled offer lifecycle:

```text
DRAFT
   ↓
PENDING_APPROVAL
   ↓
APPROVED
   ↓
SENT
   ↓
ACCEPTED
```

Offers may also be rejected, declined, or withdrawn.

Accepting an offer completes the hiring workflow and marks the corresponding application as hired.

### Public careers portal

Each organization can expose its own public careers experience:

```text
/careers/{companySlug}
```

Published positions are available at:

```text
/careers/{companySlug}/jobs/{jobSlug}
```

Candidates can review job information and submit applications without creating a DarmiHire account.

The public application workflow supports:

- Candidate contact information
- LinkedIn profiles
- Portfolio links
- Resume uploads
- PDF, DOC, and DOCX resumes
- Application deadlines
- Candidate deduplication
- Duplicate application prevention
- Application confirmation
- Application reference IDs
- Tenant-specific careers branding
- Public endpoint protection and anti-spam controls

Uploaded resumes remain private and are accessed by authorized recruiters through authenticated DarmiHire endpoints.

## Multi-tenant architecture

DarmiHire is designed as a multi-tenant platform.

Business data belongs to an organization through a tenant identifier:

```text
Tenant
 ├── Users
 ├── Departments
 ├── Teams
 ├── Locations
 ├── Jobs
 ├── Candidates
 ├── Applications
 ├── Interviews
 ├── Evaluations
 └── Offers
```

Tenant context is resolved by the backend and enforced throughout protected recruitment workflows.

Public careers endpoints resolve the organization from its public company slug rather than trusting client-supplied tenant identifiers.

## Repository structure

```text
darmihire/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/darmisolutions/darmihire/
│   │   │   └── resources/
│   │   │       └── db/migration/
│   │   └── test/
│   ├── uploads/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .editorconfig
└── README.md
```

## Requirements

For local development:

- Java 21
- Node.js
- npm
- PostgreSQL 17
- Docker, if using containerized infrastructure

## Frontend development

Move into the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Format the frontend:

```bash
npm run format
```

Check formatting without modifying files:

```bash
npm run format:check
```

## Backend development

Move into the backend:

```bash
cd backend
```

Start the Spring Boot application:

```bash
./mvnw spring-boot:run
```

Run tests and validation:

```bash
./mvnw clean verify
```

Format Java source code:

```bash
./mvnw spotless:apply
```

Check backend formatting:

```bash
./mvnw spotless:check
```

## Code quality

DarmiHire uses automated formatting and validation to keep the codebase consistent.

### Frontend

```text
Prettier
ESLint
TypeScript
Vite
```

Recommended validation:

```bash
npm run format:check
npm run lint
npm run build
```

### Backend

```text
Spotless
Google Java Format
Maven
Spring Boot tests
```

Recommended validation:

```bash
./mvnw spotless:check
./mvnw clean verify
```

Formatting-only changes should preferably be committed separately from functional changes.

## Public API structure

Authenticated platform APIs use:

```text
/api/v1/**
```

Public careers APIs use:

```text
/api/public/careers/**
```

Examples:

```text
GET  /api/public/careers/{companySlug}
GET  /api/public/careers/{companySlug}/jobs
GET  /api/public/careers/{companySlug}/jobs/{jobSlug}
POST /api/public/careers/{companySlug}/jobs/{jobSlug}/applications
```

Public endpoints do not require candidate authentication.

Recruiter and administrative endpoints remain authenticated and tenant-scoped.

## Security

DarmiHire follows a tenant-aware security model built around:

- JWT authentication
- Role and permission-based authorization
- Tenant isolation
- BCrypt password hashing
- Protected recruiter APIs
- Private resume access
- File type and upload-size validation
- Candidate and application deduplication
- Public application rate limiting
- Anti-spam protection
- Controlled public endpoint exposure

Secrets, production credentials, uploaded resumes, and environment-specific configuration must not be committed to the repository.

## Development status

The core recruitment lifecycle is under active development.

Implemented platform areas include:

| Area | Status |
| --- | --- |
| Authentication & tenant architecture | Implemented |
| Organization structure | Implemented |
| Jobs | Implemented |
| Candidates & application pipeline | Implemented |
| Interviews | Implemented |
| Scorecards & evaluations | Implemented |
| Offers & hiring | Implemented |
| Public careers portal | Implemented |
| Public applications | Implemented |
| Resume management | Implemented |
| Candidate deduplication | Implemented |
| Careers branding | Implemented |
| Public application security | Implemented |
| Email & notifications | Planned |
| AI hiring capabilities | Planned / In development |
| Analytics & reporting | Planned |

The platform is evolving toward a production-ready AI-assisted recruitment system.

## Product direction

DarmiHire is designed to extend beyond traditional applicant tracking.

Future development is intended to introduce intelligent capabilities around candidate understanding, recruiter assistance, workflow automation, communication, analytics, and hiring decision support while keeping hiring teams in control of recruitment decisions.

## Darmi Solutions

DarmiHire is developed by **Darmi Solutions** as part of its software and AI product portfolio.

The platform is focused on building a simpler, more structured, and more intelligent hiring experience for organizations and recruitment teams.

## Contributing

DarmiHire is currently under active development.

Contributions should follow the existing application architecture, tenant-isolation rules, security model, database migration strategy, and code-formatting requirements.

Before submitting changes, validate both applications:

```bash
# Frontend
cd frontend
npm run format:check
npm run lint
npm run build

# Backend
cd backend
./mvnw spotless:check
./mvnw clean verify
```

Keep pull requests focused and include clear descriptions and validation notes for functional changes.

## License

Copyright © Darmi Solutions.

Unless a separate license is provided with the repository, the DarmiHire source code should not be assumed to be open source or available for unrestricted use, modification, or redistribution.

---

**Modern hiring, powered by AI.**