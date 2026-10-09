# DarmiHire

> **Modern hiring, powered by AI.**

DarmiHire is a modern, multi-tenant Applicant Tracking System (ATS) and
recruitment platform by **Darmi Solutions**. It is being built as a
production-oriented recruitment system covering company structure,
hiring teams, jobs, candidates, applications, recruiter workflows, and
later AI-powered hiring capabilities.

This README documents the project through **Step 17.4 --- Drag-and-Drop
Kanban Application Pipeline**.

------------------------------------------------------------------------

## Current Status

### Completed

-   Authentication and JWT session handling
-   Multi-tenant workspace architecture
-   Users and workspace members
-   Roles and permissions
-   Departments
-   Teams and team members
-   Locations
-   Invitations
-   Jobs / job requisitions
-   Job lifecycle management
-   Candidate database and candidate profiles
-   Job applications
-   Candidate → Job workflow
-   Job → Candidate workflow
-   Application stage management
-   Rejection, withdrawal, and hiring state
-   Application activity and stage history
-   Recruiter-facing activity timeline
-   Drag-and-drop Kanban hiring pipeline

**Current milestone:** Step 17.4 --- Complete\
**Next milestone:** Step 18 --- Interviews & Scheduling

------------------------------------------------------------------------

# Product Vision

The long-term DarmiHire workflow is:

``` text
Company / Workspace
        │
        ├── Members
        ├── Roles
        ├── Departments
        ├── Teams
        └── Locations
                │
                ▼
               Jobs
                │
                ▼
            Candidates
                │
                ▼
         Job Applications
                │
                ▼
       Recruitment Pipeline
                │
                ├── Applied
                ├── Screening
                ├── Interview
                ├── Offer
                └── Hired
                │
                ▼
       Interviews / Evaluation
                │
                ▼
          Hiring Decision
```

Future phases will extend this foundation with interview scheduling,
scorecards, resume processing, semantic matching, AI recommendations,
analytics, and recruiting automation.

------------------------------------------------------------------------

# Technology Stack

## Backend

-   Java 21
-   Spring Boot 4.1.1
-   Spring Web
-   Spring Security
-   Spring Data JPA
-   Jakarta Validation
-   PostgreSQL 17
-   Flyway
-   JWT authentication
-   BCrypt password hashing (strength 12)
-   Maven

## Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Sonner
-   Lucide React
-   `@dnd-kit/core`

## Infrastructure Direction

-   Docker
-   Kubernetes
-   CI/CD
-   Cloud deployment
-   Object storage for resumes
-   AI/LLM services
-   Event-driven processing where appropriate

------------------------------------------------------------------------

# Architecture

DarmiHire currently follows a **modular monolith** architecture. This
provides clear business boundaries without adding unnecessary
distributed-system complexity during the early product phases.

Example backend modules:

``` text
backend
├── auth
├── tenant
├── user
├── role
├── department
├── team
├── location
├── invitation
├── job
├── candidate
├── application
└── audit
```

The application uses a shared PostgreSQL schema with tenant-owned
records separated by `tenant_id`.

``` text
HTTP Request
     │
     ▼
Spring Controller
     │
     ▼
Authorization / Tenant Context
     │
     ▼
Service Layer
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

Frontend flow:

``` text
React Page
    │
    ▼
Feature API
    │
    ▼
apiRequest(...)
    │
    ▼
Spring Boot API
```

------------------------------------------------------------------------

# Authentication and Multi-Tenancy

DarmiHire uses JWT-based authentication.

Current token model: - Access token: approximately 15 minutes - Refresh
token: approximately 30 days - Password hashing: BCrypt strength 12

Frontend session keys:

``` text
darmihire_access_token
darmihire_refresh_token
darmihire_tenant_id
```

A tenant represents a company/workspace. Most business entities belong
to exactly one tenant.

``` text
Tenant
 ├── Users
 ├── Departments
 ├── Teams
 ├── Locations
 ├── Jobs
 ├── Candidates
 └── Applications
