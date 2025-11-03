# Backend Changes for Enhanced Measurement Plan Export

## 📋 Overview

This document outlines all necessary backend changes to support the enhanced measurement plan export with:
- ✅ Cycles information
- ✅ Monitoring data (measurement values per cycle)
- ✅ Metric calculations per cycle
- ✅ Charts (received as base64 images from frontend)

---

## 🗂️ Files to Modify

1. **DTOs** - Add new fields
2. **Repository** - Add new queries
3. **Service** - Fetch additional data
4. **Export Service** - Generate enhanced HTML/DOCX
5. **i18n** - Add translation keys

---

## 📦 Step 1: Update DTOs

### File: `src/application/measurement-plans/dtos/export.dto.ts`

```typescript
// ADD new interface for chart images
export interface ChartImagesDto {
  measurementChart?: string;      // base64 image from frontend
  calculationsChart?: string;     // base64 image from frontend
  [key: string]: string | undefined; // Allow additional charts
}

// UPDATE existing ExportOptionsDto
export interface ExportOptionsDto {
  // Existing fields
  includeDetails?: boolean;
  includeMeasurements?: boolean;
  includeAnalysis?: boolean;

  // NEW: Cycles and monitoring
  includeCycles?: boolean;          // ← ADD
  includeMonitoring?: boolean;      // ← ADD
  includeCalculations?: boolean;    // ← ADD
  includeCharts?: boolean;          // ← ADD

  // NEW: Chart images from frontend
  chartImages?: ChartImagesDto;     // ← ADD
}

// ADD new interfaces for data structure
export interface CycleDto {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  measurementCount: number;
  status?: string;
}

export interface MeasurementDataDto {
  metricId: string;
  metricName: string;
  metricMnemonic: string;
  value: number;
  unit: string;
  collectedAt: Date;
  cycleId: string;
  cycleName: string;
}

export interface MetricCalculationDto {
  metricId: string;
  metricName: string;
  metricMnemonic: string;
  cycleId: string;
  cycleName: string;
  calculatedValue: number;
  formula: string;
}
```

---

## 🗄️ Step 2: Update Repository Interfaces

### File: `src/domain/measurement-plans/interfaces/cycle.repository.interface.ts`

```typescript
export interface ICycleRepository {
  // Existing methods...
  findById(id: string): Promise<MeasurementCycle | null>;
  findAll(): Promise<MeasurementCycle[]>;
  create(cycle: CreateCycleDto): Promise<MeasurementCycle>;
  update(id: string, cycle: UpdateCycleDto): Promise<MeasurementCycle>;
  delete(id: string): Promise<void>;

  // NEW: Methods for export
  findByPlanId(planId: string): Promise<MeasurementCycle[]>;  // ← ADD
  findByPlanIdWithMeasurements(                                // ← ADD
    planId: string
  ): Promise<CycleWithMeasurements[]>;
  getMeasurementDataByPlanId(                                  // ← ADD
    planId: string
  ): Promise<MeasurementDataDto[]>;
  getCalculationsByPlanId(                                     // ← ADD
    planId: string
  ): Promise<MetricCalculationDto[]>;
}

// ADD new types
export interface CycleWithMeasurements {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  measurements: {
    metricId: string;
    metricName: string;
    value: number;
    unit: string;
    collectedAt: Date;
  }[];
}
```

---

## 🗄️ Step 3: Implement Repository Methods

### File: `src/infrastructure/database/repositories/cycle.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeasurementCycle } from '@domain/measurement-plans/entities/cycle.entity';
import { ICycleRepository } from '@domain/measurement-plans/interfaces/cycle.repository.interface';

@Injectable()
export class CycleRepository implements ICycleRepository {
  constructor(
    @InjectModel('MeasurementCycle')
    private readonly cycleModel: Model<MeasurementCycle>,
  ) {}

  // Existing methods...

  // NEW: Get cycles by plan ID
  async findByPlanId(planId: string): Promise<MeasurementCycle[]> {
    return this.cycleModel
      .find({ planId })
      .sort({ startDate: 1 })
      .exec();
  }

