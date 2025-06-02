export type EstimateStatus = 'completed' | 'in_progress' | 'draft';

export interface Estimate {
  id: string;
  name: string;
  totalPoints: number;
  createdAt: Date;
  status: EstimateStatus;
}

export const mockEstimates: Estimate[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    totalPoints: 245,
    createdAt: new Date('2024-01-15'),
    status: 'completed',
  },
  {
    id: '2',
    name: 'CRM System',
    totalPoints: 189,
    createdAt: new Date('2024-01-10'),
    status: 'in_progress',
  },
  {
    id: '3',
    name: 'Inventory Management',
    totalPoints: 156,
    createdAt: new Date('2024-01-08'),
    status: 'completed',
  },
  {
    id: '4',
    name: 'Mobile Banking App',
    totalPoints: 298,
    createdAt: new Date('2024-01-05'),
    status: 'draft',
  },
]; 