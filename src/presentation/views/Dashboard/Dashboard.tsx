'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/primitives';
import { PlusIcon, ChartIcon} from '@/presentation/assets/icons';
import { formatRelativeTime } from '@/core/utils';
import { useTranslation } from 'react-i18next';
import { getTranslatedActivities } from './utils/mockActivities';

interface DashboardViewProps {
  user: {
    name: string;
    role: string;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user }) => {
  const { t } = useTranslation('dashboard');
  const [activities] = useState(() => getTranslatedActivities(t));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t('title')}</h1>
        <p className="text-muted mt-1">{t('welcome', { name: user?.name })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-primary" />
              {t('quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('newFPAEstimate')}
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('createGQMGoal')}
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('newMeasurementPlan')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('statistics')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t('totalEstimates')}</span>
              <span className="font-semibold text-default">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t('activeGoals')}</span>
              <span className="font-semibold text-default">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t('completedPlans')}</span>
              <span className="font-semibold text-default">5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('yourRole')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-secondary">{t('currentRole')}</p>
              <p className="font-semibold text-default capitalize">{user?.role}</p>
              <p className="text-sm text-muted">
                {user?.role === 'admin' && t('role.admin')}
                {user?.role === 'manager' && t('role.manager')}
                {user?.role === 'analyst' && t('role.analyst')}
                {user?.role === 'user' && t('role.user')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-default">{activity.title}</p>
                  <p className="text-sm text-secondary">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted">{activity.userName}</span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs text-muted">{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 