```

Tenant-scoped frontend requests send:

``` http
X-Tenant-ID: <tenant-id>
```

Backend services resolve tenant ownership through the tenant context:

``` java
private UUID requireTenantId() {
    UUID tenantId = tenantContext.getTenantId();

    if (tenantId == null) {
        throw new IllegalStateException("Tenant context is required");
    }

    return tenantId;
}
```

Tenant boundaries are enforced through the service and repository
layers.

------------------------------------------------------------------------

# Organization Management

The organizational foundation is implemented.

## Workspace Members

Workspace members represent users associated with a tenant. Membership
management and role-based authorization are supported.

## Roles

Roles determine what users can manage inside a workspace. Current usage
includes company administrators and recruiters, with room for additional
roles.

## Departments

Departments organize jobs and teams by business area, such as
Engineering, Product, Sales, Marketing, Finance, and People.

## Teams

Teams can be associated with jobs. Team membership management is
implemented.

## Locations

Locations support geographical and workplace organization of jobs.

## Invitations

Workspace invitations allow users to be invited into a tenant.

------------------------------------------------------------------------

# Jobs

Job requisition management is implemented.

## Job Fields

``` text
id
tenant
title
jobCode
description
department
team
location
recruiter
hiringManager
employmentType
workplaceType
status
openings
createdAt
updatedAt
```

## Job Status

``` text
DRAFT
OPEN
PAUSED
CLOSED
```

## Employment Type

``` text
FULL_TIME
PART_TIME
CONTRACT
TEMPORARY
INTERNSHIP
```

## Workplace Type

``` text
ON_SITE
HYBRID
REMOTE
```

`jobCode` is unique within a tenant:

``` text
UNIQUE (tenant_id, job_code)
```

------------------------------------------------------------------------

# Candidates

Candidate management is a separate domain from job applications.

A **Candidate** represents a person in the talent database. A
**JobApplication** represents that candidate's relationship with a
particular job.

``` text
Candidate
   │
   ├── Application → Backend Engineer
   ├── Application → AI Engineer
   └── Application → Platform Engineer
```

This allows one candidate to apply to multiple jobs without duplicating
the candidate profile.

## Candidate Fields

``` text
firstName
lastName
email
phone
location
linkedinUrl
portfolioUrl
source
resumeFileName
resumeUrl
notes
createdAt
updatedAt
```

## Candidate Source

``` text
CAREERS_PAGE
LINKEDIN
REFERRAL
RECRUITER
AGENCY
JOB_BOARD
MANUAL
OTHER
```

The frontend includes candidate listing and candidate details pages.

------------------------------------------------------------------------

# Job Applications

Job applications connect candidates to jobs:

``` text
Candidate
    │
    ▼
JobApplication
    │
    ▼
Job
```

The combination of candidate and job is unique within a tenant:

``` text
UNIQUE (
    tenant_id,
    job_id,
    candidate_id
)
```

## Application Stage

``` text
APPLIED
SCREENING
INTERVIEW
OFFER
HIRED
```

## Application Status

``` text
ACTIVE
HIRED
REJECTED
WITHDRAWN
```

Stage and status are intentionally separate. For example:

``` text
stage  = INTERVIEW
status = REJECTED
```

This preserves the point in the recruitment process at which the
application was closed.

## Application Timestamps

``` text
appliedAt
rejectedAt
withdrawnAt
hiredAt
createdAt
updatedAt
```

A rejection reason can also be stored.

------------------------------------------------------------------------

# Candidate ↔ Job Workflows

Applications can be created from either side of the ATS.

## Job → Candidate

``` text
Job Details
    │
    ▼
Add Candidate
    │
    ▼
Select Candidate
    │
    ▼
Create JobApplication
```

## Candidate → Job

``` text
Candidate Details
    │
    ▼
Add to Job
    │
    ▼
Select Open Job
    │
    ▼