  // NEW: Get cycles with measurements
  async findByPlanIdWithMeasurements(
    planId: string
  ): Promise<CycleWithMeasurements[]> {
    return this.cycleModel
      .aggregate([
        {
          $match: { planId: new mongoose.Types.ObjectId(planId) }
        },
        {
          $lookup: {
            from: 'measurementdata',
            localField: '_id',
            foreignField: 'cycleId',
            as: 'measurements'
          }
        },
        {
          $lookup: {
            from: 'metrics',
            localField: 'measurements.metricId',
            foreignField: '_id',
            as: 'metricsInfo'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            startDate: 1,
            endDate: 1,
            measurements: {
              $map: {
                input: '$measurements',
                as: 'measurement',
                in: {
                  metricId: '$$measurement.metricId',
                  metricName: {
                    $arrayElemAt: [
                      '$metricsInfo.metricName',
                      {
                        $indexOfArray: [
                          '$metricsInfo._id',
                          '$$measurement.metricId'
                        ]
                      }
                    ]
                  },
                  value: '$$measurement.value',
                  unit: '$$measurement.unit',
                  collectedAt: '$$measurement.collectedAt'
                }
              }
            }
          }
        },
        {
          $sort: { startDate: 1 }
        }
      ])
      .exec();
  }

  // NEW: Get all measurement data for a plan
  async getMeasurementDataByPlanId(
    planId: string
  ): Promise<MeasurementDataDto[]> {
    return this.cycleModel
      .aggregate([
        {
          $match: { planId: new mongoose.Types.ObjectId(planId) }
        },
        {
          $lookup: {
            from: 'measurementdata',
            localField: '_id',
            foreignField: 'cycleId',
            as: 'measurements'
          }
        },
        {
          $unwind: '$measurements'
        },
        {
          $lookup: {
            from: 'metrics',
            localField: 'measurements.metricId',
            foreignField: '_id',
            as: 'metric'
          }
        },
        {
          $unwind: '$metric'
        },
        {
          $project: {
            metricId: '$metric._id',
            metricName: '$metric.metricName',
            metricMnemonic: '$metric.metricMnemonic',
            value: '$measurements.value',
            unit: '$measurements.unit',
            collectedAt: '$measurements.collectedAt',
            cycleId: '$_id',
            cycleName: '$name'
          }
        },
        {
          $sort: { collectedAt: 1 }
        }
      ])
      .exec();
  }

  // NEW: Get metric calculations for a plan
  async getCalculationsByPlanId(
    planId: string
  ): Promise<MetricCalculationDto[]> {
    return this.cycleModel
      .aggregate([
        {
          $match: { planId: new mongoose.Types.ObjectId(planId) }
        },
        {
          $lookup: {
            from: 'metriccalculations',
            localField: '_id',
            foreignField: 'cycleId',
            as: 'calculations'
          }
        },
        {
          $unwind: '$calculations'
        },
        {
          $lookup: {
            from: 'metrics',
            localField: 'calculations.metricId',
            foreignField: '_id',
            as: 'metric'
          }
        },
        {
          $unwind: '$metric'
        },
        {
          $project: {
            metricId: '$metric._id',
            metricName: '$metric.metricName',
            metricMnemonic: '$metric.metricMnemonic',
            cycleId: '$_id',
            cycleName: '$name',
            calculatedValue: '$calculations.result',
            formula: '$metric.metricFormula'
          }
        },
        {
          $sort: { cycleName: 1, metricName: 1 }
        }
      ])
      .exec();
  }
}
```

---

## 🔧 Step 4: Update Export Service - Data Fetching

### File: `src/application/measurement-plans/use-cases/export.service.ts`

Add new methods to fetch additional data:

```typescript
@Injectable()
export class ExportService {
  constructor(
    private readonly measurementPlanService: MeasurementPlanService,
    private readonly cycleRepository: ICycleRepository,  // ← ADD
    private readonly i18n: I18nService,
  ) {
    // ...existing constructor code
  }

