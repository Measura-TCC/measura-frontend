import { useOrganizationStore } from "../hooks/organizations/useOrganizationStore";

// Direct access to organization store state
export const getOrganizationState = useOrganizationStore.getState;