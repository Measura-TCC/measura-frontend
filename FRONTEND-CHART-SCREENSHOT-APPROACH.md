# Frontend Chart Screenshot Approach - Analysis

## 🎯 Concept

Instead of generating charts on the backend, capture them as images on the frontend and send them to the backend for inclusion in the PDF.

---

## ✅ Advantages

### 1. **Reuse Existing Chart Components**
- ✅ You already have the charts working perfectly in React
- ✅ No need to recreate chart logic in the backend
- ✅ Visual consistency - PDF charts look exactly like UI charts
- ✅ All existing chart features work (tooltips data is captured visually)

### 2. **Easier to Implement**
- ✅ Frontend devs can handle the entire feature
- ✅ No backend chart library setup needed
- ✅ No need to learn new charting API for backend
- ✅ Faster development time

### 3. **Better Styling Control**
- ✅ Use the exact same colors, fonts, and styling as the UI
- ✅ Tailwind classes work automatically
- ✅ Theme consistency guaranteed
- ✅ Responsive sizing handled by existing code

### 4. **Flexibility**
- ✅ Can capture any React component (not just charts)
- ✅ Easy to add more visualizations later
- ✅ Can include complex UI elements (legends, tooltips, etc.)
- ✅ Interactive state can be captured (e.g., selected metrics)

### 5. **Technology Stack Benefits**
- ✅ Recharts (your current library) is well-tested and mature
- ✅ Frontend already has all the data formatted correctly
- ✅ No data transformation needed for backend rendering
- ✅ Works with your existing i18n on frontend

---

## ❌ Disadvantages

### 1. **Network Overhead**
- ❌ Larger payload sent to backend (base64 images)
- ❌ Each chart = ~50-200KB in base64
- ❌ Multiple charts = MB of data transferred
- ⚠️ **Impact**: Slower for users with poor internet

### 2. **Memory Usage**
- ❌ Browser must render invisible charts
- ❌ Screenshot process uses client memory
- ❌ Multiple charts could slow down client
- ⚠️ **Impact**: Slower on low-end devices

### 3. **User Experience**
- ❌ Slight delay while screenshots are taken
- ❌ User must wait for chart rendering
- ❌ Could feel "heavy" during export
- ⚠️ **Impact**: Export takes 2-5 seconds longer

### 4. **Browser Compatibility**
- ❌ Relies on browser canvas API
- ❌ Some browsers may have issues
- ❌ Headless browsers (if needed) require special handling
- ⚠️ **Impact**: Rare edge cases might fail

### 5. **Resolution/Quality**
- ❌ Screenshot quality depends on screen resolution
- ❌ Retina displays may produce different sizes
- ❌ Might need scaling adjustments
- ⚠️ **Impact**: Charts may look pixelated on some devices

---

## 🛠️ Implementation Options

### Option A: html2canvas (Most Popular) ⭐ **RECOMMENDED**

**Library**: `html2canvas`

**Pros:**
- ✅ Most popular (20k+ GitHub stars)
- ✅ Works with complex CSS
- ✅ Good documentation
- ✅ Handles SVG (Recharts uses SVG)
- ✅ Active maintenance

**Cons:**
- ⚠️ Can be slow with complex charts
- ⚠️ Some CSS properties not fully supported
- ⚠️ Large bundle size (~200KB)

**Installation:**
```bash
npm install html2canvas
```

**Usage:**
```typescript
import html2canvas from 'html2canvas';

async function captureChart(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2, // 2x resolution for better quality
    logging: false,
    useCORS: true,
  });

  return canvas.toDataURL('image/png');
}
```

---

### Option B: dom-to-image (Good Alternative)

**Library**: `dom-to-image`

**Pros:**
- ✅ Smaller bundle size than html2canvas
- ✅ Simpler API
- ✅ Good SVG support
- ✅ Promise-based

**Cons:**
- ⚠️ Less active maintenance
- ⚠️ Some browser compatibility issues
- ⚠️ Fewer features

**Installation:**
```bash
npm install dom-to-image
```

