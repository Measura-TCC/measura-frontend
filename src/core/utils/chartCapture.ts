import html2canvas from 'html2canvas';

export interface CaptureOptions {
  /**
   * Scale factor for the screenshot (higher = better quality, larger file)
   * Default: 2 (retina quality)
   */
  scale?: number;

  /**
   * Background color for transparent elements
   * Default: '#ffffff'
   */
  backgroundColor?: string;

  /**
   * Whether to compress the image after capture
   * Default: true
   */
  compress?: boolean;

  /**
   * JPEG quality for compression (0-1)
   * Default: 0.85
   */
  quality?: number;
}

export interface ChartImage {
  /**
   * Unique identifier for the chart
   */
  id: string;

  /**
   * Base64 encoded image data (data:image/png;base64,...)
   */
  data: string;

  /**
   * Original width of the chart in pixels
   */
  width: number;

  /**
   * Original height of the chart in pixels
   */
  height: number;
}

/**
 * Captures a DOM element as a base64 image using html2canvas
 *
 * @param element - The DOM element to capture
 * @param options - Capture options
 * @returns Promise with base64 image data
 */
export const captureElement = async (
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<string> => {
  const {
    scale = 2,
    backgroundColor = '#ffffff',
    compress = true,
    quality = 0.85,
  } = options;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scale: scale,
    } as any);

    // Convert to base64
    let base64Image: string;

    if (compress) {
      // Convert to JPEG for compression
      base64Image = canvas.toDataURL('image/jpeg', quality);
    } else {
      // Use PNG for lossless quality
      base64Image = canvas.toDataURL('image/png');
    }

    return base64Image;
  } catch (error) {
    console.error('Error capturing element:', error);
    throw new Error('Failed to capture chart image');
  }
};

/**
 * Captures a chart element and returns a ChartImage object
 *
 * @param chartId - Unique identifier for the chart
 * @param element - The DOM element to capture
 * @param options - Capture options
 * @returns Promise with ChartImage object
 */
export const captureChart = async (
  chartId: string,
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<ChartImage> => {
  const base64Data = await captureElement(element, options);

  return {
    id: chartId,
    data: base64Data,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
};

/**
 * Captures multiple chart elements and returns an array of ChartImage objects
 *
 * @param charts - Array of chart identifiers and their DOM elements
 * @param options - Capture options
 * @returns Promise with array of ChartImage objects
 */
export const captureMultipleCharts = async (
  charts: Array<{ id: string; element: HTMLElement }>,
  options: CaptureOptions = {}
): Promise<ChartImage[]> => {
  try {
    const capturePromises = charts.map(({ id, element }) =>
      captureChart(id, element, options)
    );

    return await Promise.all(capturePromises);
  } catch (error) {
    console.error('Error capturing multiple charts:', error);
    throw new Error('Failed to capture one or more chart images');
  }
};

/**
 * Compresses a base64 image by reducing quality
 *
 * @param base64Image - Base64 encoded image
 * @param quality - JPEG quality (0-1)
 * @returns Promise with compressed base64 image
 */
export const compressBase64Image = async (
  base64Image: string,
  quality: number = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Convert to JPEG with specified quality
      const compressedImage = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedImage);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = base64Image;
  });
};

/**
 * Calculates the approximate size of a base64 image in bytes
 *
 * @param base64Image - Base64 encoded image
 * @returns Size in bytes
 */
export const getBase64ImageSize = (base64Image: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64Image.split(',')[1] || base64Image;

  // Calculate size: (base64 length * 0.75) - padding
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return (base64Data.length * 0.75) - padding;
};

/**
 * Formats bytes to human-readable size
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