  async generateExport(
    planId: string,
    organizationId: string,
    format: ExportFormat,
    options?: ExportOptionsDto,
    locale: string = 'en',
  ): Promise<{ filePath: string; filename: string }> {
    // Get the measurement plan data
    const planData = await this.measurementPlanService.findOne(
      planId,
      organizationId,
    );
    if (!planData) {
      throw new NotFoundException(
        `Measurement plan with ID "${planId}" not found`,
      );
    }

    // NEW: Fetch additional data if options are enabled
    const enrichedData = await this.enrichPlanData(planData, options);

    const filename = `measurement-plan-${planId}.${format}`;
    const filePath = path.join(process.cwd(), 'exports', filename);

    switch (format) {
      case ExportFormat.PDF:
        await this.generatePDF(enrichedData, filePath, options, locale);
        break;
      case ExportFormat.DOCX:
        await this.generateDOCX(enrichedData, filePath, options, locale);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return { filePath, filename };
  }

  // NEW: Enrich plan data with cycles, monitoring, and calculations
  private async enrichPlanData(
    planData: any,
    options?: ExportOptionsDto,
  ): Promise<any> {
    const enriched = { ...planData };

    // Fetch cycles if requested
    if (options?.includeCycles) {
      const cycles = await this.cycleRepository.findByPlanId(planData._id);
      enriched.cycles = cycles.map(cycle => ({
        _id: cycle._id,
        name: cycle.name,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        measurementCount: 0, // Will be populated from measurements
      }));
    }

    // Fetch monitoring data if requested
    if (options?.includeMonitoring) {
      const measurementData = await this.cycleRepository.getMeasurementDataByPlanId(
        planData._id,
      );

      // Count measurements per cycle
      const measurementCounts = new Map<string, number>();
      measurementData.forEach(md => {
        const count = measurementCounts.get(md.cycleId.toString()) || 0;
        measurementCounts.set(md.cycleId.toString(), count + 1);
      });

      // Update cycle measurement counts
      if (enriched.cycles) {
        enriched.cycles.forEach(cycle => {
          cycle.measurementCount = measurementCounts.get(cycle._id.toString()) || 0;
        });
      }

      // Group measurements by cycle
      const measurementsByCycle = new Map<string, any[]>();
      measurementData.forEach(md => {
        const cycleKey = md.cycleId.toString();
        if (!measurementsByCycle.has(cycleKey)) {
          measurementsByCycle.set(cycleKey, []);
        }
        measurementsByCycle.get(cycleKey)!.push(md);
      });

      enriched.measurementsByCycle = Array.from(measurementsByCycle.entries()).map(
        ([cycleId, measurements]) => {
          const cycle = enriched.cycles?.find(c => c._id.toString() === cycleId);
          return {
            cycleId,
            cycleName: cycle?.name || 'Unknown',
            startDate: cycle?.startDate,
            endDate: cycle?.endDate,
            measurements,
          };
        },
      );
    }

    // Fetch calculations if requested
    if (options?.includeCalculations) {
      const calculations = await this.cycleRepository.getCalculationsByPlanId(
        planData._id,
      );

      // Group calculations by cycle
      const calculationsByCycle = new Map<string, any[]>();
      calculations.forEach(calc => {
        const cycleKey = calc.cycleId.toString();
        if (!calculationsByCycle.has(cycleKey)) {
          calculationsByCycle.set(cycleKey, []);
        }
        calculationsByCycle.get(cycleKey)!.push(calc);
      });

      enriched.calculationsByCycle = Array.from(calculationsByCycle.entries()).map(
        ([cycleId, calculations]) => {
          const cycle = enriched.cycles?.find(c => c._id.toString() === cycleId);
          return {
            cycleId,
            cycleName: cycle?.name || 'Unknown',
            calculations,
          };
        },
      );
    }

    return enriched;
  }
}
```

---

## 📄 Step 5: Update HTML Template - Add New Sections

### File: `src/application/measurement-plans/use-cases/export.service.ts`

Update the `createHTMLTemplate` method:

```typescript
private createHTMLTemplate(
  planData: any,
  options?: ExportOptionsDto,
  locale: string = 'en',
): string {
  // Register handlebars helpers
  handlebars.registerHelper('add', (value: number, addition: number) => value + addition);
  handlebars.registerHelper('formatDate', (date: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US');
  });
  handlebars.registerHelper('formatDateTime', (date: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US');
  });

  const template = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>{{planName}}</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10mm 15mm 15mm 15mm;
              line-height: 1.5;
              color: #000000;
              font-size: 12pt;
          }

          /* Existing styles... */