**Usage:**
```typescript
import domtoimage from 'dom-to-image';

async function captureChart(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const dataUrl = await domtoimage.toPng(element, {
    quality: 1.0,
    width: element.offsetWidth * 2,
    height: element.offsetHeight * 2,
    style: {
      transform: 'scale(2)',
      transformOrigin: 'top left',
      width: element.offsetWidth + 'px',
      height: element.offsetHeight + 'px',
    }
  });

  return dataUrl;
}
```

---

### Option C: Puppeteer on Frontend (Too Heavy)

**NOT RECOMMENDED** - Puppeteer is meant for backend/Node.js, too heavy for frontend.

---

### Option D: Native Canvas Export from Recharts

**Library**: Built-in Recharts feature

**Pros:**
- ✅ No extra dependencies
- ✅ Fast and lightweight
- ✅ Best quality
- ✅ Direct canvas access

**Cons:**
- ⚠️ Requires custom implementation
- ⚠️ Doesn't capture the full styled component
- ⚠️ Only gets the SVG, not surrounding elements

**Usage:**
```typescript
// Recharts is SVG-based, need to convert SVG to canvas
async function rechartToImage(svgElement: SVGElement): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.scale(2, 2);
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
  });
}
```

---

## 🏗️ Recommended Architecture

### Frontend Flow

```typescript
// 1. User clicks "Export PDF"
// 2. Show loading indicator
// 3. Render charts in hidden container
// 4. Capture screenshots
// 5. Send to backend with export request
// 6. Backend generates PDF with images
// 7. Return download link
```

### Implementation Steps

**Step 1: Create Hidden Chart Container**

```tsx
// src/presentation/views/Plans/PlanDetails/components/ExportChartsContainer.tsx

import { useRef, useEffect } from 'react';
import { MeasurementChart } from './MeasurementChart';
import { MetricCalculationsChart } from './MetricCalculationsChart';

interface ExportChartsContainerProps {
  planData: any;
  onChartsReady: (charts: { [key: string]: string }) => void;
}

export const ExportChartsContainer = ({
  planData,
  onChartsReady
}: ExportChartsContainerProps) => {
  const measurementChartRef = useRef<HTMLDivElement>(null);
  const calculationsChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function captureCharts() {
      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const charts: { [key: string]: string } = {};

      // Capture measurement chart
      if (measurementChartRef.current) {
        charts.measurementChart = await captureElement(measurementChartRef.current);
      }

      // Capture calculations chart
      if (calculationsChartRef.current) {
        charts.calculationsChart = await captureElement(calculationsChartRef.current);
      }

      onChartsReady(charts);
    }

    captureCharts();
  }, [planData, onChartsReady]);

  return (
    <div style={{
      position: 'absolute',
      left: '-9999px',
      width: '800px',
      background: 'white',
      padding: '20px'
    }}>
      <div ref={measurementChartRef}>
        <MeasurementChart data={planData.measurementData} />
      </div>

      <div ref={calculationsChartRef}>
        <MetricCalculationsChart data={planData.calculationsData} />
      </div>
    </div>
  );
};
```

**Step 2: Create Screenshot Utility**

```typescript
// src/core/utils/chartCapture.ts

import html2canvas from 'html2canvas';

export async function captureElement(
  element: HTMLElement,
  options?: {
    scale?: number;
    backgroundColor?: string;
  }
): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: options?.scale || 2,
    backgroundColor: options?.backgroundColor || '#ffffff',
    logging: false,
    useCORS: true,
    allowTaint: true,
    // Important for fonts and external resources
    onclone: (clonedDoc) => {
      // Ensure all fonts are loaded
      return document.fonts.ready;
    },
  });

  return canvas.toDataURL('image/png', 1.0);
}

// Compress image if needed (optional)
export function compressBase64Image(
  base64: string,
  maxSizeKB: number = 500
): string {
  // If image is small enough, return as-is
  const sizeKB = (base64.length * 3) / 4 / 1024;
  if (sizeKB <= maxSizeKB) return base64;

  // Create canvas to compress
  const img = new Image();
  img.src = base64;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Reduce quality gradually
  let quality = 0.9;
  let compressed = base64;

  while (quality > 0.3 && (compressed.length * 3) / 4 / 1024 > maxSizeKB) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    compressed = canvas.toDataURL('image/jpeg', quality);
    quality -= 0.1;
  }

  return compressed;
}
```

