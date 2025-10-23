/**
 * Test script for Requirements-Based FPA API Integration
 *
 * This script tests:
 * 1. Estimate creation with requirements
 * 2. Requirements CRUD operations
 * 3. FPA Components CRUD operations
 *
 * Usage: ts-node scripts/test-requirements-fpa.ts
 */

import type {
  RequirementWithFpaDataInput,
  AdjustmentFactorsInput,
} from '../src/core/schemas/fpa';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
const ORGANIZATION_ID = process.env.ORGANIZATION_ID || '';
const PROJECT_ID = process.env.PROJECT_ID || '';

interface TestResults {
  passed: number;
  failed: number;
  tests: Array<{
    name: string;
    status: 'PASS' | 'FAIL';
    error?: string;
  }>;
}

const results: TestResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name: string, passed: boolean, error?: string) {
  results.tests.push({
    name,
    status: passed ? 'PASS' : 'FAIL',
    error,
  });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.error(`❌ ${name}`);
    if (error) console.error(`   Error: ${error}`);
  }
}

async function makeRequest(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = response.ok ? await response.json() : null;

  return { response, data };
}

// Test Data
const testRequirements: RequirementWithFpaDataInput[] = [
  {
    title: 'User Account Management',
    description: 'Store and maintain user profile data',
    source: 'manual',
    componentType: 'ALI',
    fpaData: {
      name: 'User Data File',
      description: 'Internal logical file storing user account information',
      recordElementTypes: 3,
      dataElementTypes: 25,
      primaryIntent: 'Maintain user account data',
      dataGroups: ['Users', 'Profiles', 'Authentication'],
    },
  },
  {
    title: 'Payment Gateway Interface',
    description: 'Interface to external payment processor',
    source: 'manual',
    componentType: 'AIE',
    fpaData: {
      name: 'Payment Gateway Reference',
      description: 'External interface file for payment data',
      recordElementTypes: 2,
      dataElementTypes: 15,
      primaryIntent: 'Reference payment transaction data',
      externalSystem: 'Stripe Payment API',
      dataGroups: ['Transactions', 'PaymentMethods'],
    },
  },
  {
    title: 'Create Order',
    description: 'Process new order with validation',
    source: 'manual',
    componentType: 'EI',
    fpaData: {
      name: 'Order Creation Transaction',
      description: 'External input for creating orders',
      fileTypesReferenced: 4,
      dataElementTypes: 18,
      primaryIntent: 'Process and validate new order creation',
      processingLogic: 'Validate items, calculate totals, create order',
      validationRules: ['Item availability', 'Price validation'],
    },
  },
  {
    title: 'Order History Report',
    description: 'Display customer order history',
    source: 'manual',
    componentType: 'EO',
    fpaData: {
      name: 'Order History Display',
      description: 'External output showing order history',
      fileTypesReferenced: 3,
      dataElementTypes: 22,
      primaryIntent: 'Display formatted order history',
      outputFormat: 'Paginated list with filtering',
      calculationFormulas: ['Total amount', 'Tax calculation'],
    },
  },
  {
    title: 'Product Search',
    description: 'Search products by keyword',
    source: 'manual',
    componentType: 'EQ',
    fpaData: {
      name: 'Product Search Query',
      description: 'External query for product search',
      fileTypesReferenced: 2,
      dataElementTypes: 12,
      primaryIntent: 'Search and retrieve product information',
      retrievalLogic: 'Full-text search with filters',
      outputFormat: 'JSON array of products',
    },
  },
];

const testAdjustmentFactors: AdjustmentFactorsInput = {
  dataCommunications: 3,
  distributedDataProcessing: 2,
  performance: 4,
  heavilyUsedConfiguration: 3,
  transactionRate: 4,
  onlineDataEntry: 5,
  endUserEfficiency: 4,
  onlineUpdate: 5,
  complexProcessing: 3,
  reusability: 4,
  installationEase: 3,
  operationalEase: 4,
  multipleSites: 2,
  facilitateChange: 4,
};

