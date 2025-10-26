/**
 * Test script for Measurement Plans CRUD Operations
 *
 * This script comprehensively tests all CRUD operations for measurement plans:
 * 1. Plan CRUD (Create, Read, Update, Delete)
 * 2. Objective CRUD
 * 3. Question CRUD
 * 4. Metric CRUD
 * 5. Measurement CRUD
 * 6. Status transitions
 *
 * Usage: npx tsx scripts/test-plans-crud.ts
 *
 * Environment variables:
 * - AUTH_TOKEN: Bearer token for authentication
 * - ORGANIZATION_ID: Organization ID
 * - PROJECT_ID: Project ID for associating plans
 * - API_BASE_URL: API base URL (default: http://localhost:8080)
 */

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

// Test data storage
let testPlanId: string;
let testObjectiveId: string;
let testQuestionId: string;
let testMetricId: string;
let testMeasurementId: string;

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
  let data = null;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Response wasn't JSON
  }

  return { response, data };
}

// Test data
const testPlan = {
  planName: 'Test Measurement Plan - CRUD',
  planResponsible: 'Test User',
  associatedProject: PROJECT_ID,
  objectives: []
};

const testObjective = {
  objectiveTitle: 'Test Objective - Improve Software Quality',
  questions: []
};

const testQuestion = {
  questionText: 'How effective is our testing process?',
  metrics: []
};

const testMetric = {
  metricName: 'Test Coverage',
  metricDescription: 'Percentage of code covered by automated tests',
  metricMnemonic: 'TCO',
  metricFormula: '(Lines Covered / Total Lines) * 100',
  metricControlRange: [80, 100] as [number, number],
  analysisProcedure: 'Weekly analysis of test coverage reports',
  analysisFrequency: 'Weekly',
  analysisResponsible: 'QA Team',
  measurements: []
};

const testMeasurement = {
  measurementEntity: 'Lines of Code',
  measurementAcronym: 'LOC',
  measurementProperties: 'Total executable lines in codebase',
  measurementUnit: 'lines',
  measurementScale: 'ratio',
  measurementProcedure: 'Use SonarQube to count executable lines',
  measurementFrequency: 'Daily',
  measurementResponsible: 'Dev Team'
};

