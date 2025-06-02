export type DocumentType = 'guide' | 'reference' | 'tutorial' | 'api' | 'faq';
export type DocumentStatus = 'published' | 'draft' | 'under_review';

export interface Document {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  status: DocumentStatus;
  author: string;
  lastModified: Date;
  readTime: number; // in minutes
  tags: string[];
  category: string;
}

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Getting Started with Function Point Analysis',
    description: 'Complete guide to understanding and implementing FPA methodology',
    type: 'guide',
    status: 'published',
    author: 'Dr. Software Engineering',
    lastModified: new Date('2024-01-10'),
    readTime: 15,
    tags: ['FPA', 'estimation', 'beginner'],
    category: 'Function Point Analysis',
  },
  {
    id: '2',
    title: 'GQM Framework Implementation',
    description: 'Step-by-step tutorial for implementing Goal-Question-Metric framework',
    type: 'tutorial',
    status: 'published',
    author: 'Measurement Team',
    lastModified: new Date('2024-01-08'),
    readTime: 25,
    tags: ['GQM', 'methodology', 'implementation'],
    category: 'Goal-Question-Metric',
  },
  {
    id: '3',
    title: 'API Reference Documentation',
    description: 'Complete API documentation for Measura integration',
    type: 'api',
    status: 'published',
    author: 'Development Team',
    lastModified: new Date('2024-01-05'),
    readTime: 30,
    tags: ['API', 'integration', 'reference'],
    category: 'Technical Reference',
  },
  {
    id: '4',
    title: 'Measurement Planning Best Practices',
    description: 'Guidelines and best practices for creating effective measurement plans',
    type: 'guide',
    status: 'published',
    author: 'Quality Team',
    lastModified: new Date('2024-01-03'),
    readTime: 20,
    tags: ['planning', 'best practices', 'methodology'],
    category: 'Planning',
  },
  {
    id: '5',
    title: 'Frequently Asked Questions',
    description: 'Common questions and answers about using Measura',
    type: 'faq',
    status: 'published',
    author: 'Support Team',
    lastModified: new Date('2023-12-28'),
    readTime: 10,
    tags: ['FAQ', 'help', 'troubleshooting'],
    category: 'Support',
  },
  {
    id: '6',
    title: 'Advanced FPA Techniques',
    description: 'Advanced techniques for complex FPA scenarios',
    type: 'reference',
    status: 'draft',
    author: 'Expert Team',
    lastModified: new Date('2024-01-12'),
    readTime: 35,
    tags: ['FPA', 'advanced', 'techniques'],
    category: 'Function Point Analysis',
  },
]; 