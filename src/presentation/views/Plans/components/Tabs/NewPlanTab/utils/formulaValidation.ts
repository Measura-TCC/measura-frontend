/**
 * Formula validation utilities for custom metrics
 * Matches backend logic in metric-calculation.service.ts
 */

/**
 * Extract acronyms from a formula, excluding function keywords
 * Matches backend extractAggregations logic
 */
export function extractAcronymsFromFormula(formula: string): string[] {
  if (!formula || !formula.trim()) {
    return [];
  }

  // Extract right-hand side only (after '=')
  // This prevents extracting the result variable from the left side
  const rhs = formula.includes('=')
    ? formula.split('=').slice(1).join('=').trim()
    : formula;

  // Extract all uppercase acronyms (same pattern as backend)
  const acronymRegex = /\b([A-Z][A-Z0-9_]*)\b/g;
  const matches = [...rhs.matchAll(acronymRegex)];

  // Keywords to exclude (same as backend)
  const excludedKeywords = [
    'SUM',
    'AVG',
    'COUNT',
    'MIN',
    'MAX',
    'MEDIAN',
    'NULLIF',
    'WHERE',
    'IF',
    'OR',
    'AND',
    'NOT',
    'NAN',
  ];

  // Extract unique acronyms, excluding keywords
  const acronyms = matches
    .map((m) => m[1])
    .filter((acronym) => !excludedKeywords.includes(acronym.toUpperCase()))
    .filter((v, i, arr) => arr.indexOf(v) === i); // unique only

  return acronyms;
}

/**
 * Check if a measurement acronym matches a formula acronym
 * Supports prefix/suffix matching (same as backend smart matching)
 */
export function isAcronymMatch(measurementAcronym: string, formulaAcronym: string): boolean {
  // Exact match
  if (measurementAcronym === formulaAcronym) {
    return true;
  }

  // Prefix match: ESF_H in formula matches ESF in measurement
  if (formulaAcronym.startsWith(measurementAcronym + '_')) {
    return true;
  }

  // Suffix match: ESF in formula matches ESF_H in measurement
  if (measurementAcronym.startsWith(formulaAcronym + '_')) {
    return true;
  }

  return false;
}

/**
 * Validate formula against available measurements
 * Returns missing and found acronyms
 */
export function validateFormulaAgainstMeasurements(
  formula: string,
  measurements: Array<{ measurementAcronym: string; measurementEntity: string }>
): {
  requiredAcronyms: string[];
  foundAcronyms: Array<{ formulaAcronym: string; measurement: { measurementAcronym: string; measurementEntity: string } }>;
  missingAcronyms: string[];
} {
  const requiredAcronyms = extractAcronymsFromFormula(formula);
  const foundAcronyms: Array<{ formulaAcronym: string; measurement: { measurementAcronym: string; measurementEntity: string } }> = [];
  const missingAcronyms: string[] = [];

  requiredAcronyms.forEach((formulaAcronym) => {
    const matchingMeasurement = measurements.find((m) =>
      isAcronymMatch(m.measurementAcronym, formulaAcronym)
    );

    if (matchingMeasurement) {
      foundAcronyms.push({
        formulaAcronym,
        measurement: matchingMeasurement,
      });
    } else {
      missingAcronyms.push(formulaAcronym);
    }
  });

  return {
    requiredAcronyms,
    foundAcronyms,
    missingAcronyms,
  };
}