async function runTests() {
  console.log('\n🚀 Starting Measurement Plans CRUD Tests\n');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Organization: ${ORGANIZATION_ID}`);
  console.log(`Project: ${PROJECT_ID}\n`);

  // Validation
  if (!AUTH_TOKEN || !ORGANIZATION_ID || !PROJECT_ID) {
    console.error('❌ Missing required environment variables!');
    console.error('Required: AUTH_TOKEN, ORGANIZATION_ID, PROJECT_ID');
    process.exit(1);
  }

  // ====================================
  // PLAN CRUD TESTS
  // ====================================
  console.log('\n📋 PLAN CRUD TESTS\n');

  // Create Plan
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}`,
      'POST',
      testPlan
    );
    const passed = response.ok && (data?._id || data?.id);
    if (passed) {
      testPlanId = data._id || data.id;
    }
    logTest('Create measurement plan', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Create measurement plan', false, (error as Error).message);
  }

  // Read Plan
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'GET'
    );
    const passed = response.ok && data?.id === testPlanId;
    logTest('Read measurement plan by ID', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Read measurement plan by ID', false, (error as Error).message);
  }

  // List Plans
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}`,
      'GET'
    );
    const passed = response.ok && Array.isArray(data?.data);
    logTest('List all measurement plans', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('List all measurement plans', false, (error as Error).message);
  }

  // Update Plan Metadata
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'PUT',
      { planName: 'Updated Test Plan' }
    );
    const passed = response.ok && data?.planName === 'Updated Test Plan';
    logTest('Update plan metadata', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Update plan metadata', false, (error as Error).message);
  }

  // ====================================
  // OBJECTIVE CRUD TESTS
  // ====================================
  console.log('\n🎯 OBJECTIVE CRUD TESTS\n');

  // Add Objective
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}/objectives`,
      'POST',
      testObjective
    );
    const passed = response.ok && data?.objectives?.length > 0;
    if (passed) {
      testObjectiveId = data.objectives[0]._id;
    }
    logTest('Add objective to plan', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Add objective to plan', false, (error as Error).message);
  }

  // Update Objective
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}/objectives/${testObjectiveId}`,
      'PUT',
      { objectiveTitle: 'Updated Objective Title', questions: [] }
    );
    const passed = response.ok;
    logTest('Update objective', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Update objective', false, (error as Error).message);
  }

  // ====================================
  // QUESTION CRUD TESTS
  // ====================================
  console.log('\n❓ QUESTION CRUD TESTS\n');

  // Add Question
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}/objectives/${testObjectiveId}/questions`,
      'POST',
      testQuestion
    );
    const passed = response.ok;
    if (passed) {
      const objective = data?.objectives?.find((o: any) => o._id === testObjectiveId);
      testQuestionId = objective?.questions?.[0]?._id;
    }
    logTest('Add question to objective', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Add question to objective', false, (error as Error).message);
  }

  // Update Question
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}`,
      'PUT',
      { questionText: 'Updated Question Text?', metrics: [] }
    );
    const passed = response.ok;
    logTest('Update question', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Update question', false, (error as Error).message);
  }

  // ====================================
  // METRIC CRUD TESTS
  // ====================================
  console.log('\n📊 METRIC CRUD TESTS\n');

  // Add Metric
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics`,
      'POST',
      testMetric
    );
    const passed = response.ok;
    if (passed) {
      const objective = data?.objectives?.find((o: any) => o._id === testObjectiveId);
      const question = objective?.questions?.find((q: any) => q._id === testQuestionId);
      testMetricId = question?.metrics?.[0]?._id;
    }
    logTest('Add metric to question', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Add metric to question', false, (error as Error).message);
  }

  // Update Metric
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics/${testMetricId}`,
      'PUT',
      { ...testMetric, metricName: 'Updated Metric Name' }
    );
    const passed = response.ok;
    logTest('Update metric', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Update metric', false, (error as Error).message);
  }

  // ====================================
  // MEASUREMENT CRUD TESTS
  // ====================================
  console.log('\n📏 MEASUREMENT CRUD TESTS\n');

  // Add Measurement
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics/${testMetricId}/measurements`,
      'POST',
      testMeasurement
    );
    const passed = response.ok;
    if (passed) {
      const objective = data?.objectives?.find((o: any) => o._id === testObjectiveId);
      const question = objective?.questions?.find((q: any) => q._id === testQuestionId);
      const metric = question?.metrics?.find((m: any) => m._id === testMetricId);
      testMeasurementId = metric?.measurements?.[0]?._id;
    }
    logTest('Add measurement to metric', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Add measurement to metric', false, (error as Error).message);
  }

  // Update Measurement
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics/${testMetricId}/measurements/${testMeasurementId}`,
      'PUT',
      { ...testMeasurement, measurementEntity: 'Updated Entity' }
    );
    const passed = response.ok;
    logTest('Update measurement', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Update measurement', false, (error as Error).message);
  }

  // Delete Measurement
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics/${testMetricId}/measurements/${testMeasurementId}`,
      'DELETE'
    );
    const passed = response.ok;
    logTest('Delete measurement', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Delete measurement', false, (error as Error).message);
  }

  // Delete Metric
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}/metrics/${testMetricId}`,
      'DELETE'
    );
    const passed = response.ok;
    logTest('Delete metric', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Delete metric', false, (error as Error).message);
  }

  // Delete Question
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${testPlanId}/objectives/${testObjectiveId}/questions/${testQuestionId}`,
      'DELETE'
    );
    const passed = response.ok;
    logTest('Delete question', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Delete question', false, (error as Error).message);
  }

  // Delete Objective
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}/objectives/${testObjectiveId}`,
      'DELETE'
    );
    const passed = response.ok;
    logTest('Delete objective', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Delete objective', false, (error as Error).message);
  }

  // ====================================
  // STATUS TRANSITION TESTS
  // ====================================
  console.log('\n🔄 STATUS TRANSITION TESTS\n');

  // Draft to Active
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'PUT',
      { status: 'active' }
    );
    const passed = response.ok && data?.status === 'active';
    logTest('Transition plan from draft to active', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Transition plan from draft to active', false, (error as Error).message);
  }

  // Active to Completed
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'PUT',
      { status: 'completed' }
    );
    const passed = response.ok && data?.status === 'completed';
    logTest('Transition plan from active to completed', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Transition plan from active to completed', false, (error as Error).message);
  }

  // Verify completed status is final (should fail)
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'PUT',
      { status: 'draft' }
    );
    const passed = !response.ok; // Should fail
    logTest('Verify completed status cannot be changed (expected failure)', passed, passed ? undefined : 'Status change should have been rejected');
  } catch (error) {
    logTest('Verify completed status cannot be changed (expected failure)', true);
  }

  // ====================================
  // DELETE PLAN TESTS
  // ====================================
  console.log('\n🗑️  DELETE PLAN TESTS\n');

  // Try deleting completed plan (should fail)
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${testPlanId}`,
      'DELETE'
    );
    const passed = !response.ok; // Should fail
    logTest('Verify cannot delete completed plan (expected failure)', passed, passed ? undefined : 'Deletion should have been rejected');
  } catch (error) {
    logTest('Verify cannot delete completed plan (expected failure)', true);
  }

  // Create a draft plan to test deletion
  let draftPlanId: string = '';
  try {
    const { response, data } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}`,
      'POST',
      { ...testPlan, planName: 'Draft Plan for Deletion Test' }
    );
    const passed = response.ok && data?.id;
    if (passed) {
      draftPlanId = data.id;
    }
    logTest('Create draft plan for deletion test', passed, !passed ? `Status: ${response.status}` : undefined);
  } catch (error) {
    logTest('Create draft plan for deletion test', false, (error as Error).message);
  }

  // Delete draft plan (should succeed)
  if (draftPlanId) {
    try {
      const { response } = await makeRequest(
        `/measurement-plans/${ORGANIZATION_ID}/${draftPlanId}`,
        'DELETE'
      );
      const passed = response.ok;
      logTest('Delete draft plan', passed, !passed ? `Status: ${response.status}` : undefined);
    } catch (error) {
      logTest('Delete draft plan', false, (error as Error).message);
    }
  }

  // ====================================
  // EDGE CASE TESTS
  // ====================================
  console.log('\n⚠️  EDGE CASE TESTS\n');

  // Non-existent plan
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/nonexistent-id`,
      'GET'
    );
    const passed = response.status === 404;
    logTest('Get non-existent plan returns 404', passed, passed ? undefined : `Expected 404, got ${response.status}`);
  } catch (error) {
    logTest('Get non-existent plan returns 404', false, (error as Error).message);
  }

  // Invalid data validation
  try {
    const { response } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}`,
      'POST',
      { planName: '' } // Empty name should fail
    );
    const passed = !response.ok; // Should fail validation
    logTest('Invalid plan data rejected', passed, passed ? undefined : 'Empty plan name should be rejected');
  } catch (error) {
    logTest('Invalid plan data rejected', true);
  }

  // ====================================
  // SUMMARY
  // ====================================
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.passed + results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  console.log('='.repeat(50) + '\n');

  if (results.failed > 0) {
    console.log('Failed tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`  - ${t.name}${t.error ? `: ${t.error}` : ''}`));
    console.log('');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});