async function runTests() {
  console.log('🧪 Starting Requirements-Based FPA API Tests\n');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Organization ID: ${ORGANIZATION_ID}`);
  console.log(`Project ID: ${PROJECT_ID}\n`);

  if (!AUTH_TOKEN || !ORGANIZATION_ID || !PROJECT_ID) {
    console.error('❌ Missing required environment variables:');
    console.error('   - AUTH_TOKEN');
    console.error('   - ORGANIZATION_ID');
    console.error('   - PROJECT_ID');
    process.exit(1);
  }

  let estimateId: string = '';
  let requirementIds: string[] = [];

  // Test 1: Create Estimate with Requirements
  console.log('\n📝 Test 1: Create Estimate with Requirements\n');
  try {
    const { response, data } = await makeRequest(
      `/estimates/${ORGANIZATION_ID}`,
      'POST',
      {
        projectId: PROJECT_ID,
        name: 'E-Commerce Platform - Requirements Test',
        description:
          'Testing requirements-based FPA workflow with all component types',
        countType: 'DEVELOPMENT_PROJECT',
        applicationBoundary:
          'E-commerce system including user management, products, orders, and payments',
        countingScope: 'All new functionality for user accounts and orders',
        teamSize: 5,
        hourlyRateBRL: 150.0,
        requirements: testRequirements,
        adjustmentFactors: testAdjustmentFactors,
      }
    );

    if (response.status === 201 && data) {
      estimateId = data._id;
      logTest('Create estimate with requirements', true);
      logTest(
        'Estimate has requirements array',
        Array.isArray(data.internalLogicalFiles) &&
          Array.isArray(data.externalInterfaceFiles)
      );
      logTest('Function points calculated', data.adjustedFunctionPoints > 0);
    } else {
      logTest('Create estimate with requirements', false, response.statusText);
    }
  } catch (error) {
    logTest(
      'Create estimate with requirements',
      false,
      error instanceof Error ? error.message : String(error)
    );
  }

  if (!estimateId) {
    console.error('\n❌ Cannot continue tests without estimate ID');
    printResults();
    process.exit(1);
  }

  // Test 2: Get All Requirements
  console.log('\n📝 Test 2: Get All Requirements\n');
  try {
    const { response, data } = await makeRequest(
      `/estimates/${estimateId}/requirements`
    );

    if (response.ok && Array.isArray(data)) {
      requirementIds = data.map((r: { _id: string }) => r._id);
      logTest('Get all requirements', data.length === 5);
      logTest('Requirements have component IDs', data.every((r: { componentId: string }) => r.componentId));
    } else {
      logTest('Get all requirements', false, response.statusText);
    }
  } catch (error) {
    logTest(
      'Get all requirements',
      false,
      error instanceof Error ? error.message : String(error)
    );
  }

  // Test 3: Get Single Requirement
  if (requirementIds.length > 0) {
    console.log('\n📝 Test 3: Get Single Requirement\n');
    try {
      const { response, data } = await makeRequest(
        `/estimates/${estimateId}/requirements/${requirementIds[0]}`
      );

      logTest('Get single requirement', response.ok && data._id === requirementIds[0]);
    } catch (error) {
      logTest(
        'Get single requirement',
        false,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Test 4: Update Requirement
  if (requirementIds.length > 0) {
    console.log('\n📝 Test 4: Update Requirement\n');
    try {
      const { response, data } = await makeRequest(
        `/estimates/${estimateId}/requirements/${requirementIds[0]}`,
        'PUT',
        {
          title: 'User Account Management - Updated',
          description: 'Updated description for testing',
        }
      );

      logTest('Update requirement', response.ok && data.title.includes('Updated'));
    } catch (error) {
      logTest(
        'Update requirement',
        false,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Test 5: Delete Requirement
  if (requirementIds.length > 1) {
    console.log('\n📝 Test 5: Delete Requirement (Cascading)\n');
    try {
      const { response } = await makeRequest(
        `/estimates/${estimateId}/requirements/${requirementIds[1]}`,
        'DELETE'
      );

      logTest('Delete requirement', response.status === 204 || response.ok);

      // Verify requirement is deleted
      const { response: getResponse } = await makeRequest(
        `/estimates/${estimateId}/requirements`
      );
      if (getResponse.ok) {
        const remainingReqs = await getResponse.json();
        logTest('Requirement deleted successfully', remainingReqs.length === 4);
      }
    } catch (error) {
      logTest(
        'Delete requirement',
        false,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Test 6: Component CRUD Operations
  console.log('\n📝 Test 6: FPA Component CRUD Operations\n');

  // Test ALI Component
  try {
    const { response: createResp, data: aliData } = await makeRequest(
      `/ali/${estimateId}`,
      'POST',
      {
        name: 'Test ALI Component',
        description: 'Testing ALI CRUD operations',
        recordElementTypes: 2,
        dataElementTypes: 15,
        primaryIntent: 'Test primary intent for ALI component operations',
      }
    );

    logTest('Create ALI component', createResp.status === 201 && aliData);

    if (aliData && aliData._id) {
      // Get all ALIs
      const { response: getAllResp } = await makeRequest(`/ali/${estimateId}`);
      logTest('Get all ALI components', getAllResp.ok);

      // Get single ALI
      const { response: getSingleResp } = await makeRequest(`/ali/${aliData._id}`);
      logTest('Get single ALI component', getSingleResp.ok);

      // Update ALI
      const { response: updateResp } = await makeRequest(
        `/ali/${aliData._id}`,
        'PUT',
        { name: 'Test ALI Component - Updated' }
      );
      logTest('Update ALI component', updateResp.ok);

      // Delete ALI
      const { response: deleteResp } = await makeRequest(
        `/ali/${aliData._id}`,
        'DELETE'
      );
      logTest('Delete ALI component', deleteResp.ok || deleteResp.status === 204);
    }
  } catch (error) {
    logTest(
      'ALI component CRUD',
      false,
      error instanceof Error ? error.message : String(error)
    );
  }

  // Print Final Results
  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter((t) => t.status === 'FAIL')
      .forEach((t) => {
        console.log(`   - ${t.name}`);
        if (t.error) console.log(`     ${t.error}`);
      });
  }

  console.log('\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
