/**
 * Test script for Formula Calculations
 *
 * This script tests the formula calculation logic between frontend and backend:
 * 1. Creates a plan with metrics that have formulas
 * 2. Creates cycles and adds measurement data
 * 3. Calls the calculate endpoint and verifies results
 * 4. Validates that calculations match expected values
 *
 * Usage: npx tsx scripts/test-formula-calculations.ts
 *
 * Environment variables:
 * - AUTH_TOKEN: Bearer token for authentication
 * - ORGANIZATION_ID: Organization ID
 * - PROJECT_ID: Project ID for associating plans
 * - API_BASE_URL: API base URL (default: http://localhost:8080)
 */

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8081/api';
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
    details?: string;
  }>;
}

const results: TestResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name: string, passed: boolean, error?: string, details?: string) {
  results.tests.push({
    name,
    status: passed ? 'PASS' : 'FAIL',
    error,
    details,
  });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
  } else {
    results.failed++;
    console.error(`❌ ${name}`);
    if (error) console.error(`   Error: ${error}`);
    if (details) console.error(`   Details: ${details}`);
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

async function runTests() {
  console.log('\n🧪 Starting Formula Calculation Tests\n');
  console.log('Configuration:');
  console.log(`API: ${API_BASE_URL}`);
  console.log(`Organization ID: ${ORGANIZATION_ID}`);
  console.log(`Project ID: ${PROJECT_ID}\n`);

  if (!AUTH_TOKEN || !ORGANIZATION_ID || !PROJECT_ID) {
    console.error('❌ Missing required environment variables');
    console.error('Required: AUTH_TOKEN, ORGANIZATION_ID, PROJECT_ID');
    process.exit(1);
  }

  let planId: string;
  let objectiveId: string;
  let questionId: string;
  let metricId: string;
  let measurementHhId: string;
  let measurementPFId: string;
  let cycleId: string;

  try {
    // ============================================================
    // TEST 1: Create a plan with a metric that has a formula
    // ============================================================
    console.log('\n📋 Test 1: Creating measurement plan with formula metric');
    const planData = {
      planName: 'Formula Calculation Test Plan',
      planResponsible: 'Test User',
      description: 'Testing formula calculations',
      projectId: PROJECT_ID,
    };

    const { response: createPlanRes, data: planResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}`,
      'POST',
      planData
    );

    if (createPlanRes.status === 201 && planResponse?._id) {
      planId = planResponse._id;
      logTest('Create measurement plan', true, undefined, `Plan ID: ${planId}`);
    } else {
      logTest('Create measurement plan', false, `Status: ${createPlanRes.status}`);
      return;
    }

    // ============================================================
    // TEST 2: Add an objective
    // ============================================================
    console.log('\n📋 Test 2: Adding objective');
    const objectiveData = {
      objectiveTitle: 'Test Productivity',
    };

    const { response: createObjRes, data: objResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives`,
      'POST',
      objectiveData
    );

    if (createObjRes.status === 201 && objResponse?.objectives?.length > 0) {
      objectiveId = objResponse.objectives[objResponse.objectives.length - 1]._id;
      logTest('Add objective', true, undefined, `Objective ID: ${objectiveId}`);
    } else {
      logTest('Add objective', false, `Status: ${createObjRes.status}`);
      return;
    }

    // ============================================================
    // TEST 3: Add a question
    // ============================================================
    console.log('\n📋 Test 3: Adding question');
    const questionData = {
      questionText: 'What is our team productivity?',
    };

    const { response: createQuesRes, data: quesResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions`,
      'POST',
      questionData
    );

    if (createQuesRes.status === 201) {
      const objective = quesResponse.objectives.find((o: any) => o._id === objectiveId);
      questionId = objective.questions[objective.questions.length - 1]._id;
      logTest('Add question', true, undefined, `Question ID: ${questionId}`);
    } else {
      logTest('Add question', false, `Status: ${createQuesRes.status}`);
      return;
    }

    // ============================================================
    // TEST 4: Add a metric with formula (Hh/PF)
    // ============================================================
    console.log('\n📋 Test 4: Adding metric with formula');
    const metricData = {
      metricName: 'Produtividade (Hh/PF)',
      metricDescription: 'Hours per Function Point',
      metricMnemonic: 'PRD',
      metricFormula: 'HH / PF',
      metricControlRange: {
        min: 0,
        max: 50,
      },
    };

    const { response: createMetricRes, data: metricResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions/${questionId}/metrics`,
      'POST',
      metricData
    );

    if (createMetricRes.status === 201) {
      const objective = metricResponse.objectives.find((o: any) => o._id === objectiveId);
      const question = objective.questions.find((q: any) => q._id === questionId);
      metricId = question.metrics[question.metrics.length - 1]._id;
      logTest('Add metric with formula', true, undefined, `Metric ID: ${metricId}, Formula: ${metricData.metricFormula}`);
    } else {
      logTest('Add metric with formula', false, `Status: ${createMetricRes.status}`);
      return;
    }

    // ============================================================
    // TEST 5: Add measurement definitions (HH and PF)
    // ============================================================
    console.log('\n📋 Test 5: Adding measurement definitions');

    // Add HH measurement
    const measurementHhData = {
      measurementEntity: 'Worklog',
      measurementAcronym: 'HH',
      measurementProperties: 'Total hours logged',
      measurementUnit: 'hours',
      measurementScale: 'continuous',
    };

    const { response: createMeasHhRes, data: measHhResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions/${questionId}/metrics/${metricId}/measurement-definitions`,
      'POST',
      measurementHhData
    );

    if (createMeasHhRes.status === 201) {
      const objective = measHhResponse.objectives.find((o: any) => o._id === objectiveId);
      const question = objective.questions.find((q: any) => q._id === questionId);
      const metric = question.metrics.find((m: any) => m._id === metricId);
      measurementHhId = metric.measurements[metric.measurements.length - 1]._id;
      logTest('Add HH measurement definition', true, undefined, `Measurement ID: ${measurementHhId}`);
    } else {
      logTest('Add HH measurement definition', false, `Status: ${createMeasHhRes.status}`);
      return;
    }

    // Add PF measurement
    const measurementPFData = {
      measurementEntity: 'Delivered Function Points',
      measurementAcronym: 'PF',
      measurementProperties: 'Function points delivered',
      measurementUnit: 'Function Points',
      measurementScale: 'discrete',
    };

    const { response: createMeasPFRes, data: measPFResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions/${questionId}/metrics/${metricId}/measurement-definitions`,
      'POST',
      measurementPFData
    );

    if (createMeasPFRes.status === 201) {
      const objective = measPFResponse.objectives.find((o: any) => o._id === objectiveId);
      const question = objective.questions.find((q: any) => q._id === questionId);
      const metric = question.metrics.find((m: any) => m._id === metricId);
      measurementPFId = metric.measurements[metric.measurements.length - 1]._id;
      logTest('Add PF measurement definition', true, undefined, `Measurement ID: ${measurementPFId}`);
    } else {
      logTest('Add PF measurement definition', false, `Status: ${createMeasPFRes.status}`);
      return;
    }

    // ============================================================
    // TEST 6: Create a cycle
    // ============================================================
    console.log('\n📋 Test 6: Creating measurement cycle');
    const cycleData = {
      cycleName: 'ciclo 1',
      startDate: new Date('2025-01-01').toISOString(),
      endDate: new Date('2025-01-31').toISOString(),
    };

    const { response: createCycleRes, data: cycleResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/cycles`,
      'POST',
      cycleData
    );

    if (createCycleRes.status === 201 && cycleResponse?._id) {
      cycleId = cycleResponse._id;
      logTest('Create measurement cycle', true, undefined, `Cycle ID: ${cycleId}`);
    } else {
      logTest('Create measurement cycle', false, `Status: ${createCycleRes.status}`);
      return;
    }

    // ============================================================
    // TEST 7: Add measurement data for HH
    // ============================================================
    console.log('\n📋 Test 7: Adding measurement data for HH');
    const hhDataPayload = {
      measurementDefinitionId: measurementHhId,
      cycleId: cycleId,
      value: 100, // 100 hours
      date: new Date('2025-01-15').toISOString(),
      notes: 'Test HH data',
    };

    const { response: addHhDataRes, data: hhDataResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions/${questionId}/metrics/${metricId}/measurement-data`,
      'POST',
      hhDataPayload
    );

    if (addHhDataRes.status === 201) {
      logTest('Add HH measurement data', true, undefined, `Value: ${hhDataPayload.value} hours`);
    } else {
      logTest('Add HH measurement data', false, `Status: ${addHhDataRes.status}`);
      return;
    }

    // ============================================================
    // TEST 8: Add measurement data for PF
    // ============================================================
    console.log('\n📋 Test 8: Adding measurement data for PF');
    const pfDataPayload = {
      measurementDefinitionId: measurementPFId,
      cycleId: cycleId,
      value: 10, // 10 function points
      date: new Date('2025-01-15').toISOString(),
      notes: 'Test PF data',
    };

    const { response: addPfDataRes, data: pfDataResponse } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/objectives/${objectiveId}/questions/${questionId}/metrics/${metricId}/measurement-data`,
      'POST',
      pfDataPayload
    );

    if (addPfDataRes.status === 201) {
      logTest('Add PF measurement data', true, undefined, `Value: ${pfDataPayload.value} FP`);
    } else {
      logTest('Add PF measurement data', false, `Status: ${addPfDataRes.status}`);
      return;
    }

    // ============================================================
    // TEST 9: Calculate metric
    // ============================================================
    console.log('\n📋 Test 9: Calculating metric with formula');
    const { response: calculateRes, data: calculationResult } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/cycles/${cycleId}/metrics/${metricId}/calculate`,
      'POST',
      {}
    );

    if (calculateRes.status === 200 || calculateRes.status === 201) {
      const expectedValue = 100 / 10; // 10 Hh/PF
      const actualValue = calculationResult.calculatedValue;
      const isCorrect = Math.abs(actualValue - expectedValue) < 0.001;

      logTest(
        'Calculate metric formula',
        isCorrect,
        isCorrect ? undefined : `Expected ${expectedValue}, got ${actualValue}`,
        `Formula: HH / PF = ${hhDataPayload.value} / ${pfDataPayload.value} = ${actualValue}`
      );
    } else {
      logTest('Calculate metric formula', false, `Status: ${calculateRes.status}`, JSON.stringify(calculationResult));
      return;
    }

    // ============================================================
    // TEST 10: Get measurements with acronyms
    // ============================================================
    console.log('\n📋 Test 10: Getting measurements with acronyms');
    const { response: getMeasRes, data: measData } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/cycles/${cycleId}/metrics/${metricId}/measurements-with-acronyms`,
      'GET'
    );

    if (getMeasRes.status === 200) {
      const hasHH = measData.measurements.some((m: any) => m.acronym === 'HH');
      const hasPF = measData.measurements.some((m: any) => m.acronym === 'PF');
      logTest(
        'Get measurements with acronyms',
        hasHH && hasPF,
        !hasHH || !hasPF ? 'Missing expected acronyms' : undefined,
        `Found ${measData.measurements.length} measurements: ${measData.measurements.map((m: any) => m.acronym).join(', ')}`
      );
    } else {
      logTest('Get measurements with acronyms', false, `Status: ${getMeasRes.status}`);
    }

    // ============================================================
    // TEST 11: Validate formula with backend
    // ============================================================
    console.log('\n📋 Test 11: Validating formula with backend');
    const { response: validateRes, data: validationResult } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}/metrics/validate-formula`,
      'POST',
      { formula: 'HH / PF' }
    );

    if (validateRes.status === 200 || validateRes.status === 201) {
      logTest(
        'Validate formula',
        validationResult.isValid === true,
        validationResult.isValid ? undefined : validationResult.error,
        validationResult.isValid ? 'Formula is valid' : undefined
      );
    } else {
      logTest('Validate formula', false, `Status: ${validateRes.status}`);
    }

    // ============================================================
    // CLEANUP: Delete the test plan
    // ============================================================
    console.log('\n🧹 Cleanup: Deleting test plan');
    const { response: deleteRes } = await makeRequest(
      `/measurement-plans/${ORGANIZATION_ID}/${planId}`,
      'DELETE'
    );

    if (deleteRes.status === 200 || deleteRes.status === 204) {
      logTest('Delete test plan', true);
    } else {
      logTest('Delete test plan', false, `Status: ${deleteRes.status}`);
    }

  } catch (error: any) {
    console.error('\n❌ Test execution error:', error.message);
    logTest('Test execution', false, error.message);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`Total tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter((t) => t.status === 'FAIL')
      .forEach((t) => {
        console.log(`  - ${t.name}`);
        if (t.error) console.log(`    Error: ${t.error}`);
      });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
