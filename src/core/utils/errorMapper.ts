/**
 * Maps backend validation error messages to i18n translation keys
 * Backend errors are always in English and follow specific patterns
 */

export function mapBackendErrorToI18n(
  errorMessage: string | string[],
  namespace: string = "organization"
): string {
  // Convert to array if single string
  const messages = Array.isArray(errorMessage) ? errorMessage : [errorMessage];

  // Take the first error message for display
  const firstError = messages[0];

  // Map common validation patterns to i18n keys
  const errorMappings: Record<string, string> = {
    // Field empty errors
    "domain should not be empty": `${namespace}:integrations.fieldRequired`,
    "email should not be empty": `${namespace}:integrations.fieldRequired`,
    "apiToken should not be empty": `${namespace}:integrations.apiTokenRequired`,
    "token should not be empty": `${namespace}:integrations.tokenRequired`,
    "pat should not be empty": `${namespace}:integrations.patRequired`,
    "organization should not be empty": `${namespace}:integrations.fieldRequired`,

    // Type validation errors
    "domain must be a string": `${namespace}:integrations.fieldRequired`,
    "email must be a string": `${namespace}:integrations.fieldRequired`,
    "apiToken must be a string": `${namespace}:integrations.apiTokenRequired`,
    "token must be a string": `${namespace}:integrations.tokenRequired`,
    "pat must be a string": `${namespace}:integrations.patRequired`,
    "organization must be a string": `${namespace}:integrations.fieldRequired`,
    "enabled must be a boolean value": `${namespace}:integrations.fieldRequired`,

    // Integration configuration errors
    "jira integration not configured for this organization": `${namespace}:integrations.notConfigured`,
    "github integration not configured for this organization": `${namespace}:integrations.notConfigured`,
    "clickup integration not configured for this organization": `${namespace}:integrations.notConfigured`,
    "azure-devops integration not configured for this organization": `${namespace}:integrations.notConfigured`,

    // Integration disabled errors
    "jira integration is currently disabled": `${namespace}:integrations.disabled`,
    "github integration is currently disabled": `${namespace}:integrations.disabled`,
    "clickup integration is currently disabled": `${namespace}:integrations.disabled`,
    "azure-devops integration is currently disabled": `${namespace}:integrations.disabled`,

    // Connection/credential errors (from service layer)
    "Invalid Jira credentials or domain": `${namespace}:integrations.testFailed`,
    "Invalid credentials": `${namespace}:integrations.testFailed`,
    "Jira API error: Invalid credentials": `${namespace}:integrations.testFailed`,
  };

  // Check for exact match
  if (errorMappings[firstError]) {
    return errorMappings[firstError];
  }

  // Check for pattern matches (case-insensitive)
  const lowerError = firstError.toLowerCase();

  if (lowerError.includes("invalid credentials") || lowerError.includes("authentication failed")) {
    return `${namespace}:integrations.testFailed`;
  }

  if (lowerError.includes("not found")) {
    return `${namespace}:integrations.notConfigured`;
  }

  if (lowerError.includes("disabled")) {
    return `${namespace}:integrations.disabled`;
  }

  // Return original error if no mapping found
  return firstError;
}
