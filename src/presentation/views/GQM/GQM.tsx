'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/presentation/components/primitives';
import { TargetIcon, PlusIcon } from '@/presentation/assets/icons';
import { getGqmTemplates, generateGoalStatement } from '@/core/utils/gqmItems';
import { mockGoals, type Goal } from './utils/mockGoals';

export const GQMView = () => {
  const { t } = useTranslation('gqm');
  const [goals, setGoals] = useState<Goal[]>(mockGoals);

  const gqmTemplates = getGqmTemplates(t);

  const [newGoal, setNewGoal] = useState({
    name: '',
    purpose: '',
    issue: '',
    object: '',
    viewpoint: '',
    context: '',
  });

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.purpose || !newGoal.issue || !newGoal.object || !newGoal.viewpoint || !newGoal.context) return;

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      description: generateGoalStatement(newGoal.purpose, newGoal.issue, newGoal.object, newGoal.viewpoint, newGoal.context),
      purpose: newGoal.purpose,
      perspective: newGoal.viewpoint,
      environment: newGoal.context,
      createdAt: new Date(),
      status: 'draft',
      questionsCount: 0,
      metricsCount: 0,
    };

    setGoals(prev => [goal, ...prev]);
    setNewGoal({ name: '', purpose: '', issue: '', object: '', viewpoint: '', context: '' });
  };

  const handleTemplateSelect = (template: typeof gqmTemplates[0]) => {
    setNewGoal({
      name: template.name,
      purpose: template.purpose,
      issue: template.issue,
      object: template.object,
      viewpoint: template.viewpoint,
      context: template.context,
    });
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
                {t('createNewGoal')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="goalName" className="text-sm font-medium text-default">
                    {t('goalName')}
                  </label>
                  <Input
                    id="goalName"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('enterGoalName')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="purpose" className="text-sm font-medium text-default">
                    {t('purpose')}
                  </label>
                  <Input
                    id="purpose"
                    value={newGoal.purpose}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder={t('purposePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="issue" className="text-sm font-medium text-default">
                    {t('issue')}
                  </label>
                  <Input
                    id="issue"
                    value={newGoal.issue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, issue: e.target.value }))}
                    placeholder={t('issuePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="object" className="text-sm font-medium text-default">
                    {t('object')}
                  </label>
                  <Input
                    id="object"
                    value={newGoal.object}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, object: e.target.value }))}
                    placeholder={t('objectPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="viewpoint" className="text-sm font-medium text-default">
                    {t('viewpoint')}
                  </label>
                  <Input
                    id="viewpoint"
                    value={newGoal.viewpoint}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, viewpoint: e.target.value }))}
                    placeholder={t('viewpointPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="context" className="text-sm font-medium text-default">
                    {t('context')}
                  </label>
                  <Input
                    id="context"
                    value={newGoal.context}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, context: e.target.value }))}
                    placeholder={t('contextPlaceholder')}
                  />
                </div>
              </div>
              <Button onClick={handleCreateGoal} className="w-full md:w-auto">
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('createGoal')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('yourGoals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-default">{goal.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`status.${goal.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-2">{goal.description}</p>
                    <p className="text-xs text-muted">{goal.createdAt.toLocaleDateString()}</p>
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
                <TargetIcon className="w-5 h-5 text-primary" />
                {t('templates')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {gqmTemplates.map((template) => (
                <div key={template.id} className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background-secondary"
                     onClick={() => handleTemplateSelect(template)}>
                  <h4 className="font-medium text-default text-sm">{template.name}</h4>
                  <p className="text-xs text-muted mt-1">{template.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('totalGoals')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('totalGoals')}</span>
                <span className="font-semibold text-default">{goals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('active')}</span>
                <span className="font-semibold text-default">
                  {goals.filter(g => g.status === 'active').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 