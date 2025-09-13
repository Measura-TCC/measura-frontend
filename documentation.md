# Measurement Plans System - Backend Requirements Documentation

## Overview

The frontend is implementing a complete restructure of the measurement plans system to align with new interfaces and create a comprehensive GQM (Goal-Question-Metric) workflow. This document outlines the backend changes required to support the new system architecture.

## Core Data Model Changes

### New Interface Structure

The system now follows a strict hierarchical structure:

```typescript
MeasurementPlan
├── planName: string
├── associatedProject: string (Project ID)
├── planResponsible: string
└── objectives: Objective[]
    └── objectiveTitle: string
    └── questions: Question[]
        └── questionText: string
        └── metrics: Metric[]
            ├── metricName: string (max 50 chars)
            ├── metricDescription: string (max 400 chars)
            ├── metricMnemonic: string (max 3 chars)
            ├── metricFormula: string
            ├── metricControlRange: [number, number]
            ├── analysisProcedure: string (max 1000 chars)
            ├── analysisFrequency: string (max 50 chars)
            ├── analysisResponsible?: string
            └── measurements: Measurement[]
                ├── measurementEntity: string (max 50 chars)
                ├── measurementAcronym: string (max 3 chars)
                ├── measurementProperties: string (max 200 chars)
                ├── measurementUnit: string (max 50 chars)
                ├── measurementScale: string
                ├── measurementProcedure: string (max 1000 chars)
                ├── measurementFrequency: string (max 50 chars)
                └── measurementResponsible?: string
```

## Required API Endpoints

### 1. Measurement Plans Management

#### GET /api/measurement-plans

**Purpose**: Retrieve all measurement plans for the user's organization
**Request**: No body required
**Response**:

```json
{
  "data": [
    {
      "id": "string",
      "planName": "string",
      "associatedProject": "string",
      "planResponsible": "string",
      "status": "draft|active|completed",
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string",
      "objectivesCount": "number",
      "questionsCount": "number",
      "metricsCount": "number",
      "measurementsCount": "number",
      "progress": "number (0-100)"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### POST /api/measurement-plans

**Purpose**: Create a new measurement plan
**Request**:

```json
{
  "planName": "string",
  "associatedProject": "string",
  "planResponsible": "string",
  "objectives": [
    {
      "objectiveTitle": "string",
      "questions": [
        {
          "questionText": "string",
          "metrics": [
            {
              "metricName": "string",
              "metricDescription": "string",
              "metricMnemonic": "string",
              "metricFormula": "string",
              "metricControlRange": [0, 100],
              "analysisProcedure": "string",
              "analysisFrequency": "string",
              "analysisResponsible": "string",
              "measurements": [
                {
                  "measurementEntity": "string",
                  "measurementAcronym": "string",
                  "measurementProperties": "string",
                  "measurementUnit": "string",
                  "measurementScale": "string",
                  "measurementProcedure": "string",
                  "measurementFrequency": "string",
                  "measurementResponsible": "string"
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

**Response**:

```json
{
  "id": "string",
  "planName": "string",
  "associatedProject": "string",
  "planResponsible": "string",
  "objectives": "... (full structure)",
  "status": "draft",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

#### GET /api/measurement-plans/:id

**Purpose**: Retrieve a specific measurement plan with full details
**Request**: Plan ID in URL parameter
**Response**:

```json
{
  "id": "string",
  "planName": "string",
  "associatedProject": "string",
  "planResponsible": "string",
  "objectives": [
    {
      "objectiveTitle": "string",
      "questions": [
        {
          "questionText": "string",
          "metrics": [
            {
              "metricName": "string",
              "metricDescription": "string",
              "metricMnemonic": "string",
              "metricFormula": "string",
              "metricControlRange": [0, 100],
              "analysisProcedure": "string",
              "analysisFrequency": "string",
              "analysisResponsible": "string",
              "measurements": [
                {
                  "measurementEntity": "string",
                  "measurementAcronym": "string",
                  "measurementProperties": "string",
                  "measurementUnit": "string",
                  "measurementScale": "string",
                  "measurementProcedure": "string",
                  "measurementFrequency": "string",
                  "measurementResponsible": "string"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "status": "string",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

#### PUT /api/measurement-plans/:id

**Purpose**: Update an existing measurement plan
**Request**: Same structure as POST
**Response**: Updated plan object

#### DELETE /api/measurement-plans/:id

**Purpose**: Delete a measurement plan
**Request**: Plan ID in URL parameter
**Response**:

```json
{
  "success": true,
  "message": "Plan deleted successfully"
}
```

### 2. Organization Integration

#### GET /api/organizations/:organizationId/objectives

**Purpose**: Retrieve strategic objectives from organization for plan creation
**Request**: Organization ID in URL parameter
**Response**:

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "order": "number"
    }
  ]
}
```

**Note**: These should be parsed from the organization's `organizationalObjectives` field, splitting by newlines and removing numbering.

#### Organization CRUD Updates
**Purpose**: Update existing organization endpoints to include objectives field

**POST /api/organizations**
```json
{
  "name": "Acme Corporation",
  "description": "A leading technology company focused on innovation",
  "website": "https://www.acme.com",
  "industry": "Technology",
  "mission": "To innovate and deliver cutting-edge technology solutions",
  "vision": "To be the global leader in technology innovation",
  "values": "Innovation, Integrity, Excellence, Customer Focus",
  "organizationalObjectives": "1) Increase market share by 25%\n2) Launch 3 new product lines\n3) Expand to 5 new markets\n4) Achieve 95% customer satisfaction\n5) Reduce operational costs by 15%"
}
```

**GET /api/organizations/:id** (Response)
```json
{
  "_id": "string",
  "name": "Acme Corporation",
  "description": "A leading technology company focused on innovation",
  "website": "https://www.acme.com",
  "industry": "Technology",
  "mission": "To innovate and deliver cutting-edge technology solutions",
  "vision": "To be the global leader in technology innovation", 
  "values": "Innovation, Integrity, Excellence, Customer Focus",
  "organizationalObjectives": "1) Increase market share by 25%\n2) Launch 3 new product lines\n3) Expand to 5 new markets\n4) Achieve 95% customer satisfaction\n5) Reduce operational costs by 15%",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string",
  "createdBy": "ObjectId"
}
```

**PUT /api/organizations/:id** (Request - same as POST)
```json
{
  "name": "Acme Corporation",
  "description": "A leading technology company focused on innovation",
  "website": "https://www.acme.com", 
  "industry": "Technology",
  "mission": "To innovate and deliver cutting-edge technology solutions",
  "vision": "To be the global leader in technology innovation",
  "values": "Innovation, Integrity, Excellence, Customer Focus",
  "organizationalObjectives": "1) Increase market share by 25%\n2) Launch 3 new product lines\n3) Expand to 5 new markets\n4) Achieve 95% customer satisfaction\n5) Reduce operational costs by 15%"
}
```

#### GET /api/organizations/:organizationId/measurements

**Purpose**: Retrieve predefined measurements for the organization
**Request**: Organization ID in URL parameter
**Response**:

```json
{
  "data": [
    {
      "measurementEntity": "string",
      "measurementAcronym": "string",
      "measurementProperties": "string",
      "measurementUnit": "string",
      "measurementScale": "string",
      "measurementProcedure": "string",
      "measurementFrequency": "string",
      "measurementResponsible": "string"
    }
  ]
}
```

### 3. Export Functionality

#### POST /api/measurement-plans/:id/export

**Purpose**: Generate PDF or DOCX export of measurement plan
**Request**:

```json
{
  "format": "pdf|docx",
  "options": {
    "includeDetails": true,
    "includeMeasurements": true,
    "includeAnalysis": true
  }
}
```

**Response**:

```json
{
  "downloadUrl": "string",
  "filename": "string",
  "expiresAt": "ISO 8601 string"
}
```

## MongoDB Collection Schema Requirements

### measurementPlans Collection

```javascript
{
  _id: ObjectId,
  planName: String, // required, max 255 chars
  associatedProject: ObjectId, // reference to projects collection
  planResponsible: String, // required, max 255 chars
  organizationId: ObjectId, // reference to organizations collection
  status: String, // enum: ['draft', 'active', 'completed'], default: 'draft'
  createdAt: Date, // default: new Date()
  updatedAt: Date, // default: new Date()
  createdBy: ObjectId, // reference to users collection
  
  // Embedded objectives array
  objectives: [
    {
      _id: ObjectId,
      objectiveTitle: String, // required
      orderIndex: Number, // required
      
      // Embedded questions array
      questions: [
        {
          _id: ObjectId,
          questionText: String, // required
          orderIndex: Number, // required
          
          // Embedded metrics array
          metrics: [
            {
              _id: ObjectId,
              metricName: String, // required, max 50 chars
              metricDescription: String, // required, max 400 chars
              metricMnemonic: String, // required, max 3 chars
              metricFormula: String, // required
              metricControlRange: [Number, Number], // [min, max]
              analysisProcedure: String, // required, max 1000 chars
              analysisFrequency: String, // required, max 50 chars
              analysisResponsible: String, // optional, max 255 chars
              orderIndex: Number, // required
              
              // Embedded measurements array
              measurements: [
                {
                  _id: ObjectId,
                  measurementEntity: String, // required, max 50 chars
                  measurementAcronym: String, // required, max 3 chars
                  measurementProperties: String, // required, max 200 chars
                  measurementUnit: String, // required, max 50 chars
                  measurementScale: String, // required
                  measurementProcedure: String, // required, max 1000 chars
                  measurementFrequency: String, // required, max 50 chars
                  measurementResponsible: String, // optional, max 255 chars
                  orderIndex: Number // required
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

### organizationMeasurements Collection (for predefined measurements)

```javascript
{
  _id: ObjectId,
  organizationId: ObjectId, // reference to organizations collection
  measurementEntity: String, // required, max 50 chars
  measurementAcronym: String, // required, max 3 chars
  measurementProperties: String, // required, max 200 chars
  measurementUnit: String, // required, max 50 chars
  measurementScale: String, // required
  measurementProcedure: String, // required, max 1000 chars
  measurementFrequency: String, // required, max 50 chars
  measurementResponsible: String, // optional, max 255 chars
  isActive: Boolean, // default: true
  createdAt: Date, // default: new Date()
  updatedAt: Date // default: new Date()
}
```

### MongoDB Schema Validation

```javascript
// measurementPlans collection validation
db.createCollection("measurementPlans", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["planName", "associatedProject", "planResponsible", "organizationId", "createdBy"],
      properties: {
        planName: {
          bsonType: "string",
          maxLength: 255
        },
        associatedProject: {
          bsonType: "objectId"
        },
        planResponsible: {
          bsonType: "string",
          maxLength: 255
        },
        organizationId: {
          bsonType: "objectId"
        },
        status: {
          bsonType: "string",
          enum: ["draft", "active", "completed"]
        },
        createdBy: {
          bsonType: "objectId"
        },
        objectives: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["objectiveTitle", "orderIndex"],
            properties: {
              objectiveTitle: {
                bsonType: "string"
              },
              orderIndex: {
                bsonType: "number"
              },
              questions: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["questionText", "orderIndex"],
                  properties: {
                    questionText: {
                      bsonType: "string"
                    },
                    orderIndex: {
                      bsonType: "number"
                    },
                    metrics: {
                      bsonType: "array",
                      items: {
                        bsonType: "object",
                        required: ["metricName", "metricDescription", "metricMnemonic", "metricFormula", "metricControlRange", "analysisProcedure", "analysisFrequency", "orderIndex"],
                        properties: {
                          metricName: {
                            bsonType: "string",
                            maxLength: 50
                          },
                          metricDescription: {
                            bsonType: "string", 
                            maxLength: 400
                          },
                          metricMnemonic: {
                            bsonType: "string",
                            maxLength: 3
                          },
                          metricFormula: {
                            bsonType: "string"
                          },
                          metricControlRange: {
                            bsonType: "array",
                            items: {
                              bsonType: "number"
                            },
                            minItems: 2,
                            maxItems: 2
                          },
                          analysisProcedure: {
                            bsonType: "string",
                            maxLength: 1000
                          },
                          analysisFrequency: {
                            bsonType: "string",
                            maxLength: 50
                          },
                          analysisResponsible: {
                            bsonType: "string",
                            maxLength: 255
                          },
                          orderIndex: {
                            bsonType: "number"
                          },
                          measurements: {
                            bsonType: "array",
                            items: {
                              bsonType: "object",
                              required: ["measurementEntity", "measurementAcronym", "measurementProperties", "measurementUnit", "measurementScale", "measurementProcedure", "measurementFrequency", "orderIndex"],
                              properties: {
                                measurementEntity: {
                                  bsonType: "string",
                                  maxLength: 50
                                },
                                measurementAcronym: {
                                  bsonType: "string",
                                  maxLength: 3
                                },
                                measurementProperties: {
                                  bsonType: "string",
                                  maxLength: 200
                                },
                                measurementUnit: {
                                  bsonType: "string",
                                  maxLength: 50
                                },
                                measurementScale: {
                                  bsonType: "string"
                                },
                                measurementProcedure: {
                                  bsonType: "string",
                                  maxLength: 1000
                                },
                                measurementFrequency: {
                                  bsonType: "string",
                                  maxLength: 50
                                },
                                measurementResponsible: {
                                  bsonType: "string",
                                  maxLength: 255
                                },
                                orderIndex: {
                                  bsonType: "number"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

// organizationMeasurements collection validation
db.createCollection("organizationMeasurements", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["organizationId", "measurementEntity", "measurementAcronym", "measurementProperties", "measurementUnit", "measurementScale", "measurementProcedure", "measurementFrequency"],
      properties: {
        organizationId: {
          bsonType: "objectId"
        },
        measurementEntity: {
          bsonType: "string",
          maxLength: 50
        },
        measurementAcronym: {
          bsonType: "string",
          maxLength: 3
        },
        measurementProperties: {
          bsonType: "string",
          maxLength: 200
        },
        measurementUnit: {
          bsonType: "string",
          maxLength: 50
        },
        measurementScale: {
          bsonType: "string"
        },
        measurementProcedure: {
          bsonType: "string",
          maxLength: 1000
        },
        measurementFrequency: {
          bsonType: "string",
          maxLength: 50
        },
        measurementResponsible: {
          bsonType: "string",
          maxLength: 255
        },
        isActive: {
          bsonType: "bool"
        }
      }
    }
  }
});

// organizations collection validation (updated)
db.runCommand({
  collMod: "organizations",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 255
        },
        description: {
          bsonType: "string",
          maxLength: 1000
        },
        website: {
          bsonType: "string"
        },
        industry: {
          bsonType: "string",
          maxLength: 100
        },
        mission: {
          bsonType: "string",
          maxLength: 2000
        },
        vision: {
          bsonType: "string",
          maxLength: 2000
        },
        values: {
          bsonType: "string",
          maxLength: 2000
        },
        organizationalObjectives: {
          bsonType: "string",
          maxLength: 5000
        }
      }
    }
  }
});
```

## Validation Requirements

### Field Length Limits

- `metricName`: 50 characters
- `metricDescription`: 400 characters
- `metricMnemonic`: 3 characters
- `analysisProcedure`: 1000 characters
- `analysisFrequency`: 50 characters
- `measurementEntity`: 50 characters
- `measurementAcronym`: 3 characters
- `measurementProperties`: 200 characters
- `measurementUnit`: 50 characters
- `measurementProcedure`: 1000 characters
- `measurementFrequency`: 50 characters

### Required Fields

All fields are required except:

- `analysisResponsible` (optional)
- `measurementResponsible` (optional)

### Business Rules

1. Each plan must belong to an organization
2. Plans can only be created by organization members
3. Associated project must exist and belong to the same organization
4. Metric mnemonics should be unique within a plan
5. Measurement acronyms should be unique within a metric

## Authentication & Authorization

### Required Permissions

- `measurement_plans:create` - Create new plans
- `measurement_plans:read` - View plans
- `measurement_plans:update` - Edit plans
- `measurement_plans:delete` - Delete plans
- `measurement_plans:export` - Export plans

### Access Control

- Users can only access plans from their organization
- Plan creators have full access to their plans
- Organization admins have access to all organization plans

## Export System Requirements

### PDF Export

- Include plan header with name, project, responsible
- Hierarchical structure: Objectives → Questions → Metrics → Measurements
- Professional formatting with proper typography
- Include summary statistics (counts of objectives, questions, metrics, measurements)

### DOCX Export

- Similar structure to PDF
- Editable format for further customization
- Include tables for measurements and analysis details

### File Handling

- Generate temporary download links
- Auto-delete exported files after 24 hours
- Support concurrent export requests
- Include proper error handling for export failures

## Migration Requirements

### Data Migration

If existing measurement plan data exists:

1. Map existing data to new embedded document structure
2. Preserve hierarchical relationships within documents
3. Set default values for new required fields
4. Convert relational references to embedded documents or ObjectId references

### Backward Compatibility

- Provide migration scripts for existing data
- Maintain API versioning if needed
- Document breaking changes clearly

## Performance Considerations

### MongoDB Indexes

```javascript
// Performance indexes for measurementPlans collection
db.measurementPlans.createIndex({ organizationId: 1 });
db.measurementPlans.createIndex({ associatedProject: 1 });
db.measurementPlans.createIndex({ createdBy: 1 });
db.measurementPlans.createIndex({ status: 1 });
db.measurementPlans.createIndex({ createdAt: -1 });
db.measurementPlans.createIndex({ organizationId: 1, status: 1 });

// Text search index for plan names
db.measurementPlans.createIndex({ planName: "text" });

// Compound index for efficient queries
db.measurementPlans.createIndex({ 
  organizationId: 1, 
  status: 1, 
  createdAt: -1 
});

// Indexes for organizationMeasurements collection
db.organizationMeasurements.createIndex({ organizationId: 1 });
db.organizationMeasurements.createIndex({ isActive: 1 });
db.organizationMeasurements.createIndex({ 
  organizationId: 1, 
  isActive: 1 
});

// Text search for measurements
db.organizationMeasurements.createIndex({ 
  measurementEntity: "text", 
  measurementProperties: "text" 
});
```

### Caching Strategy

- Cache organization objectives for 1 hour
- Cache predefined measurements for 30 minutes
- No caching for plan data (real-time updates required)

### MongoDB Aggregation Queries

#### Count Statistics for Plan Summary
```javascript
db.measurementPlans.aggregate([
  { $match: { organizationId: ObjectId("...") } },
  { $unwind: "$objectives" },
  { $unwind: "$objectives.questions" },
  { $unwind: "$objectives.questions.metrics" },
  { $unwind: "$objectives.questions.metrics.measurements" },
  {
    $group: {
      _id: "$_id",
      planName: { $first: "$planName" },
      objectivesCount: { $addToSet: "$objectives._id" },
      questionsCount: { $addToSet: "$objectives.questions._id" },
      metricsCount: { $addToSet: "$objectives.questions.metrics._id" },
      measurementsCount: { $addToSet: "$objectives.questions.metrics.measurements._id" }
    }
  },
  {
    $project: {
      planName: 1,
      objectivesCount: { $size: "$objectivesCount" },
      questionsCount: { $size: "$questionsCount" },
      metricsCount: { $size: "$metricsCount" },
      measurementsCount: { $size: "$measurementsCount" }
    }
  }
]);
```

#### Search Plans by Content
```javascript
db.measurementPlans.aggregate([
  { $match: { 
    organizationId: ObjectId("..."),
    $text: { $search: "search_term" }
  }},
  { $project: {
    planName: 1,
    associatedProject: 1,
    planResponsible: 1,
    status: 1,
    score: { $meta: "textScore" }
  }},
  { $sort: { score: { $meta: "textScore" } } }
]);
```

### Document Design Considerations

#### Embedded vs Referenced Documents
- **Embedded**: Objectives, Questions, Metrics, Measurements (for atomic operations)
- **Referenced**: Projects, Organizations, Users (for data consistency)

#### Document Size Limitations
- Monitor document size (16MB limit in MongoDB)
- Consider pagination for plans with many measurements
- Use projection to limit returned fields when appropriate

#### Atomic Operations
- All objectives/questions/metrics/measurements operations are atomic within a single plan
- Use MongoDB transactions for operations affecting multiple documents

## Error Handling

### Expected Error Scenarios

1. Invalid project association
2. Field length violations
3. Missing required fields
4. Duplicate mnemonic/acronym conflicts
5. Organization permission issues
6. Export generation failures

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field validation failed",
    "details": [
      {
        "field": "metricName",
        "message": "Must be 50 characters or less"
      }
    ]
  }
}
```

## Testing Requirements

### Unit Tests Required

- Field validation for all character limits
- Business rule enforcement
- Permission checking
- Data transformation logic

### Integration Tests Required

- Full CRUD operations for plans
- Export functionality
- Organization integration
- Cross-entity relationships

### Performance Tests

- Plan creation with large number of measurements
- Export generation for complex plans
- Concurrent user access

## Legacy Endpoints to Remove Immediately

The following existing endpoint sections can be **removed immediately** since the frontend does not currently use them:

### ❌ Remove These Sections Now:
- **Goals** - Not used by frontend, replace with measurement plans objectives
- **Plans** - Not used by frontend, replace with measurement plans CRUD
- **Plan Export/Import** - Not used by frontend, replace with measurement plans export
- **Objectives** - Not used by frontend, now embedded within measurement plans
- **GQM** - Not used by frontend, integrated into measurement plans workflow
- **Metrics** - Not used by frontend, now embedded within measurement plans structure

### ✅ Implement New System:
- **Measurement Plans Management** (as documented above)
- **Organization Integration** (as documented above)
- **Export Functionality** (as documented above)

## Implementation Approach

**Safe to implement immediately** since there are no frontend dependencies on legacy endpoints:

1. **Remove legacy endpoints and database collections**
2. **Implement new measurement plans CRUD operations**
3. **Update organization endpoints with new fields** 
4. **Implement export functionality**

**No migration or backward compatibility concerns** - clean slate implementation.

This documentation provides the complete backend requirements for supporting the new measurement plans system architecture.