Create JobApplication
```

Both workflows create the same underlying `JobApplication`.

------------------------------------------------------------------------

# Application Activity History

DarmiHire maintains recruiter-facing application activity separately
from general system audit logs.

## Audit Log

The general audit system records protected resource and
compliance/security actions.

## Application Activity

Application activity provides the ATS timeline: when a candidate was
added, moved between stages, rejected, withdrawn, or hired.

## Activity Types

``` text
APPLICATION_CREATED
STAGE_CHANGED
REJECTED
WITHDRAWN
HIRED
```

An activity can contain:

``` text
application
activityType
fromStage
toStage
description
performedBy
createdAt
```

`performedBy` is nullable so system-generated and automated events can
be supported later.

Example timeline:

``` text
09 Oct 2026  Candidate hired
04 Oct 2026  Interview → Offer
01 Oct 2026  Screening → Interview
29 Sep 2026  Applied → Screening
28 Sep 2026  Application created
```

------------------------------------------------------------------------

# Drag-and-Drop Hiring Pipeline

Step 17.4 introduced a Kanban-style application pipeline.

``` text
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  APPLIED  │  │ SCREENING │  │ INTERVIEW │  │   OFFER   │  │   HIRED   │
│           │  │           │  │           │  │           │  │           │
│ Candidate │→ │ Candidate │→ │ Candidate │→ │ Candidate │→ │ Candidate │
└───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘
```

Implementation:

``` text
@dnd-kit/core
```

Relevant frontend components:

``` text
src/features/applications/
├── ApplicationCard.tsx
├── ApplicationPipeline.tsx
├── ApplicationPipelineColumn.tsx
└── ApplicationDragOverlay.tsx
```

Only active, non-hired applications are draggable:

``` text
ACTIVE + APPLIED      → draggable
ACTIVE + SCREENING    → draggable
ACTIVE + INTERVIEW    → draggable
ACTIVE + OFFER        → draggable
HIRED                 → terminal
REJECTED              → outside active pipeline
WITHDRAWN             → outside active pipeline
```

Each pipeline column is a droppable stage:

``` ts
useDroppable({
  id: `pipeline-stage-${stage}`,
  data: {
    type: "stage",
    stage,
  },
});
```

Stage changes reuse the existing backend mutation:

``` text
Drag Candidate
      │
      ▼
Drop on Stage
      │
      ▼
onStageChange(...)
      │
      ▼
PATCH Application Stage
      │
      ▼
PostgreSQL
      │
      ▼
Query invalidation
      │
      ▼
Updated Kanban board
```

Dropdown-based stage movement remains available as an alternative.

------------------------------------------------------------------------

# Permissions

Authorization is enforced by the backend.

Important recruitment permissions include:

``` text
MANAGE_JOBS
MANAGE_CANDIDATES
MANAGE_APPLICATIONS
```

Typical service usage:

``` java
authorizationService.require(Permission.MANAGE_APPLICATIONS);
```

Frontend visibility is for usability; backend authorization remains the
security boundary.

------------------------------------------------------------------------

# Audit Logging

Important mutations generate audit events.

## Jobs

``` text
JOB_CREATED
JOB_UPDATED
JOB_STATUS_CHANGED
JOB_DELETED
```

## Candidates

``` text
CANDIDATE_CREATED
CANDIDATE_UPDATED
CANDIDATE_DELETED
```

## Applications

``` text
APPLICATION_CREATED
APPLICATION_STAGE_CHANGED
APPLICATION_REJECTED
APPLICATION_WITHDRAWN
APPLICATION_HIRED
```

Typical usage:

``` java
auditService.log(
    AuditAction.APPLICATION_STAGE_CHANGED,
    "JobApplication",
    application.getId()
);
```

------------------------------------------------------------------------

# Backend API

Base path:

``` text
/api/v1
```

## Candidates

``` http
GET    /api/v1/candidates
GET    /api/v1/candidates/{candidateId}
POST   /api/v1/candidates
PUT    /api/v1/candidates/{candidateId}
DELETE /api/v1/candidates/{candidateId}
```

## Applications

``` http
GET   /api/v1/applications
GET   /api/v1/applications/{applicationId}
GET   /api/v1/applications/job/{jobId}
GET   /api/v1/applications/candidate/{candidateId}

POST  /api/v1/applications