          /* NEW: Cycles section styles */
          .section {
              margin-top: 30px;
              margin-bottom: 30px;
              page-break-inside: avoid;
          }

          .section-title {
              font-size: 18pt;
              font-weight: bold;
              color: #5B21B6;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 2px solid #5B21B6;
              padding-bottom: 5px;
          }

          .subsection-title {
              font-size: 14pt;
              font-weight: bold;
              color: #333;
              margin-top: 20px;
              margin-bottom: 10px;
          }

          /* Tables */
          .data-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 11pt;
          }

          .data-table th {
              background-color: #f0f0f0;
              font-weight: bold;
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
          }

          .data-table td {
              padding: 8px;
              border: 1px solid #ddd;
          }

          .data-table tr:nth-child(even) {
              background-color: #f9f9f9;
          }

          /* Monitoring data */
          .cycle-section {
              margin: 25px 0;
              padding: 15px;
              background-color: #f9f9f9;
              border-left: 4px solid #5B21B6;
              page-break-inside: avoid;
          }

          .metric-measurements {
              margin: 15px 0;
          }

          /* Charts */
          .chart-container {
              margin: 30px 0;
              text-align: center;
              page-break-inside: avoid;
          }

          .chart-image {
              max-width: 100%;
              width: 750px;
              height: auto;
              border: 1px solid #ddd;
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          /* Statistics */
          .stats-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
          }

          .stat-card {
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 4px;
          }

          .stat-label {
              font-size: 10pt;
              color: #666;
              margin-bottom: 5px;
          }

          .stat-value {
              font-size: 16pt;
              font-weight: bold;
              color: #5B21B6;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <div class="plan-info"><strong>${this.t('plans-export.planName', locale)}:</strong> {{planName}}</div>
          <div class="plan-info"><strong>${this.t('plans-export.relatedGoal', locale)}:</strong> {{#if associatedProjectName}}{{associatedProjectName}}{{else}}N/A{{/if}}</div>
          <div class="plan-info"><strong>${this.t('plans-export.planResponsible', locale)}:</strong> {{planResponsible}}</div>
      </div>

      <!-- NEW: Cycles Section -->
      {{#if options.includeCycles}}
      {{#if cycles}}
      <div class="section">
          <h2 class="section-title">${this.t('plans-export.cycles', locale)}</h2>

          <table class="data-table">
              <thead>
                  <tr>
                      <th>${this.t('plans-export.cycleName', locale)}</th>
                      <th>${this.t('plans-export.startDate', locale)}</th>
                      <th>${this.t('plans-export.endDate', locale)}</th>
                      <th>${this.t('plans-export.measurementCount', locale)}</th>
                  </tr>
              </thead>
              <tbody>
                  {{#each cycles}}
                  <tr>
                      <td>{{name}}</td>
                      <td>{{formatDate startDate}}</td>
                      <td>{{formatDate endDate}}</td>
                      <td>{{measurementCount}}</td>
                  </tr>
                  {{/each}}
              </tbody>
          </table>
      </div>
      {{/if}}
      {{/if}}

      <!-- NEW: Monitoring Data Section -->
      {{#if options.includeMonitoring}}
      {{#if measurementsByCycle}}
      <div class="section">
          <h2 class="section-title">${this.t('plans-export.monitoringData', locale)}</h2>

          <div class="stats-grid">
              <div class="stat-card">
                  <div class="stat-label">${this.t('plans-export.totalMeasurements', locale)}</div>
                  <div class="stat-value">{{totalMeasurementCount}}</div>
              </div>
              <div class="stat-card">
                  <div class="stat-label">${this.t('plans-export.metricsWithData', locale)}</div>
                  <div class="stat-value">{{uniqueMetricsCount}}</div>
              </div>
          </div>

          {{#each measurementsByCycle}}
          <div class="cycle-section">
              <h3 class="subsection-title">${this.t('plans-export.cycle', locale)}: {{cycleName}}</h3>
              <p><em>{{formatDate startDate}} - {{formatDate endDate}}</em></p>

              {{#if measurements.length}}
              <table class="data-table">
                  <thead>
                      <tr>
                          <th>${this.t('plans-export.metric', locale)}</th>
                          <th>${this.t('plans-export.value', locale)}</th>
                          <th>${this.t('plans-export.unit', locale)}</th>
                          <th>${this.t('plans-export.collectedAt', locale)}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {{#each measurements}}
                      <tr>
                          <td>{{metricName}} ({{metricMnemonic}})</td>
                          <td>{{value}}</td>
                          <td>{{unit}}</td>
                          <td>{{formatDateTime collectedAt}}</td>
                      </tr>
                      {{/each}}
                  </tbody>
              </table>
              {{else}}
              <p><em>${this.t('plans-export.noMeasurements', locale)}</em></p>
              {{/if}}
          </div>
          {{/each}}
      </div>
      {{/if}}
      {{/if}}

      <!-- NEW: Calculations Section -->
      {{#if options.includeCalculations}}
      {{#if calculationsByCycle}}
      <div class="section">
          <h2 class="section-title">${this.t('plans-export.metricCalculations', locale)}</h2>

          {{#each calculationsByCycle}}
          <div class="cycle-section">
              <h3 class="subsection-title">${this.t('plans-export.cycle', locale)}: {{cycleName}}</h3>

              {{#if calculations.length}}
              <table class="data-table">
                  <thead>
                      <tr>
                          <th>${this.t('plans-export.metric', locale)}</th>
                          <th>${this.t('plans-export.formula', locale)}</th>
                          <th>${this.t('plans-export.calculatedValue', locale)}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {{#each calculations}}
                      <tr>
                          <td>{{metricName}} ({{metricMnemonic}})</td>
                          <td><code>{{formula}}</code></td>
                          <td><strong>{{calculatedValue}}</strong></td>
                      </tr>
                      {{/each}}
                  </tbody>
              </table>
              {{else}}
              <p><em>${this.t('plans-export.noCalculations', locale)}</em></p>
              {{/if}}
          </div>
          {{/each}}
      </div>
      {{/if}}
      {{/if}}

      <!-- NEW: Charts Section (from frontend) -->
      {{#if options.includeCharts}}
      {{#if chartImages}}
      <div class="section">
          <h2 class="section-title">${this.t('plans-export.visualizations', locale)}</h2>

          {{#if chartImages.measurementChart}}
          <div class="chart-container">
              <h3 class="subsection-title">${this.t('plans-export.measurementsChart', locale)}</h3>
              <img src="{{chartImages.measurementChart}}" alt="Measurements Chart" class="chart-image" />
          </div>
          {{/if}}

          {{#if chartImages.calculationsChart}}
          <div class="chart-container">
              <h3 class="subsection-title">${this.t('plans-export.calculationsChart', locale)}</h3>
              <img src="{{chartImages.calculationsChart}}" alt="Calculations Chart" class="chart-image" />
          </div>
          {{/if}}
      </div>
      {{/if}}
      {{/if}}

      <!-- Existing: GQM Structure (Objectives, Questions, Metrics) -->
      <div class="section">
          <h2 class="section-title">${this.t('plans-export.gqmStructure', locale)}</h2>
          <ul>
          {{#each objectives}}
              <!-- ...existing objective/question/metric template... -->
          {{/each}}
          </ul>
      </div>
  </body>
  </html>
  `;

  // Calculate statistics
  let totalMeasurementCount = 0;
  const uniqueMetrics = new Set();

  if (planData.measurementsByCycle) {
    planData.measurementsByCycle.forEach(cycleData => {
      totalMeasurementCount += cycleData.measurements.length;
      cycleData.measurements.forEach(m => uniqueMetrics.add(m.metricId));
    });
  }

  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate({
    ...planData,
    options: options || {},
    chartImages: options?.chartImages || {},
    totalMeasurementCount,
    uniqueMetricsCount: uniqueMetrics.size,
  });
}
```

---

## 🌐 Step 6: Add Translation Keys

### File: `src/i18n/translations/en/plans-export.json`

```json
{
  "planName": "Plan Name",
  "relatedGoal": "Related Goal",
  "planResponsible": "Plan Responsible",
  "objective": "Objective",
  "question": "Question",
  "metric": "Metric",
  "generalInfo": "General Information",
  "metricDescription": "Description",
  "metricMnemonic": "Mnemonic",
  "metricFormula": "Formula",
  "controlAnalysis": "Control and Analysis",
  "metricControlRange": "Control Range",
  "analysisProcedure": "Analysis Procedure",
  "analysisFrequency": "Analysis Frequency",
  "analysisResponsible": "Analysis Responsible",
  "measurementDetails": "Measurement Details",
  "measurement": "Measurement",
  "measurementProperties": "Properties",
  "measurementUnit": "Unit",
  "measurementScale": "Scale",
  "measurementProcedure": "Procedure",
  "measurementFrequency": "Frequency",
  "measurementResponsible": "Responsible",

  "cycles": "Measurement Cycles",
  "cycleName": "Cycle Name",
  "cycle": "Cycle",
  "startDate": "Start Date",
  "endDate": "End Date",
  "measurementCount": "Measurements",

  "monitoringData": "Monitoring Data",
  "totalMeasurements": "Total Measurements",
  "metricsWithData": "Metrics with Data",
  "value": "Value",
  "unit": "Unit",
  "collectedAt": "Collected At",
  "noMeasurements": "No measurements recorded for this cycle",

  "metricCalculations": "Metric Calculations",
  "formula": "Formula",
  "calculatedValue": "Calculated Value",
  "noCalculations": "No calculations available for this cycle",

  "visualizations": "Data Visualizations",
  "measurementsChart": "Registered Measurements Chart",
  "calculationsChart": "Metric Calculations Chart",

  "gqmStructure": "GQM Structure"
}
```

### File: `src/i18n/translations/pt/plans-export.json`

```json
{
  "planName": "Nome do Plano",
  "relatedGoal": "Objetivo Relacionado",
  "planResponsible": "Responsável pelo Plano",
  "objective": "Objetivo",
  "question": "Questão",
  "metric": "Métrica",
  "generalInfo": "Informações Gerais",
  "metricDescription": "Descrição",
  "metricMnemonic": "Mnemônico",
  "metricFormula": "Fórmula",
  "controlAnalysis": "Controle e Análise",
  "metricControlRange": "Faixa de Controle",
  "analysisProcedure": "Procedimento de Análise",
  "analysisFrequency": "Frequência de Análise",
  "analysisResponsible": "Responsável pela Análise",
  "measurementDetails": "Detalhes da Medição",
  "measurement": "Medição",
  "measurementProperties": "Propriedades",
  "measurementUnit": "Unidade",
  "measurementScale": "Escala",
  "measurementProcedure": "Procedimento",
  "measurementFrequency": "Frequência",
  "measurementResponsible": "Responsável",

  "cycles": "Ciclos de Medição",
  "cycleName": "Nome do Ciclo",
  "cycle": "Ciclo",
  "startDate": "Data de Início",
  "endDate": "Data de Término",
  "measurementCount": "Medições",

  "monitoringData": "Dados de Monitoramento",
  "totalMeasurements": "Total de Medições",
  "metricsWithData": "Métricas com Dados",
  "value": "Valor",
  "unit": "Unidade",
  "collectedAt": "Coletado em",
  "noMeasurements": "Nenhuma medição registrada para este ciclo",

  "metricCalculations": "Cálculos de Métricas",
  "formula": "Fórmula",
  "calculatedValue": "Valor Calculado",
  "noCalculations": "Nenhum cálculo disponível para este ciclo",

  "visualizations": "Visualizações de Dados",
  "measurementsChart": "Gráfico de Medidas Registradas",
  "calculationsChart": "Gráfico de Cálculos de Métricas",

  "gqmStructure": "Estrutura GQM"
}
```

---

## 🧪 Step 7: Testing

### Create Test File: `src/application/measurement-plans/use-cases/export.service.spec.ts`

```typescript
describe('ExportService - Enhanced Export', () => {
  let service: ExportService;
  let cycleRepository: ICycleRepository;

  beforeEach(() => {
    // Setup test module with mocks
  });

  describe('enrichPlanData', () => {
    it('should fetch cycles when includeCycles is true', async () => {
      const mockCycles = [
        { _id: '1', name: 'Cycle 1', startDate: new Date(), endDate: new Date() }
      ];
      jest.spyOn(cycleRepository, 'findByPlanId').mockResolvedValue(mockCycles);

      const result = await service['enrichPlanData'](
        { _id: 'plan1' },
        { includeCycles: true }
      );

      expect(result.cycles).toBeDefined();
      expect(result.cycles).toHaveLength(1);
    });

    it('should fetch monitoring data when includeMonitoring is true', async () => {
      const mockMeasurements = [
        { metricId: 'm1', value: 100, cycleId: 'c1' }
      ];
      jest.spyOn(cycleRepository, 'getMeasurementDataByPlanId').mockResolvedValue(mockMeasurements);

      const result = await service['enrichPlanData'](
        { _id: 'plan1' },
        { includeMonitoring: true }
      );

      expect(result.measurementsByCycle).toBeDefined();
    });

    it('should fetch calculations when includeCalculations is true', async () => {
      const mockCalculations = [
        { metricId: 'm1', calculatedValue: 50, cycleId: 'c1' }
      ];
      jest.spyOn(cycleRepository, 'getCalculationsByPlanId').mockResolvedValue(mockCalculations);

      const result = await service['enrichPlanData'](
        { _id: 'plan1' },
        { includeCalculations: true }
      );

      expect(result.calculationsByCycle).toBeDefined();
    });
  });

  describe('PDF generation with charts', () => {
    it('should include chart images in PDF', async () => {
      const chartImages = {
        measurementChart: 'data:image/png;base64,ABC123',
        calculationsChart: 'data:image/png;base64,XYZ789',
      };

      const result = await service.generateExport(
        'plan1',
        'org1',
        ExportFormat.PDF,
        { includeCharts: true, chartImages },
        'en'
      );

      expect(result.filePath).toContain('.pdf');
      // Verify PDF contains images
    });
  });
});
```

---

## 📝 Summary Checklist

### DTOs & Interfaces
- [ ] Update `ExportOptionsDto` with new fields
- [ ] Add `ChartImagesDto` interface
- [ ] Add `CycleDto`, `MeasurementDataDto`, `MetricCalculationDto` interfaces
- [ ] Update `ICycleRepository` interface

### Repository
- [ ] Implement `findByPlanId()` method
- [ ] Implement `findByPlanIdWithMeasurements()` method
- [ ] Implement `getMeasurementDataByPlanId()` method
- [ ] Implement `getCalculationsByPlanId()` method

### Export Service
- [ ] Create `enrichPlanData()` private method
- [ ] Update `generateExport()` to use enriched data
- [ ] Update `createHTMLTemplate()` with new sections
- [ ] Add handlebars helpers (`formatDate`, `formatDateTime`)
- [ ] Update CSS styles for new sections

### i18n
- [ ] Add all English translation keys
- [ ] Add all Portuguese translation keys

### Testing
- [ ] Write unit tests for new repository methods
- [ ] Write integration tests for export service
- [ ] Test PDF generation with all options
- [ ] Test with/without chart images
- [ ] Test with empty data scenarios

---

## ⏱️ Estimated Effort

| Task | Time |
|------|------|
| Update DTOs & Interfaces | 30 min |
| Implement Repository Methods | 2 hours |
| Update Export Service | 2 hours |
| Update HTML Template | 1.5 hours |
| Add i18n Keys | 20 min |
| Testing | 1.5 hours |
| **Total** | **~8 hours** |

---

## 🚀 Implementation Order

1. **DTOs** (30 min) - Define data structures first
2. **Repository** (2 hours) - Implement data fetching
3. **Export Service - Data** (1 hour) - Fetch and enrich data
4. **i18n** (20 min) - Add translations
5. **Export Service - Templates** (2 hours) - Update HTML/DOCX
6. **Testing** (1.5 hours) - Verify everything works

---

## 📞 Questions to Answer Before Implementation

1. **Database Schema**: Are the collections named correctly?
   - `measurementdata` for measurement data
   - `metriccalculations` for calculations
   - Confirm collection names

2. **Data Relationships**: How are measurements linked?
   - Measurement → Metric (metricId)
   - Measurement → Cycle (cycleId)
   - Confirm foreign key fields

3. **Calculations Storage**: Where are metric calculations stored?
   - Are they pre-computed and stored?
   - Or calculated on-demand?

4. **Default Options**: Should new options default to true or false?
   - Recommendation: `true` for better first impression

---

This document provides everything needed to implement the backend changes for the enhanced export functionality!
