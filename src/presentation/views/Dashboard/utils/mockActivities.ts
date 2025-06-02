type TranslationFunction = (key: string, options?: { [key: string]: string | number }) => string;

export const mockActivities = [
  {
    id: '1',
    type: 'estimate_created' as const,
    title: 'New FPA Estimate Created',
    description: 'Created estimate for "E-commerce Platform" project',
    userId: '1',
    userName: 'John Doe',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    project: 'E-commerce Platform',
  },
  {
    id: '2',
    type: 'goal_updated' as const,
    title: 'GQM Goal Updated',
    description: 'Updated productivity measurement goal',
    userId: '2',
    userName: 'Jane Smith',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    goal: 'productivity measurement',
  },
  {
    id: '3',
    type: 'plan_completed' as const,
    title: 'Measurement Plan Completed',
    description: 'Finalized Q1 measurement plan',
    userId: '3',
    userName: 'Mike Johnson',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    plan: 'Q1',
  },
];

export const getTranslatedActivities = (t: TranslationFunction) => {
  return mockActivities.map(activity => ({
    ...activity,
    title: t(`activities.${activity.type}.title`),
    description: t(`activities.${activity.type}.description`, {
      project: activity.project || '',
      goal: activity.goal || '',
      plan: activity.plan || '',
    }),
  }));
};