**Step 3: Update Export Hook**

```typescript
// src/core/hooks/measurementPlans/useMeasurementPlanExport.ts

import { useState } from 'react';
import { captureElement } from '@/core/utils/chartCapture';

export const useMeasurementPlanExport = () => {
  const [isCapturingCharts, setIsCapturingCharts] = useState(false);

  const exportWithCharts = async (
    planId: string,
    format: 'pdf',
    options: ExportOptions
  ) => {
    try {
      setIsCapturingCharts(true);

      // 1. Capture charts if option is enabled
      let chartImages: { [key: string]: string } | undefined;

      if (options.includeCharts) {
        chartImages = await captureCharts();
      }

      // 2. Send export request with chart images
      const response = await measurementPlanService.export({
        organizationId,
        planId,
        data: {
          format,
          locale: i18n.language,
          options: {
            ...options,
            chartImages, // ← Include captured images
          },
        },
      });

      return response;
    } finally {
      setIsCapturingCharts(false);
    }
  };

  return {
    exportWithCharts,
    isCapturingCharts,
  };
};
```

**Step 4: Update Backend DTO**

```typescript
// backend: src/application/measurement-plans/dtos/export.dto.ts

export interface ExportOptionsDto {
  includeDetails?: boolean;
  includeMeasurements?: boolean;
  includeAnalysis?: boolean;
  includeCycles?: boolean;
  includeMonitoring?: boolean;
  includeCharts?: boolean;

  // NEW: Chart images sent from frontend
  chartImages?: {
    measurementChart?: string;     // base64 image
    calculationsChart?: string;    // base64 image
    [key: string]: string;         // Allow additional charts
  };
}
```

**Step 5: Update Backend HTML Template**

```typescript
// backend: src/application/measurement-plans/use-cases/export.service.ts

private createHTMLTemplate(
  planData: any,
  options?: ExportOptionsDto,
  locale: string = 'en',
): string {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- existing styles -->
      <style>
        .chart-section {
          margin: 30px 0;
          page-break-inside: avoid;
        }
        .chart-image {
          width: 100%;
          max-width: 800px;
          height: auto;
          display: block;
          margin: 20px auto;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <!-- existing content -->

      {{#if options.includeCharts}}
      <div class="chart-section">
        <h2>${this.t('plans-export.visualizations', locale)}</h2>

        {{#if chartImages.measurementChart}}
        <h3>${this.t('plans-export.measurementsChart', locale)}</h3>
        <img
          src="{{chartImages.measurementChart}}"
          alt="Measurements Chart"
          class="chart-image"
        />
        {{/if}}

        {{#if chartImages.calculationsChart}}
        <h3>${this.t('plans-export.calculationsChart', locale)}</h3>
        <img
          src="{{chartImages.calculationsChart}}"
          alt="Calculations Chart"
          class="chart-image"
        />
        {{/if}}
      </div>
      {{/if}}
    </body>
    </html>
  `;

  return handlebars.compile(template)({
    ...planData,
    options: options || {},
    chartImages: options?.chartImages || {},
  });
}
```

---

## 📊 Performance Optimization

### 1. **Lazy Rendering**
Only render charts when export is triggered, not on page load.

### 2. **Compression**
```typescript
// Compress images before sending
const compressed = compressBase64Image(chartImage, 300); // Max 300KB
```

### 3. **Parallel Capture**
```typescript
// Capture multiple charts simultaneously
const [chart1, chart2] = await Promise.all([
  captureElement(ref1.current),
  captureElement(ref2.current),
]);
```

### 4. **Progress Indicator**
```typescript
<LoadingModal
  isOpen={isCapturingCharts}
  message={t('export.capturingCharts')}
  progress={captureProgress}
