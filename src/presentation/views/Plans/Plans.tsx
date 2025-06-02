'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/presentation/components/primitives';
import { DocumentIcon, PlusIcon } from '@/presentation/assets/icons';
import { mockPlans, type Plan } from './utils/mockPlans';

export const PlansView = () => {
  const { t } = useTranslation('plans');
  const [plans, setPlans] = useState<Plan[]>(mockPlans);

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    type: 'measurement' as const,
    owner: '',
  });

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.description || !newPlan.owner) return;

    const plan: Plan = {
      id: Date.now().toString(),
      name: newPlan.name,
      description: newPlan.description,
      type: newPlan.type,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      status: 'draft',
      owner: newPlan.owner,
      progress: 0,
      goalsCount: 0,
      metricsCount: 0,
    };

    setPlans(prev => [plan, ...prev]);
    setNewPlan({ name: '', description: '', type: 'measurement', owner: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t('title')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5 text-primary" />
                {t('createNewPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="planName" className="text-sm font-medium text-default">
                    {t('planName')}
                  </label>
                  <Input
                    id="planName"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('enterPlanName')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="planDescription" className="text-sm font-medium text-default">
                    {t('planDescription')}
                  </label>
                  <Input
                    id="planDescription"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('descriptionPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="planType" className="text-sm font-medium text-default">
                    {t('type')}
                  </label>
                  <Input
                    id="planType"
                    value={newPlan.type}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value as typeof newPlan.type }))}
                    placeholder={t('enterPlanType')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="planOwner" className="text-sm font-medium text-default">
                    {t('owner')}
                  </label>
                  <Input
                    id="planOwner"
                    value={newPlan.owner}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, owner: e.target.value }))}
                    placeholder={t('enterPlanOwner')}
                  />
                </div>
              </div>
              <Button onClick={handleCreatePlan} className="w-full md:w-auto">
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('createPlan')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('yourPlans')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-default">{plan.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                        plan.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`status.${plan.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-3">{plan.description}</p>
                    <div className="mb-2">
                      <h4 className="text-xs font-medium text-secondary mb-1">{t('type')}:</h4>
                      <span className="px-2 py-1 bg-background-secondary text-xs rounded">
                        {plan.type}
                      </span>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-xs font-medium text-secondary mb-1">{t('owner')}:</h4>
                      <span className="px-2 py-1 bg-background-secondary text-xs rounded">
                        {plan.owner}
                      </span>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-xs font-medium text-secondary mb-1">{t('progress')}:</h4>
                      <div className="w-full bg-background-secondary rounded-full h-2">
                        <div
                          className="h-2 bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted mt-1">{plan.progress}%</span>
                    </div>
                    <p className="text-xs text-muted">{plan.startDate.toLocaleDateString()} - {plan.endDate.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DocumentIcon className="w-5 h-5 text-primary" />
                {t('templates')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background-secondary">
                <h4 className="font-medium text-default text-sm">{t('qualityAssurance')}</h4>
                <p className="text-xs text-muted mt-1">{t('qualityDescription')}</p>
              </div>
              <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background-secondary">
                <h4 className="font-medium text-default text-sm">{t('productivityAnalysis')}</h4>
                <p className="text-xs text-muted mt-1">{t('productivityDescription')}</p>
              </div>
              <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background-secondary">
                <h4 className="font-medium text-default text-sm">{t('projectPerformance')}</h4>
                <p className="text-xs text-muted mt-1">{t('performanceDescription')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('totalPlans')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('totalPlans')}</span>
                <span className="font-semibold text-default">{plans.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('status.active')}</span>
                <span className="font-semibold text-default">
                  {plans.filter(p => p.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('status.completed')}</span>
                <span className="font-semibold text-default">
                  {plans.filter(p => p.status === 'completed').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 