PATCH /api/v1/applications/{applicationId}/stage
PATCH /api/v1/applications/{applicationId}/reject
PATCH /api/v1/applications/{applicationId}/withdraw
```

## Application Activities

``` http
GET /api/v1/applications/{applicationId}/activities
```

Example application creation:

``` json
{
  "jobId": "job-uuid",
  "candidateId": "candidate-uuid"
}
```

Example stage change:

``` http
PATCH /api/v1/applications/{applicationId}/stage
```

``` json
{
  "stage": "INTERVIEW"
}
```

Example rejection:

``` json
{
  "reason": "Candidate experience does not match the current requirements."
}
```

------------------------------------------------------------------------

# Frontend Architecture

The frontend is organized by business feature:

``` text
src/
├── api/
│   └── client.ts
├── components/
│   └── ui/
├── features/
│   ├── jobs/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── queryKeys.ts
│   ├── candidates/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── queryKeys.ts
│   │   ├── schemas.ts
│   │   ├── CandidateForm.tsx
│   │   ├── CandidateDialog.tsx
│   │   └── DeleteCandidateDialog.tsx
│   └── applications/
│       ├── api.ts
│       ├── types.ts
│       ├── queryKeys.ts
│       ├── AddCandidateDialog.tsx
│       ├── AddJobToCandidateDialog.tsx
│       ├── RejectApplicationDialog.tsx
│       ├── ApplicationCard.tsx
│       ├── ApplicationPipeline.tsx
│       ├── ApplicationPipelineColumn.tsx
│       ├── ApplicationDragOverlay.tsx
│       ├── ApplicationActivityTimeline.tsx
│       └── ApplicationActivityPanel.tsx
├── pages/
│   ├── JobsPage.tsx
│   ├── JobDetailsPage.tsx
│   ├── CandidatesPage.tsx
│   └── CandidateDetailsPage.tsx
└── utils/
    └── session.ts
```

## TanStack Query

Server state uses TanStack Query with tenant-aware query keys.

``` ts
applicationQueryKeys.job(tenantId, jobId);
```

Mutations invalidate relevant queries to synchronize the UI with backend
state.

## Shared API Client

API calls use:

``` ts
apiRequest<T>(path, options);
```

Tenant-scoped calls use:

``` ts
{
  authenticated: true,
  tenantScoped: true,
}
```

Pass request bodies directly:

``` ts
body: request
```

Do **not** manually serialize:

``` ts
body: JSON.stringify(request)
```

The shared API client already handles JSON serialization.

------------------------------------------------------------------------

# Backend Architecture

Business modules use a consistent structure.

Candidate example:

``` text
candidate/
├── Candidate.java
├── CandidateSource.java
├── CandidateRepository.java
├── CandidateService.java
├── CandidateController.java
└── dto/
    ├── CreateCandidateRequest.java
    ├── UpdateCandidateRequest.java
    └── CandidateResponse.java
```

Application example:

``` text
application/
├── JobApplication.java
├── ApplicationStage.java
├── ApplicationStatus.java
├── ApplicationActivity.java
├── ApplicationActivityType.java
├── JobApplicationRepository.java
├── ApplicationActivityRepository.java
├── JobApplicationService.java
├── ApplicationActivityService.java
├── JobApplicationController.java
└── dto/
```

Services follow:

``` java
@Service
@RequiredArgsConstructor
public class CandidateService {
    // ...
}
```

Reads:

``` java
@Transactional(readOnly = true)
```

Mutations:

``` java
@Transactional
```

Repository access remains tenant-scoped:

``` java
findByIdAndTenantId(UUID id, UUID tenantId);
```

------------------------------------------------------------------------

# Database Model

Simplified recruitment model:

``` text
Tenant
 │
 ├───────────────┐
 │               │
 ▼               ▼
Job           Candidate
 │               │
 └──────┬────────┘
        │
        ▼
 JobApplication
        │
        ▼
ApplicationActivity
```

Broader tenant relationships:

``` text
Tenant
 ├── TenantUser
 ├── Role
 ├── Department
 ├── Team
 ├── TeamMember
 ├── Location
 ├── Invitation
 ├── Job
 ├── Candidate
 └── JobApplication
