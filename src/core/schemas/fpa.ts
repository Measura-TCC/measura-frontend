import { z } from "zod";

export const countTypeEnum = z.enum([
  "DEVELOPMENT_PROJECT",
  "ENHANCEMENT_PROJECT",
  "APPLICATION_PROJECT",
]);

// FPA Estimate schema factory (matches API validation)
export const createEstimateSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("validation.project.name.minLength"))
      .max(100, t("validation.project.name.maxLength")),
    description: z
      .string()
      .min(10, t("validation.project.description.minLength"))
      .max(1000, t("validation.project.description.maxLength")),
    projectId: z.string().min(1, t("validation.common.required")),
    countType: countTypeEnum,
    applicationBoundary: z
      .string()
      .min(10, t("validation.project.description.minLength"))
      .max(2000, t("validation.common.invalidFormat")),
    countingScope: z
      .string()
      .min(10, t("validation.project.description.minLength"))
      .max(2000, t("validation.common.invalidFormat")),
    averageDailyWorkingHours: z.number().min(1).max(24).optional(),
    teamSize: z
      .number()
      .int()
      .min(1, t("validation.fpa.teamSize.min"))
      .max(100, t("validation.fpa.teamSize.max"))
      .optional(),
    hourlyRateBRL: z
      .number()
      .min(0.01, t("validation.fpa.hourlyRate.min"))
      .max(10000)
      .optional(),
    productivityFactor: z.number().min(1).max(100).optional(),
    internalLogicalFiles: z
      .array(z.string())
      .max(100, t("validation.fpa.arrays.maxLength"))
      .optional(),
    externalInterfaceFiles: z
      .array(z.string())
      .max(100, t("validation.fpa.arrays.maxLength"))
      .optional(),
    externalInputs: z
      .array(z.string())
      .max(100, t("validation.fpa.arrays.maxLength"))
      .optional(),
    externalOutputs: z
      .array(z.string())
      .max(100, t("validation.fpa.arrays.maxLength"))
      .optional(),
    externalQueries: z
      .array(z.string())
      .max(100, t("validation.fpa.arrays.maxLength"))
      .optional(),
    generalSystemCharacteristics: z
      .array(z.number().min(0).max(5))
      .length(14, t("validation.fpa.gsc.length"))
      .optional(),
  });

export const createUpdateEstimateSchemaFactory = (t: (key: string) => string) =>
  createEstimateSchemaFactory(t).partial();

// Default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const createEstimateSchema = createEstimateSchemaFactory(dummyT);
export const updateEstimateSchema = createUpdateEstimateSchemaFactory(dummyT);

export const createALISchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  primaryIntent: z
    .string()
    .min(10, "Primary intent must be at least 10 characters")
    .max(500),
  recordElementTypes: z
    .number()
    .min(1, "Must have at least 1 record element type"),
  dataElementTypes: z.number().min(1, "Must have at least 1 data element type"),
  notes: z.string().max(2000).optional(),
});

export const createEISchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  primaryIntent: z
    .string()
    .min(10, "Primary intent must be at least 10 characters")
    .max(500),
  processingLogic: z
    .string()
    .min(10, "Processing logic must be at least 10 characters")
    .max(1000),
  fileTypesReferenced: z.number().min(0),
  dataElementTypes: z.number().min(0),
  notes: z.string().max(2000).optional(),
});

export const createEOSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  primaryIntent: z
    .string()
    .min(10, "Primary intent must be at least 10 characters")
    .max(500),
  derivedData: z.boolean().optional(),
  outputFormat: z.string().optional(),
  fileTypesReferenced: z.number().min(0),
  dataElementTypes: z.number().min(0),
  notes: z.string().max(2000).optional(),
});

export const createEQSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    primaryIntent: z
      .string()
      .min(10, "Primary intent must be at least 10 characters")
      .max(500),
    retrievalLogic: z.string().optional(),
    useSpecialCalculation: z.boolean(),
    fileTypesReferenced: z.number().min(0).optional(),
    dataElementTypes: z.number().min(0).optional(),
    inputFtr: z.number().min(0).optional(),
    inputDet: z.number().min(1).optional(),
    outputFtr: z.number().min(0).optional(),
    outputDet: z.number().min(1).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      if (!data.useSpecialCalculation) {
        return (
          data.fileTypesReferenced !== undefined &&
          data.dataElementTypes !== undefined
        );
      }
      return (
        data.inputFtr !== undefined &&
        data.inputDet !== undefined &&
        data.outputFtr !== undefined &&
        data.outputDet !== undefined
      );
    },
    {
      message:
        "For EQ, provide either standard FTR/DET or input/output separately",
    }
  );

export const createAIESchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  primaryIntent: z
    .string()
    .min(10, "Primary intent must be at least 10 characters")
    .max(500),
  recordElementTypes: z.number().min(1),
  dataElementTypes: z.number().min(1),
  externalSystem: z.string().min(1, "External system is required"),
  notes: z.string().optional(),
});

export const createGSCSchema = z.object({
  dataProcessing: z.number().min(0).max(5),
  performanceRequirements: z.number().min(0).max(5),
  heavilyUsedConfiguration: z.number().min(0).max(5),
  transactionRate: z.number().min(0).max(5),
  onlineDataEntry: z.number().min(0).max(5),
  endUserEfficiency: z.number().min(0).max(5),
  onlineUpdate: z.number().min(0).max(5),
  complexProcessing: z.number().min(0).max(5),
  reusability: z.number().min(0).max(5),
  installationEase: z.number().min(0).max(5),
  operationalEase: z.number().min(0).max(5),
  multipleSites: z.number().min(0).max(5),
  facilitateChange: z.number().min(0).max(5),
  distributedFunctions: z.number().min(0).max(5),
  notes: z.string().max(2000).optional(),
});

export type CreateEstimateData = z.infer<typeof createEstimateSchema>;
export type UpdateEstimateData = z.infer<typeof updateEstimateSchema>;
export type CountType = z.infer<typeof countTypeEnum>;
export type CreateALIData = z.infer<typeof createALISchema>;
export type CreateEIData = z.infer<typeof createEISchema>;
export type CreateEOData = z.infer<typeof createEOSchema>;
export type CreateEQData = z.infer<typeof createEQSchema>;
export type CreateAIEData = z.infer<typeof createAIESchema>;
export type CreateGSCData = z.infer<typeof createGSCSchema>;