/>
```

### 5. **Caching**
Cache captured charts if user exports multiple times without data changes.

---

## 🎨 Image Quality Settings

### Standard Quality (Recommended)
```typescript
await html2canvas(element, {
  scale: 2,           // 2x resolution
  backgroundColor: '#ffffff',
  imageTimeout: 0,
  logging: false,
});
```

### High Quality (Slower)
```typescript
await html2canvas(element, {
  scale: 3,           // 3x resolution
  backgroundColor: '#ffffff',
  imageTimeout: 0,
  logging: false,
});
```

### Fast/Small Size
```typescript
await html2canvas(element, {
  scale: 1,           // 1x resolution
  backgroundColor: '#ffffff',
  imageTimeout: 0,
  logging: false,
});
```

---

## 🧪 Testing Strategy

### 1. **Test Different Chart Types**
```typescript
it('should capture bar chart correctly', async () => {
  const image = await captureChart('bar-chart');
  expect(image).toStartWith('data:image/png;base64,');
  expect(image.length).toBeGreaterThan(1000);
});
```

### 2. **Test Image Size**
```typescript
it('should produce reasonable image size', async () => {
  const image = await captureChart('chart');
  const sizeKB = (image.length * 3) / 4 / 1024;
  expect(sizeKB).toBeLessThan(500); // Less than 500KB
});
```

### 3. **Test Multiple Charts**
```typescript
it('should capture multiple charts in sequence', async () => {
  const charts = await captureMultipleCharts(['chart1', 'chart2']);
  expect(charts).toHaveLength(2);
});
```

---

## 💰 Cost Comparison

### Backend Chart Generation (chartjs-node-canvas)
- **Setup Time**: 6-8 hours
- **Dependencies**: ~5MB bundle size
- **Maintenance**: Backend devs need to update chart logic
- **Network**: Minimal (no images sent)
- **Server CPU**: Higher (generates charts)
- **Learning Curve**: Medium (new library)

### Frontend Chart Screenshot (html2canvas)
- **Setup Time**: 2-3 hours ⭐
- **Dependencies**: ~200KB bundle size
- **Maintenance**: Minimal (reuses existing charts)
- **Network**: Higher (base64 images sent)
- **Client CPU**: Higher (captures screenshots)
- **Learning Curve**: Low (simple API)

---

## 🎯 My Recommendation

### ⭐ **Use Frontend Screenshot Approach with html2canvas**

**Why:**
1. ✅ **Faster to implement** (2-3 hours vs 6-8 hours)
2. ✅ **Reuses existing React charts** (no duplication)
3. ✅ **Perfect visual consistency** with UI
4. ✅ **Easier for your team** (frontend-focused)
5. ✅ **More maintainable** (one chart codebase)

**Trade-offs accepted:**
- ⚠️ Slightly larger network payload (acceptable in 2025)
- ⚠️ 2-3 second delay during export (acceptable with loading indicator)
- ⚠️ Client-side processing (acceptable for modern devices)

### 📝 Implementation Order

1. **Install html2canvas** (5 min)
2. **Create chart capture utility** (30 min)
3. **Create hidden export container** (1 hour)
4. **Update export hook** (30 min)
5. **Update backend DTO** (15 min)
6. **Update backend HTML template** (30 min)
7. **Test and polish** (1 hour)

**Total: ~3-4 hours** 🚀

---

## 🚦 Decision Matrix

| Criteria | Backend Generation | Frontend Screenshot | Winner |
|----------|-------------------|---------------------|---------|
| Setup Time | 6-8 hours | 2-3 hours | ✅ Frontend |
| Development Effort | High | Low | ✅ Frontend |
| Visual Consistency | Medium | Perfect | ✅ Frontend |
| Maintenance | Backend + Frontend | Frontend only | ✅ Frontend |
| Network Usage | Low | Medium | Backend |
| Server Load | High | Low | ✅ Frontend |
| Client Load | Low | Medium | Backend |
| Bundle Size | 5MB backend | 200KB frontend | ✅ Frontend |
| Flexibility | Low | High | ✅ Frontend |
| **Overall** | | | **✅ Frontend Wins** |

---

## ✅ Conclusion

**Go with the frontend screenshot approach using html2canvas.**

It's faster, easier, more maintainable, and produces better results. The network overhead is negligible with modern internet speeds, and the user experience is actually better because the charts look identical to what they see in the UI.

Want me to start implementing this approach?
