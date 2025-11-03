#!/usr/bin/env ts-node
/**
 * Test script to create an FPA estimate with EQ components using special calculation
 * This tests the complete workflow from frontend to backend
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const ORGANIZATION_ID = process.env.ORGANIZATION_ID;
const PROJECT_ID = process.env.PROJECT_ID;

if (!AUTH_TOKEN || !ORGANIZATION_ID || !PROJECT_ID) {
  console.error('Error: Missing required environment variables');
  console.error('Please set: AUTH_TOKEN, ORGANIZATION_ID, PROJECT_ID');
  process.exit(1);
}

interface CreateEstimatePayload {
  name: string;
  description: string;
  projectId: string;
  countType: 'DEVELOPMENT_PROJECT' | 'ENHANCEMENT_PROJECT' | 'APPLICATION_PROJECT';
  applicationBoundary: string;
  countingScope: string;
  averageDailyWorkingHours?: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor?: number;
  requirements?: Array<{
    title: string;
    description?: string;
    source: 'manual' | 'csv' | 'jira' | 'github' | 'azure_devops' | 'clickup';
    sourceReference?: string;
    componentType: 'ALI' | 'AIE' | 'EI' | 'EO' | 'EQ';
    fpaData: any;
  }>;
}

async function createEstimate() {
  console.log('🚀 Creating FPA Estimate with EQ Components...\n');

  const payload: CreateEstimatePayload = {
    name: 'Test Estimate - EQ Special Calculation',
    description: 'Testing EQ components with special input/output complexity calculation to validate frontend integration with backend API',
    projectId: PROJECT_ID!,
    countType: 'DEVELOPMENT_PROJECT',
    applicationBoundary: 'Customer management system including search, reporting, and data retrieval functionality',
    countingScope: 'All customer query and search features including basic and advanced search capabilities',
    averageDailyWorkingHours: 8,
    teamSize: 4,
    hourlyRateBRL: 150.0,
    productivityFactor: 10,
    requirements: [
      // Standard EQ component (no special calculation)
      {
        title: 'Basic Customer Search',
        description: 'Simple customer search by ID or name',
        source: 'manual',
        componentType: 'EQ',
        fpaData: {
          name: 'Basic Customer Search Query',
          description: 'Simple search returning basic customer information',
          fileTypesReferenced: 2,
          dataElementTypes: 8,
          primaryIntent: 'Allow users to quickly find customers by ID or name',
          retrievalLogic: 'Direct database lookup with exact match on ID or partial match on name',
          outputFormat: 'JSON with customer ID, name, email, and phone',
        },
      },
      // EQ with special calculation (asymmetric complexity)
      {
        title: 'Advanced Customer Analytics Query',
        description: 'Complex query with simple input but rich output data',
        source: 'manual',
        componentType: 'EQ',
        fpaData: {
          name: 'Customer Analytics Report Query',
          description: 'Advanced analytics query joining multiple tables to provide comprehensive customer insights',
          fileTypesReferenced: 5, // Auto: inputFtr (1) + outputFtr (4)
          dataElementTypes: 27,   // Auto: inputDet (3) + outputDet (24)
          // Special calculation fields - Input is simple, output is complex
          inputFtr: 1,  // Only filter parameters table
          inputDet: 3,  // Date range (start, end) + customer segment
          outputFtr: 4, // Customers, Orders, Payments, Feedback tables
          outputDet: 24, // Many output fields: customer details, order summaries, payment history, ratings, etc.
          primaryIntent: 'Provide comprehensive customer analytics including purchase history, payment patterns, and feedback trends',
          retrievalLogic: 'Joins customer, orders, payments, and feedback tables. Aggregates data by period. Calculates lifetime value, average order value, and satisfaction scores.',
          outputFormat: 'Detailed JSON report with customer profile, purchase statistics, payment analysis, and feedback summary',
          notes: 'Uses special calculation because input (3 simple filter parameters) has LOW complexity while output (24 fields from 4 tables) has HIGH complexity. Final complexity = HIGH (max of input and output)',
        },
      },
      // EQ with special calculation (symmetric complexity)
      {
        title: 'Order Status Inquiry',
        description: 'Query with moderate complexity on both input and output',
        source: 'manual',
        componentType: 'EQ',
        fpaData: {
          name: 'Order Status Query with Filters',
          description: 'Search orders with multiple filters and return detailed status information',
          fileTypesReferenced: 4, // Auto: inputFtr (2) + outputFtr (2)
          dataElementTypes: 18,   // Auto: inputDet (8) + outputDet (10)
          // Special calculation fields - Both medium complexity
          inputFtr: 2,  // Filters table + Customer table
          inputDet: 8,  // Order ID, customer ID, date range (2), status filter, payment status, shipping status, product category
          outputFtr: 2, // Orders table + Shipping table
          outputDet: 10, // Order ID, status, total, date, customer name, shipping address, tracking number, estimated delivery, payment status, notes
          primaryIntent: 'Allow support team to query orders with flexible filtering and view detailed status',
          retrievalLogic: 'Filters orders by multiple criteria, joins with shipping data, calculates estimated delivery dates',
          outputFormat: 'List of orders with complete status information and shipping details',
          notes: 'Uses special calculation with medium complexity on both sides. Input: 2 FTR × 8 DET = MEDIUM. Output: 2 FTR × 10 DET = MEDIUM. Final = MEDIUM',
        },
      },
      // Standard ALI for reference
      {
        title: 'Customer Master Data',
        description: 'Main customer information file',
        source: 'manual',
        componentType: 'ALI',
        fpaData: {
          name: 'Customer Entity',
          description: 'Central repository for customer information',
          recordElementTypes: 3,
          dataElementTypes: 18,
          primaryIntent: 'Store and maintain customer profile and contact information',
        },
      },
      // Standard EI for reference
      {
        title: 'Create New Customer',
        description: 'Add new customer to system',
        source: 'manual',
        componentType: 'EI',
        fpaData: {
          name: 'Customer Registration Transaction',
          description: 'Process to add new customer with validation',
          fileTypesReferenced: 2,
          dataElementTypes: 15,
          primaryIntent: 'Register new customers with complete profile information',
          processingLogic: 'Validate email uniqueness, check required fields, create customer record, send welcome email',
        },
      },
    ],
  };

  console.log('📋 Estimate Details:');
  console.log(`   Name: ${payload.name}`);
  console.log(`   Project ID: ${payload.projectId}`);
  console.log(`   Team Size: ${payload.teamSize}`);
  console.log(`   Requirements: ${payload.requirements?.length}\n`);

  console.log('📊 Component Breakdown:');
  payload.requirements?.forEach((req, idx) => {
    console.log(`   ${idx + 1}. [${req.componentType}] ${req.title}`);
    if (req.componentType === 'EQ') {
      const data = req.fpaData;
      if (data.inputFtr !== undefined) {
        console.log(`      🔍 Special Calculation: YES`);
        console.log(`      Input:  ${data.inputFtr} FTR × ${data.inputDet} DET`);
        console.log(`      Output: ${data.outputFtr} FTR × ${data.outputDet} DET`);
        console.log(`      Total:  ${data.fileTypesReferenced} FTR × ${data.dataElementTypes} DET`);
      } else {
        console.log(`      🔍 Special Calculation: NO`);
        console.log(`      Standard: ${data.fileTypesReferenced} FTR × ${data.dataElementTypes} DET`);
      }
    }
  });

  console.log('\n🌐 Sending request to backend...');
  console.log(`   URL: ${API_BASE_URL}/estimates/${ORGANIZATION_ID}\n`);

  try {
    const response = await fetch(`${API_BASE_URL}/estimates/${ORGANIZATION_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:');
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Body: ${errorText}`);

      try {
        const errorJson = JSON.parse(errorText);
        console.error('\n📄 Error Details:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch {
        // Error is not JSON
      }

      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Estimate created successfully!\n');
    console.log('📄 Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n✨ Test completed successfully!');

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Estimate ID: ${result._id || result.id || 'N/A'}`);
    console.log(`   Total Components: ${result.components?.length || 'N/A'}`);
    if (result.functionPoints !== undefined) {
      console.log(`   Function Points: ${result.functionPoints}`);
    }
    if (result.adjustedFunctionPoints !== undefined) {
      console.log(`   Adjusted FP: ${result.adjustedFunctionPoints}`);
    }

  } catch (error) {
    console.error('❌ Request failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      console.error(`\n${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the test
createEstimate();
