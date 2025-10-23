import { z } from "zod";

export const countTypeEnum = z.enum([
  "DEVELOPMENT_PROJECT",
  "ENHANCEMENT_PROJECT",
  "APPLICATION_PROJECT",
]);

export const requirementSourceEnum = z.enum([
  "manual",
  "csv",
  "jira",
  "github",
  "azure_devops",
  "clickup",
]);

export const componentTypeEnum = z.enum([
  "ALI",
  "AIE",
  "EI",
  "EO",
  "EQ",
]);

export const aliDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  recordElementTypes: z.number().min(1).optional(),
  dataElementTypes: z.number().min(1).optional(),
  primaryIntent: z.string().min(1),
  dataGroups: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export const aieDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  recordElementTypes: z.number().min(1).optional(),
  dataElementTypes: z.number().min(1).optional(),
  primaryIntent: z.string().min(1),
  externalSystem: z.string().min(1),  // Backend uses 'externalSystem'
  dataGroups: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export const eiDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  fileTypesReferenced: z.number().min(0).optional(),
  dataElementTypes: z.number().min(1).optional(),
  primaryIntent: z.string().min(1),
  processingLogic: z.string().optional(),
  validationRules: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export const eoDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  fileTypesReferenced: z.number().min(0).optional(),
  dataElementTypes: z.number().min(1).optional(),
  primaryIntent: z.string().min(1),
  processingLogic: z.string().optional(),
  outputFormat: z.string().optional(),
  calculationFormulas: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export const eqDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  fileTypesReferenced: z.number().min(0).optional(),
  dataElementTypes: z.number().min(1).optional(),
  primaryIntent: z.string().min(1),
  retrievalLogic: z.string().optional(),
  outputFormat: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const requirementWithFpaDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  source: requirementSourceEnum,
  sourceReference: z.string().optional(),
  componentType: componentTypeEnum,
  fpaData: z.union([aliDataSchema, aieDataSchema, eiDataSchema, eoDataSchema, eqDataSchema]),
});

export const adjustmentFactorsSchema = z.object({
  dataCommunications: z.number().min(0).max(5),
  distributedDataProcessing: z.number().min(0).max(5),
  performance: z.number().min(0).max(5),
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
});

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
    requirements: z.array(requirementWithFpaDataSchema).optional(),
    adjustmentFactors: adjustmentFactorsSchema.optional(),
  });

export const createUpdateEstimateSchemaFactory = (t: (key: string) => string) =>
  createEstimateSchemaFactory(t).partial();

// Default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const createEstimateSchema = createEstimateSchemaFactory(dummyT);
export const updateEstimateSchema = createUpdateEstimateSchemaFactory(dummyT);

export const createALISchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fpa.name.required")),
    description: z.string().min(1, t("fpa.description.required")),
    primaryIntent: z
      .string()
      .min(10, t("fpa.primaryIntent.minLength"))
      .max(500, t("fpa.primaryIntent.maxLength")),
    recordElementTypes: z
      .number()
      .min(1, t("fpa.recordElementTypes.min")),
    dataElementTypes: z.number().min(1, t("fpa.dataElementTypes.min")),
    notes: z.string().max(2000).optional(),
  });

export const createEISchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fpa.name.required")),
    description: z.string().optional(),
    primaryIntent: z
      .string()
      .min(10, t("fpa.primaryIntent.minLength"))
      .max(500, t("fpa.primaryIntent.maxLength")),
    processingLogic: z
      .string()
      .min(10, t("fpa.processingLogic.minLength"))
      .max(1000, t("fpa.processingLogic.maxLength")),
    fileTypesReferenced: z.number().min(0),
    dataElementTypes: z.number().min(0),
    notes: z.string().max(2000).optional(),
  });

export const createALISchema = createALISchemaFactory(dummyT);
export const createEISchema = createEISchemaFactory(dummyT);

export const createEOSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fpa.name.required")),
    description: z.string().optional(),
    primaryIntent: z
      .string()
      .min(10, t("fpa.primaryIntent.minLength"))
      .max(500, t("fpa.primaryIntent.maxLength")),
    derivedData: z.boolean().optional(),
    outputFormat: z.string().min(1, t("fpa.outputFormat.required")),
    fileTypesReferenced: z.number().min(0),
    dataElementTypes: z.number().min(0),
    notes: z.string().max(2000).optional(),
  });

export const createEOSchema = createEOSchemaFactory(dummyT);

export const createEQSchemaFactory = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("fpa.name.required")),
      description: z.string().optional(),
      primaryIntent: z
        .string()
        .min(10, t("fpa.primaryIntent.minLength"))
        .max(500, t("fpa.primaryIntent.maxLength")),
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
        message: t("fpa.eqValidation"),
      }
    );

export const createEQSchema = createEQSchemaFactory(dummyT);

export const createAIESchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fpa.name.required")),
    description: z.string().min(1, t("fpa.description.required")),
    primaryIntent: z
      .string()
      .min(10, t("fpa.primaryIntent.minLength"))
      .max(500, t("fpa.primaryIntent.maxLength")),
    recordElementTypes: z.number().min(1, t("fpa.recordElementTypes.min")),
    dataElementTypes: z.number().min(1, t("fpa.dataElementTypes.min")),
    externalSystem: z.string().min(1, t("fpa.externalSystem.required")),
    notes: z.string().optional(),
  });

export const createAIESchema = createAIESchemaFactory(dummyT);

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
export type RequirementWithFpaDataInput = z.infer<typeof requirementWithFpaDataSchema>;
export type AdjustmentFactorsInput = z.infer<typeof adjustmentFactorsSchema>;
export type ALIDataInput = z.infer<typeof aliDataSchema>;
export type AIEDataInput = z.infer<typeof aieDataSchema>;
export type EIDataInput = z.infer<typeof eiDataSchema>;
export type EODataInput = z.infer<typeof eoDataSchema>;
export type EQDataInput = z.infer<typeof eqDataSchema>;
