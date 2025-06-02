export type GoalStatus = 'active' | 'completed' | 'draft' | 'paused';

export interface Goal {
  id: string;
  name: string;
  description: string;
  purpose: string;
  perspective: string;
  environment: string;
  createdAt: Date;
  status: GoalStatus;
  questionsCount: number;
  metricsCount: number;
}

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Improve Development Productivity',
    description: 'Measure and improve team productivity in software development',
    purpose: 'Characterize',
    perspective: 'Developer',
    environment: 'Development Team',
    createdAt: new Date('2024-01-12'),
    status: 'active',
    questionsCount: 5,
    metricsCount: 8,
  },
  {
    id: '2',
    name: 'Reduce Bug Density',
    description: 'Analyze and reduce the number of bugs in production',
    purpose: 'Improve',
    perspective: 'QA Manager',
    environment: 'Production System',
    createdAt: new Date('2024-01-08'),
    status: 'active',
    questionsCount: 4,
    metricsCount: 6,
  },
  {
    id: '3',
    name: 'Customer Satisfaction Analysis',
    description: 'Understand customer satisfaction with current features',
    purpose: 'Understand',
    perspective: 'Product Manager',
    environment: 'Customer Base',
    createdAt: new Date('2024-01-05'),
    status: 'completed',
    questionsCount: 6,
    metricsCount: 10,
  },
  {
    id: '4',
    name: 'Performance Optimization',
    description: 'Evaluate system performance under load',
    purpose: 'Evaluate',
    perspective: 'System Architect',
    environment: 'Production Environment',
    createdAt: new Date('2024-01-03'),
    status: 'draft',
    questionsCount: 3,
    metricsCount: 7,
  },
]; 