```

Database schema changes are managed with Flyway migrations.

------------------------------------------------------------------------

# Local Development

## Prerequisites

``` text
Java 21
Node.js
npm
PostgreSQL 17
```

Verify:

``` bash
java --version
node --version
npm --version
psql --version
```

## Database

Example local database:

``` text
Database: darmihire
Host: localhost
Port: 5432
```

Keep credentials and production secrets outside source control.

## Start Backend

``` bash
./mvnw spring-boot:run
```

or:

``` bash
mvn spring-boot:run
```

Development API:

``` text
http://localhost:8080/api/v1
```

## Start Frontend

``` bash
npm install
npm run dev
```

DnD dependency:

``` bash
npm install @dnd-kit/core
```

------------------------------------------------------------------------

# Development Conventions

## Backend

-   Keep business logic in services.
-   Use tenant-aware repository methods.
-   Resolve tenant ownership from `TenantContext`.
-   Enforce permissions in the backend.
-   Use `ResourceNotFoundException` and `ConflictException` where
    appropriate.
-   Audit important mutations.
-   Use Flyway for schema changes.

Example repository patterns:

``` java
findAllByTenantIdOrderByCreatedAtDesc(...)
findByIdAndTenantId(...)
existsByTenantIdAndEmailIgnoreCase(...)
```

## Frontend

-   Organize code by business feature.
-   Use TanStack Query for server state.
-   Use React Hook Form + Zod for forms.
-   Use shadcn/ui components.
-   Use Sonner for feedback.
-   Use React Router for navigation.
-   Use tenant-aware query keys.
-   Pass objects directly to `apiRequest`.
-   Use `DropdownMenuTrigger asChild` and `onSelect` for dropdown
    commands.
-   Keep dnd-kit listeners on the drag handle rather than the entire
    card.

------------------------------------------------------------------------

# Project Roadmap

## Foundation

``` text
✓ Authentication
✓ Multi-tenancy
✓ Users
✓ Roles / permissions
✓ Departments
✓ Teams
✓ Team members
✓ Locations
✓ Audit infrastructure
✓ Invitations
```

## Recruitment Foundation

``` text
✓ Jobs / job requisitions
✓ Job lifecycle
✓ Candidates
✓ Candidate profiles
✓ Job applications
✓ Candidate → Job workflow
✓ Job → Candidate workflow
```

## ATS Pipeline

``` text
✓ Application stages
✓ Application statuses
✓ Rejection
✓ Withdrawal
✓ Hiring state
✓ Application activity history
✓ Stage history timeline
✓ Kanban pipeline
✓ Drag-and-drop stage movement
```

## Step 18 --- Next

``` text
○ Interviews & Scheduling
```

Planned Step 18 capabilities:

``` text
Interview entity
Interview types
Interview rounds
Interview status
Start/end time
Timezone
Meeting information
Interviewer assignment
Application relationship
Interview creation
Interview editing
Interview rescheduling
Interview cancellation
Upcoming interview views
Candidate interview history
```

## Later Phases

``` text
○ Interview scorecards
○ Interview feedback
○ Hiring evaluations
○ Resume upload/storage
○ Resume parsing
○ Candidate skill extraction
○ Job requirement extraction
○ AI candidate/job matching
○ Semantic similarity
○ Candidate ranking
○ AI recruitment summaries
○ AI recommendations
○ Notifications
○ Email workflows
○ Careers page
○ Candidate application portal
○ Reporting / analytics
○ Recruiting automation
```

------------------------------------------------------------------------

# Next Step

The next implementation milestone is **Step 18 --- Interviews &
Scheduling**.

Recommended order:

``` text
Step 18.1  Interview domain model + Flyway migration
Step 18.2  Interview backend APIs
Step 18.3  Interview scheduling frontend
Step 18.4  Interviewer assignment
Step 18.5  Rescheduling, status and cancellation
Step 18.6  Candidate/application interview timeline
```

After scheduling is stable, DarmiHire can move into structured interview
scorecards and hiring evaluations.

------------------------------------------------------------------------

# DarmiHire

**Modern hiring, powered by AI.**

Built by **Darmi Solutions**.
