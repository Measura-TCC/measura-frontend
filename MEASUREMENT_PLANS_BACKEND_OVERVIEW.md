# Measurement Plans API - Comprehensive Guide

**Version**: 1.0
**Date**: 2025-10-23
**Base Path**: `/measurement-plans`
**Authentication**: Bearer JWT Token Required

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model](#data-model)
3. [Complete Endpoint Reference](#complete-endpoint-reference)
4. [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
5. [Status Calculation Logic](#status-calculation-logic)
6. [Validation & Business Rules](#validation--business-rules)
7. [Examples](#examples)

---

## Architecture Overview

### Nested Document Structure

Measurement plans use a **nested MongoDB document structure** where all data is stored in a single document, not across separate collections.

```
MeasurementPlan (Root MongoDB Document)
├── Plan Metadata (name, status, project link, organization)
├── Objectives[]
    ├── Questions[]
        ├── Metrics[]
            └── Measurements[]
```

### Key Characteristics

- ✅ **Single document**: All nested data stored together
- ✅ **Atomic updates**: Changes to nested entities update the parent document
- ✅ **Cascade deletion**: Deleting a parent deletes all children
- ✅ **Auto-linking**: Plans automatically link to projects bidirectionally
- ⚠️ **No versioning**: Updates replace existing data (no history tracking)

### File Locations

| Component      | File Path                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| Controller     | `src/controllers/measurement-plans/measurement-plans.controller.ts`                |
| Service        | `src/application/measurement-plans/use-cases/measurement-plan.service.ts`          |
| Entity/Schema  | `src/domain/measurement-plans/entities/measurement-plan.entity.ts`                 |
| Status Service | `src/application/measurement-plans/use-cases/status.service.ts`                    |
| Repository     | `src/infrastructure/repositories/measurement-plans/measurement-plan.repository.ts` |

---

## Data Model

### MeasurementPlan (Root Entity)

```typescript
{
  _id: ObjectId,
  planName: string,                    // Max 255 chars
  associatedProject: ObjectId,         // Link to Project (required)
  planResponsible: string,             // Max 255 chars
  organizationId: ObjectId,            // Link to Organization
  status: "draft" | "active" | "completed",
  createdBy: ObjectId,                 // User who created the plan
  objectives: Objective[],             // Nested array
  createdAt: Date,                     // Auto-generated
  updatedAt: Date                      // Auto-updated
}
```

**Status Enum**:

- `draft`: Initial state, editable, deletable
- `active`: Plan is being executed, cannot be deleted
- `completed`: Final state, cannot be deleted or transitioned

**Status Transitions**:

```
draft ──────────> active
  ^                 │
  │                 │
  └─────────────────┘
                    │
                    ▼
                completed (final)
```

**Indexes** (for performance):

- `organizationId`
- `associatedProject`
- `createdBy`
- `status`
- `createdAt` (descending)
- Compound: `organizationId + status`
- Compound: `organizationId + status + createdAt`
- Text index: `planName`

---

### Objective (Nested Entity)

```typescript
{
  _id: ObjectId,
  objectiveTitle: string,              // Required
  questions: Question[]                // Default: []
}
```

**Purpose**: Represents a high-level goal or objective being measured (e.g., "Improve API response time", "Reduce error rate")

---

### Question (Nested Entity)

```typescript
{
  _id: ObjectId,
  questionText: string,                // Required
  metrics: Metric[]                    // Default: []
}
```

**Purpose**: Specific question being answered to measure the objective (e.g., "What is the average response time?", "How many errors occur per hour?")

---

### Metric (Nested Entity)

```typescript
{
  _id: ObjectId,
  metricName: string,                  // Max 50 chars
  metricDescription: string,           // Max 400 chars
  metricMnemonic: string,              // Max 10 chars, UNIQUE per plan
  metricFormula: string,               // Calculation formula
  metricControlRange: [number, number], // [min, max] exactly 2 values
  analysisProcedure: string,           // Max 1000 chars
  analysisFrequency: string,           // Max 50 chars (e.g., "Daily", "Weekly")
  analysisResponsible?: string,        // Optional, max 255 chars
  measurements: Measurement[]          // Min 1 required
}
```

**Constraints**:

- `metricMnemonic` must be **unique across entire plan**
- `metricControlRange` must have **exactly 2 numbers** [min, max]
- Must have **at least 1 measurement**

**Purpose**: Defines what is being measured and how (e.g., "API Response Time", "Error Rate", "CPU Usage")

---

### Measurement (Nested Entity)

```typescript
{
  _id: ObjectId,
  measurementEntity: string,           // Max 50 chars (what is measured)
  measurementAcronym: string,          // Max 3 chars, UNIQUE per metric
  measurementProperties: string,       // Max 200 chars
  measurementUnit: string,             // Max 50 chars (e.g., "ms", "%", "count")
  measurementScale: string,            // Scale type (e.g., "Ratio", "Interval")
  measurementProcedure: string,        // Max 1000 chars (how to measure)
  measurementFrequency: string,        // Max 50 chars (e.g., "Every 5 min")
  measurementResponsible?: string      // Optional, max 255 chars
}
```

**Constraints**:

- `measurementAcronym` must be **unique within the same metric**

**Purpose**: Specific method of collecting data for the metric (e.g., "GET endpoint response time", "Database query execution time")

---

## Complete Endpoint Reference

### Quick Reference Table

| #                   | Method | Endpoint                                                     | Purpose                  |
| ------------------- | ------ | ------------------------------------------------------------ | ------------------------ |
| **Plan Management** |
| 1                   | POST   | `/:organizationId`                                           | Create measurement plan  |
| 2                   | GET    | `/:organizationId`                                           | List plans (paginated)   |
| 3                   | GET    | `/:organizationId/:planId`                                   | Get single plan          |
| 4                   | PUT    | `/:organizationId/:planId`                                   | Update plan metadata     |
| 5                   | DELETE | `/:organizationId/:planId`                                   | Delete plan (draft only) |
| **Objectives**      |
| 6                   | POST   | `/:organizationId/:planId/objectives`                        | Add objective            |
| 7                   | PUT    | `/:organizationId/:planId/objectives/:objectiveId`           | Update objective         |
| 8                   | DELETE | `/:organizationId/:planId/objectives/:objectiveId`           | Delete objective         |
| **Questions**       |
| 9                   | POST   | `/:organizationId/:planId/objectives/:objectiveId/questions` | Add question             |
| 10                  | PUT    | `/:id/objectives/:objectiveId/questions/:questionId`         | Update question          |
| 11                  | DELETE | `/:id/objectives/:objectiveId/questions/:questionId`         | Delete question          |
| **Metrics**         |
| 12                  | POST   | `/:id/objectives/:objectiveId/questions/:questionId/metrics` | Add metric               |
| 13                  | PUT    | `/:id/.../metrics/:metricId`                                 | Update metric            |
| 14                  | DELETE | `/:id/.../metrics/:metricId`                                 | Delete metric            |
| **Measurements**    |
| 15                  | POST   | `/:id/.../metrics/:metricId/measurements`                    | Add measurement          |
| 16                  | PUT    | `/:id/.../measurements/:measurementId`                       | Update measurement       |
| 17                  | DELETE | `/:id/.../measurements/:measurementId`                       | Delete measurement       |

**Total: 17 Endpoints**

---

## Detailed Endpoint Documentation

### 1. Create Measurement Plan

**POST** `/measurement-plans/:organizationId`

**Description**: Creates a new measurement plan and auto-links it to the specified project.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID

**Request Body**:

```json
{
  "planName": "Q4 Performance Monitoring",
  "associatedProject": "68c8751a70b5c520bf74c6db",
  "planResponsible": "John Doe",
  "objectives": [
    {
      "objectiveTitle": "Improve API response time",
      "questions": [
        {
          "questionText": "What is the average response time?",
          "metrics": [
            {
              "metricName": "API Response Time",
              "metricDescription": "Average time for API requests to complete",
              "metricMnemonic": "ART",
              "metricFormula": "SUM(response_times) / COUNT(requests)",
              "metricControlRange": [0, 500],
              "analysisProcedure": "Compare against baseline and identify outliers",
              "analysisFrequency": "Daily",
              "analysisResponsible": "DevOps Team",
              "measurements": [
                {
                  "measurementEntity": "API Endpoint",
                  "measurementAcronym": "GET",
                  "measurementProperties": "HTTP GET request duration",
                  "measurementUnit": "milliseconds",
                  "measurementScale": "Ratio",
                  "measurementProcedure": "Use APM tool to capture request time",
                  "measurementFrequency": "Real-time",
                  "measurementResponsible": "Backend Team"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Response** (201 Created):

```json
{
  "_id": "68f591c2ebd60660329957a1",
  "planName": "Q4 Performance Monitoring",
  "associatedProject": "68c8751a70b5c520bf74c6db",
  "planResponsible": "John Doe",
  "organizationId": "68c8750f70b5c520bf74c6d7",
  "status": "draft",
  "createdBy": "68u45221568697b82b8ea00e",
  "objectives": [...],
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T10:00:00.000Z"
}
```

**Business Logic**:

1. ✅ Validates project belongs to organization
2. ✅ Checks project doesn't already have a plan (1-to-1 constraint)
3. ✅ Generates ObjectIds for all nested entities recursively
4. ✅ Creates plan with status = `draft`
5. ✅ **Auto-links plan to project** (updates `project.measurementPlanId`)

**Error Responses**:

- `400 Bad Request`: Project already has a measurement plan
- `403 Forbidden`: Project belongs to different organization
- `404 Not Found`: Project not found

**Implementation Reference**: `measurement-plan.service.ts:42-117`

---

### 2. List Measurement Plans (Paginated)

**GET** `/measurement-plans/:organizationId?page=1&limit=10&status=active&projectId=xxx&search=performance`

**Description**: Retrieves a paginated list of measurement plans with optional filtering.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID

**Query Parameters**:

- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page
- `status` (string, optional): Filter by status (`draft`, `active`, `completed`)
- `projectId` (string, optional): Filter by project ID
- `search` (string, optional): Search in plan names (text search)

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "68f591c2ebd60660329957a1",
      "planName": "Q4 Performance Monitoring",
      "associatedProject": "68c8751a70b5c520bf74c6db",
      "planResponsible": "John Doe",
      "status": "active",
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-23T15:30:00.000Z",
      "objectivesCount": 3,
      "questionsCount": 8,
      "metricsCount": 15,
      "measurementsCount": 45,
      "progress": 100
    },
    {
      "id": "68f591d4ebd60660329957b2",
      "planName": "Security Audit Plan",
      "associatedProject": "68c8752570b5c520bf74c6e8",
      "planResponsible": "Jane Smith",
      "status": "draft",
      "createdAt": "2025-10-21T14:20:00.000Z",
      "updatedAt": "2025-10-21T14:20:00.000Z",
      "objectivesCount": 1,
      "questionsCount": 2,
      "metricsCount": 0,
      "measurementsCount": 0,
      "progress": 50
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 23,
    "totalPages": 3
  }
}
```

**Progress Calculation**:

```
Has measurements → 100%
Has metrics (no measurements) → 75%
Has questions (no metrics) → 50%
Has objectives (no questions) → 25%
Empty plan → 0%
```

**Implementation Reference**: `measurement-plan.service.ts:119-162`

---

### 3. Get Single Measurement Plan

**GET** `/measurement-plans/:organizationId/:planId`

**Description**: Retrieves complete details of a single measurement plan including all nested entities.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID

**Response** (200 OK):

```json
{
  "id": "68f591c2ebd60660329957a1",
  "planName": "Q4 Performance Monitoring",
  "organizationId": "68c8750f70b5c520bf74c6d7",
  "createdBy": "68u45221568697b82b8ea00e",
  "associatedProject": "68c8751a70b5c520bf74c6db",
  "associatedProjectName": "HelpDesk 360",
  "planResponsible": "John Doe",
  "status": "active",
  "objectives": [
    {
      "_id": "68o591c3ebd60660329957a2",
      "objectiveTitle": "Improve API response time",
      "questions": [
        {
          "_id": "68q591c4ebd60660329957a3",
          "questionText": "What is the average response time?",
          "metrics": [
            {
              "_id": "68m591c5ebd60660329957a4",
              "metricName": "API Response Time",
              "metricDescription": "Average time for API requests",
              "metricMnemonic": "ART",
              "metricFormula": "AVG(response_times)",
              "metricControlRange": [0, 500],
              "analysisProcedure": "Daily review",
              "analysisFrequency": "Daily",
              "measurements": [
                {
                  "_id": "68ms91c6ebd60660329957a5",
                  "measurementEntity": "API Endpoint",
                  "measurementAcronym": "GET",
                  "measurementUnit": "ms",
                  "measurementScale": "Ratio",
                  "measurementProcedure": "APM monitoring",
                  "measurementFrequency": "Real-time"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "objectivesCount": 3,
  "questionsCount": 8,
  "metricsCount": 15,
  "measurementsCount": 45,
  "progress": 100,
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-23T15:30:00.000Z"
}
```

**Error Responses**:

- `403 Forbidden`: Access denied (plan belongs to different organization)
- `404 Not Found`: Plan not found

**Implementation Reference**: `measurement-plan.service.ts:164-191`

---

### 4. Update Measurement Plan

**PUT** `/measurement-plans/:organizationId/:planId`

**Description**: Updates plan metadata and validates status transitions.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID

**Request Body** (partial update allowed):

```json
{
  "planName": "Q4 Performance Monitoring - Updated",
  "status": "active",
  "planResponsible": "John Doe Jr."
}
```

**Response** (200 OK): Updated MeasurementPlan document

**Valid Status Transitions**:

```
draft → active ✅
active → completed ✅
active → draft ✅
completed → (any) ❌ (final state)
```

**Error Responses**:

- `400 Bad Request`: Invalid status transition
- `403 Forbidden`: Access denied
- `404 Not Found`: Plan not found

**⚠️ Warning**: Updating `objectives` field replaces the entire array. Use nested endpoints for granular changes.

**Implementation Reference**: `measurement-plan.service.ts:193-257`

---

### 5. Delete Measurement Plan

**DELETE** `/measurement-plans/:organizationId/:planId`

**Description**: Deletes a measurement plan and unlinks it from the project.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID

**Response** (204 No Content): Empty response

**Business Rules**:

- ✅ Can delete: `draft` status
- ❌ Cannot delete: `active` or `completed` status (returns 409 Conflict)
- ✅ Auto-unlinks from project (clears `project.measurementPlanId`)

**Error Responses**:

- `403 Forbidden`: Access denied
- `404 Not Found`: Plan not found
- `409 Conflict`: Cannot delete active or completed plan

**Implementation Reference**: `measurement-plan.service.ts:259-298`

---

### 6. Add Objective

**POST** `/measurement-plans/:organizationId/:planId/objectives`

**Description**: Adds a new objective to the measurement plan.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID

**Request Body**:

```json
{
  "objectiveTitle": "Reduce error rate",
  "questions": [
    {
      "questionText": "What is the current error rate?",
      "metrics": [
        {
          "metricName": "Error Rate",
          "metricMnemonic": "ERR",
          "metricControlRange": [0, 1],
          "measurements": [
            {
              "measurementEntity": "API Errors",
              "measurementAcronym": "ERR",
              "measurementUnit": "%",
              "measurementScale": "Ratio",
              "measurementProcedure": "Count 5xx responses",
              "measurementFrequency": "Hourly"
            }
          ]
        }
      ]
    }
  ]
}
```

**Response** (201 Created): Updated MeasurementPlan with new objective

**Business Logic**:

- Generates ObjectIds for objective and all nested entities
- Appends to `plan.objectives` array
- Atomic update operation

**Implementation Reference**: `measurement-plan.service.ts:301-338`

---

### 7. Update Objective

**PUT** `/measurement-plans/:organizationId/:planId/objectives/:objectiveId`

**Description**: Updates an existing objective.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID

**Request Body** (partial update):

```json
{
  "objectiveTitle": "Reduce error rate to <1%"
}
```

**Response** (200 OK): Updated MeasurementPlan

**Implementation Reference**: `measurement-plan.service.ts:340-376`

---

### 8. Delete Objective

**DELETE** `/measurement-plans/:organizationId/:planId/objectives/:objectiveId`

**Description**: Deletes an objective and all its nested entities (cascade).

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID

**Response** (204 No Content): Empty response

**⚠️ Warning**: Deletes all nested questions, metrics, and measurements

**Implementation Reference**: `measurement-plan.service.ts:378-396`

---

### 9. Add Question

**POST** `/measurement-plans/:organizationId/:planId/objectives/:objectiveId/questions`

**Description**: Adds a question to an objective.

**Path Parameters**:

- `organizationId` (string, MongoId): Organization ID
- `planId` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID

**Request Body**:

```json
{
  "questionText": "What is the database query performance?",
  "metrics": [
    {
      "metricName": "Query Execution Time",
      "metricMnemonic": "QET",
      "metricControlRange": [0, 100],
      "measurements": [...]
    }
  ]
}
```

**Response** (201 Created): Updated MeasurementPlan

**Implementation Reference**: `measurement-plan.service.ts:399-433`

---

### 10. Update Question

**PUT** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId`

**Description**: Updates a question.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID

**Request Body**:

```json
{
  "questionText": "What is the average database query execution time?"
}
```

**Response** (200 OK): Updated MeasurementPlan

**⚠️ Note**: Different route pattern (uses `:id` instead of `:organizationId/:planId`)

**Implementation Reference**: `measurement-plan.service.ts:435-469`

---

### 11. Delete Question

**DELETE** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId`

**Description**: Deletes a question and all nested metrics/measurements.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID

**Response** (204 No Content): Empty response

**Implementation Reference**: `measurement-plan.service.ts:471-491`

---

### 12. Add Metric

**POST** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics`

**Description**: Adds a metric to a question with validation.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID

**Request Body**:

```json
{
  "metricName": "CPU Usage",
  "metricDescription": "Average CPU utilization across instances",
  "metricMnemonic": "CPU",
  "metricFormula": "SUM(cpu_percent) / COUNT(instances)",
  "metricControlRange": [0, 80],
  "analysisProcedure": "Compare against baseline and trigger alerts",
  "analysisFrequency": "Every 5 minutes",
  "analysisResponsible": "DevOps Team",
  "measurements": [
    {
      "measurementEntity": "Server Instance",
      "measurementAcronym": "SRV",
      "measurementProperties": "CPU percentage",
      "measurementUnit": "%",
      "measurementScale": "Ratio",
      "measurementProcedure": "Query from CloudWatch/monitoring API",
      "measurementFrequency": "Every minute",
      "measurementResponsible": "Infrastructure Team"
    }
  ]
}
```

**Response** (201 Created): Updated MeasurementPlan

**Validation**:

- ✅ `metricMnemonic` must be **unique across entire plan**
- ✅ Must provide **at least 1 measurement**

**Error Responses**:

- `409 Conflict`: Metric mnemonic already exists

**Implementation Reference**: `measurement-plan.service.ts:494-537`

---

### 13. Update Metric

**PUT** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics/:metricId`

**Description**: Updates a metric with mnemonic validation.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID
- `metricId` (string, MongoId): Metric ID

**Request Body** (partial update):

```json
{
  "metricControlRange": [0, 90],
  "analysisFrequency": "Every 10 minutes"
}
```

**Response** (200 OK): Updated MeasurementPlan

**Validation**: If updating `metricMnemonic`, validates uniqueness

**Error Responses**:

- `409 Conflict`: New mnemonic already exists

**Implementation Reference**: `measurement-plan.service.ts:539-584`

---

### 14. Delete Metric

**DELETE** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics/:metricId`

**Description**: Deletes a metric and all its measurements.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID
- `metricId` (string, MongoId): Metric ID

**Response** (204 No Content): Empty response

**Implementation Reference**: `measurement-plan.service.ts:586-606`

---

### 15. Add Measurement

**POST** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics/:metricId/measurements`

**Description**: Adds a measurement to a metric.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID
- `metricId` (string, MongoId): Metric ID

**Request Body**:

```json
{
  "measurementEntity": "Database Query",
  "measurementAcronym": "DBQ",
  "measurementProperties": "SELECT execution time",
  "measurementUnit": "milliseconds",
  "measurementScale": "Ratio",
  "measurementProcedure": "Use EXPLAIN ANALYZE and log query duration",
  "measurementFrequency": "Per deployment",
  "measurementResponsible": "Database Team"
}
```

**Response** (201 Created): Updated MeasurementPlan

**Validation**:

- ✅ `measurementAcronym` must be **unique within the same metric**

**Error Responses**:

- `409 Conflict`: Measurement acronym already exists in this metric

**Implementation Reference**: `measurement-plan.service.ts:609-653`

---

### 16. Update Measurement

**PUT** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics/:metricId/measurements/:measurementId`

**Description**: Updates a measurement with acronym validation.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID
- `metricId` (string, MongoId): Metric ID
- `measurementId` (string, MongoId): Measurement ID

**Request Body** (partial update):

```json
{
  "measurementFrequency": "Hourly",
  "measurementResponsible": "DevOps Team"
}
```

**Response** (200 OK): Updated MeasurementPlan

**Validation**: If updating `measurementAcronym`, validates uniqueness within metric

**Implementation Reference**: `measurement-plan.service.ts:655-699`

---

### 17. Delete Measurement

**DELETE** `/measurement-plans/:id/objectives/:objectiveId/questions/:questionId/metrics/:metricId/measurements/:measurementId`

**Description**: Deletes a measurement from a metric.

**Path Parameters**:

- `id` (string, MongoId): Plan ID
- `objectiveId` (string, MongoId): Objective ID
- `questionId` (string, MongoId): Question ID
- `metricId` (string, MongoId): Metric ID
- `measurementId` (string, MongoId): Measurement ID

**Response** (204 No Content): Empty response

**Implementation Reference**: `measurement-plan.service.ts:701-725`

---

## Status Calculation Logic

### Metric Status Calculation

**Endpoint**: Not exposed directly (used internally)
**Implementation**: `status.service.ts:14-64`

**Logic**:

```typescript
const [min, max] = metric.metricControlRange;

measurements.forEach((measurement) => {
  if (measurement.value >= min && measurement.value <= max) {
    withinRange++;
  } else {
    outOfRange++;
  }
});

return {
  status: outOfRange === 0 ? "OK" : "NEEDS_ATTENTION",
  withinRange,
  outOfRange,
  totalMeasurements,
  controlRange: [min, max],
  latestValue: measurements[0]?.value,
};
```

**Example**:

```
Control Range: [0, 500] ms
Actual Measurements:
  - 450 ms ✅ (within range)
  - 520 ms ❌ (out of range)
  - 480 ms ✅ (within range)
  - 600 ms ❌ (out of range)

Result:
  withinRange = 2
  outOfRange = 2
  status = "NEEDS_ATTENTION"
```

**Key Rule**: **If ANY measurement is out of range, metric status = NEEDS_ATTENTION**

---

### Plan Status Calculation

**Endpoint**: Not exposed directly (used internally)
**Implementation**: `status.service.ts:66-99`

**Logic**:

```typescript
// Collect all metric IDs across objectives → questions → metrics
const metricIds = plan.objectives
  .flatMap((obj) => obj.questions)
  .flatMap((q) => q.metrics)
  .map((m) => m._id.toString());

// Check status of each metric
for (const metricId of metricIds) {
  const status = await getMetricStatus(planId, metricId);
  if (status.status === "OK") {
    metricsOk++;
  } else {
    metricsNeedAttention++;
  }
}

return {
  overallStatus: metricsNeedAttention === 0 ? "OK" : "NEEDS_ATTENTION",
  metricsOk,
  metricsNeedAttention,
  totalMetrics: metricIds.length,
};
```

**Example**:

```
Total Metrics: 15
Metrics with status OK: 12
Metrics with status NEEDS_ATTENTION: 3

Result:
  overallStatus = "NEEDS_ATTENTION"
```

**Key Rule**: **If ANY metric needs attention, plan status = NEEDS_ATTENTION**

---

## Validation & Business Rules

### Uniqueness Constraints

| Field                | Scope           | Validation                                             |
| -------------------- | --------------- | ------------------------------------------------------ |
| `metricMnemonic`     | **Entire plan** | Must be unique across all objectives/questions/metrics |
| `measurementAcronym` | **Same metric** | Must be unique within the parent metric only           |

**Example**:

```
Plan A
  Objective 1
    Question 1
      Metric 1 (mnemonic: "CPU") ✅
      Metric 2 (mnemonic: "MEM") ✅
    Question 2
      Metric 3 (mnemonic: "CPU") ❌ CONFLICT (already used in Metric 1)
      Metric 4 (mnemonic: "NET") ✅

Metric 1 (mnemonic: "CPU")
  Measurement 1 (acronym: "SRV") ✅
  Measurement 2 (acronym: "DB") ✅
  Measurement 3 (acronym: "SRV") ❌ CONFLICT (already used in same metric)

Metric 4 (mnemonic: "NET")
  Measurement 4 (acronym: "SRV") ✅ OK (different metric)
```

---

### Deletion Rules

| Entity                     | Can Delete?          | Cascade Effect                                 |
| -------------------------- | -------------------- | ---------------------------------------------- |
| Plan (status: `draft`)     | ✅ Yes               | Unlinks from project                           |
| Plan (status: `active`)    | ❌ No (409 Conflict) | -                                              |
| Plan (status: `completed`) | ❌ No (409 Conflict) | -                                              |
| Objective                  | ✅ Yes               | Deletes all questions → metrics → measurements |
| Question                   | ✅ Yes               | Deletes all metrics → measurements             |
| Metric                     | ✅ Yes               | Deletes all measurements                       |
| Measurement                | ✅ Yes               | No cascade                                     |

**⚠️ Critical**: Active and completed plans are **protected from deletion**. You must transition them to `draft` status first.

---

### Project Relationship Constraints

**One-to-One Relationship**:

- Each **project** can have **at most ONE measurement plan**
- Each **measurement plan** must be linked to **exactly ONE project**

**Enforcement**:

1. **On plan creation**: Backend checks if `project.measurementPlanId` already exists
2. **If exists**: Returns `400 Bad Request` with message: "Project already has an associated measurement plan"
3. **On success**: Backend updates `project.measurementPlanId = plan._id`

**Unlinking**:

- When plan is deleted, `project.measurementPlanId` is cleared
- If unlinking fails, deletion continues (logged as warning)

---

### Organization Access Control

**Rule**: Users can only access plans belonging to their organization.

**Validation**:

```typescript
if (plan.organizationId !== user.organizationId) {
  throw ForbiddenException("Access denied to this measurement plan");
}
```

**⚠️ Development Mode**: Organization validation is **currently disabled** in development (see `measurement-plans.controller.ts:59-72`)

---

### Required Data Constraints

| Constraint                                | Description                                           |
| ----------------------------------------- | ----------------------------------------------------- |
| Metric must have ≥1 measurement           | Cannot create metric without at least one measurement |
| Control range must have exactly 2 numbers | Array must be `[min, max]` format                     |
| Plan must link to project                 | `associatedProject` is required                       |
| Project must belong to organization       | Cross-organization links are forbidden                |

---

## Examples

### Example 1: Create Complete Plan

**Request**:

```bash
POST /measurement-plans/68c8750f70b5c520bf74c6d7
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "planName": "Sprint 12 Quality Metrics",
  "associatedProject": "68c8751a70b5c520bf74c6db",
  "planResponsible": "Sarah Johnson",
  "objectives": [
    {
      "objectiveTitle": "Maintain code quality standards",
      "questions": [
        {
          "questionText": "What is the code coverage percentage?",
          "metrics": [
            {
              "metricName": "Code Coverage",
              "metricDescription": "Percentage of code covered by automated tests",
              "metricMnemonic": "COV",
              "metricFormula": "(covered_lines / total_lines) * 100",
              "metricControlRange": [80, 100],
              "analysisProcedure": "Review coverage reports after each commit",
              "analysisFrequency": "Per commit",
              "analysisResponsible": "QA Lead",
              "measurements": [
                {
                  "measurementEntity": "Unit Tests",
                  "measurementAcronym": "UT",
                  "measurementProperties": "Line coverage from unit tests",
                  "measurementUnit": "%",
                  "measurementScale": "Ratio",
                  "measurementProcedure": "Run jest --coverage and extract percentage",
                  "measurementFrequency": "Per commit",
                  "measurementResponsible": "CI/CD Pipeline"
                },
                {
                  "measurementEntity": "Integration Tests",
                  "measurementAcronym": "IT",
                  "measurementProperties": "Line coverage from integration tests",
                  "measurementUnit": "%",
                  "measurementScale": "Ratio",
                  "measurementProcedure": "Run integration test suite with coverage",
                  "measurementFrequency": "Per pull request",
                  "measurementResponsible": "QA Team"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Response**: 201 Created with full plan document

---

### Example 2: Add Metric to Existing Plan

**Step 1**: Get plan to find IDs

```bash
GET /measurement-plans/68c8750f70b5c520bf74c6d7/68f591c2ebd60660329957a1
Authorization: Bearer {JWT_TOKEN}
```

**Step 2**: Add metric to specific question

```bash
POST /measurement-plans/68f591c2ebd60660329957a1/objectives/68o591c3ebd60660329957a2/questions/68q591c4ebd60660329957a3/metrics
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "metricName": "Memory Usage",
  "metricDescription": "Average memory consumption",
  "metricMnemonic": "MEM",
  "metricFormula": "AVG(memory_used_bytes) / 1024 / 1024",
  "metricControlRange": [0, 2048],
  "analysisProcedure": "Monitor trends and identify memory leaks",
  "analysisFrequency": "Hourly",
  "measurements": [
    {
      "measurementEntity": "Application Process",
      "measurementAcronym": "APP",
      "measurementProperties": "Resident memory usage",
      "measurementUnit": "MB",
      "measurementScale": "Ratio",
      "measurementProcedure": "Query process metrics from monitoring system",
      "measurementFrequency": "Every 5 minutes"
    }
  ]
}
```

---

### Example 3: Update Plan Status (Draft → Active)

```bash
PUT /measurement-plans/68c8750f70b5c520bf74c6d7/68f591c2ebd60660329957a1
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "status": "active"
}
```

**Response**: 200 OK with updated plan (status changed to "active")

---

### Example 4: List Plans with Filters

```bash
GET /measurement-plans/68c8750f70b5c520bf74c6d7?page=1&limit=20&status=active&search=performance
Authorization: Bearer {JWT_TOKEN}
```

**Response**: Paginated list of active plans containing "performance" in name

---

### Example 5: Error Handling - Duplicate Mnemonic

**Request**:

```bash
POST /measurement-plans/68f591c2ebd60660329957a1/objectives/68o591c3ebd60660329957a2/questions/68q591c4ebd60660329957a3/metrics
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "metricName": "Another CPU Metric",
  "metricMnemonic": "CPU",  // ❌ Already exists in this plan
  "metricControlRange": [0, 100],
  "measurements": [...]
}
```

**Response**: 409 Conflict

```json
{
  "message": "Metric mnemonic \"CPU\" already exists in this plan",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## Best Practices

### 1. Incremental Plan Building

**Recommended Approach**:

```
1. Create minimal plan with 1 objective, 1 question, 1 metric, 1 measurement
2. Use POST endpoints to incrementally add more objectives/questions/metrics
3. Transition to "active" when complete
```

**Why**: Easier to handle validation errors and maintain data consistency.

---

### 2. Mnemonic Naming Convention

**Recommendation**: Use short, descriptive uppercase codes

```
✅ Good: "CPU", "MEM", "API_RT", "ERR"
❌ Bad: "TheCPUMetric", "m1", "metric_for_response_time"
```

---

### 3. Control Range Setting

**Tips**:

- Use realistic ranges based on historical data
- Leave buffer for acceptable variance
- Example: If typical response time is 200-300ms, set range to [0, 500] to allow spikes

---

### 4. Error Recovery

**If plan creation fails mid-way**:

1. Backend transaction ensures atomicity (all or nothing)
2. If plan is created but project linking fails, plan still exists
3. Delete the plan manually if needed and retry

---

### 5. Status Workflow

**Recommended Flow**:

```
draft (build plan) → active (collect data) → completed (archive)
```

**Don't**: Frequently switch between active and draft (creates inconsistency)

---

## Troubleshooting

### Issue: "Project already has an associated measurement plan"

**Cause**: Attempting to create second plan for same project

**Solution**:

1. Check existing plan ID: `GET /projects/:organizationId/:projectId`
2. Either update existing plan or delete it first
3. Create new plan

---

### Issue: "Metric mnemonic already exists"

**Cause**: Using duplicate mnemonic within same plan

**Solution**:

1. Choose different mnemonic
2. Or update existing metric instead of creating new one

---

### Issue: "Cannot delete active plan"

**Cause**: Attempting to delete plan with status = active or completed

**Solution**:

1. Update plan status to `draft`: `PUT /measurement-plans/:orgId/:planId { "status": "draft" }`
2. Then delete: `DELETE /measurement-plans/:orgId/:planId`

---

## Changelog

| Version | Date       | Changes                             |
| ------- | ---------- | ----------------------------------- |
| 1.0     | 2025-10-23 | Initial comprehensive documentation |

---

**For Questions**: Contact Backend Team or open GitHub issue
