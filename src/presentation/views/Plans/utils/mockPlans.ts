export type PlanStatus = 'active' | 'completed' | 'draft' | 'scheduled';
export type PlanType = 'measurement' | 'estimation' | 'quality' | 'performance';

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  startDate: Date;
  endDate: Date;
  status: PlanStatus;
  owner: string;
  progress: number;
  goalsCount: number;
  metricsCount: number;
}

export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Q1 2024 Measurement Plan',
    description: 'Comprehensive measurement plan for first quarter initiatives',
    type: 'measurement',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    owner: 'Sarah Johnson',
    progress: 65,
    goalsCount: 8,
    metricsCount: 15,
  },
  {
    id: '2',
    name: 'Software Quality Assessment',
    description: 'Quality metrics and improvement tracking for core products',
    type: 'quality',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    owner: 'Mike Chen',
    progress: 30,
    goalsCount: 5,
    metricsCount: 12,
  },
  {
    id: '3',
    name: 'Performance Optimization Initiative',
    description: 'System performance measurement and optimization goals',
    type: 'performance',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    status: 'scheduled',
    owner: 'Alex Rodriguez',
    progress: 0,
    goalsCount: 4,
    metricsCount: 8,
  },
  {
    id: '4',
    name: 'Development Team Productivity',
    description: 'Track and improve development team efficiency metrics',
    type: 'measurement',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    owner: 'Emily Davis',
    progress: 100,
    goalsCount: 6,
    metricsCount: 10,
  },
  {
    id: '5',
    name: 'Customer Experience Metrics',
    description: 'Measurement plan for customer satisfaction and engagement',
    type: 'measurement',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-08-31'),
    status: 'draft',
    owner: 'David Wilson',
    progress: 0,
    goalsCount: 7,
    metricsCount: 14,
  },
]; 