'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/presentation/components/primitives';
import { PlusIcon, ChartIcon } from '@/presentation/assets/icons';
import { getFunctionTypes, getComplexityLevels } from '@/core/utils/fpaItems';
import { mockEstimates, type Estimate } from './utils/mockEstimates';

export const FPAView = () => {
  const { t } = useTranslation('fpa');
  const [estimates, setEstimates] = useState<Estimate[]>(mockEstimates);

  const functionTypes = getFunctionTypes(t);
  const complexityLevels = getComplexityLevels(t);

  const [newEstimate, setNewEstimate] = useState({
    name: '',
    description: '',
  });

  const handleCreateEstimate = () => {
    if (!newEstimate.name) return;

    const estimate: Estimate = {
      id: Date.now().toString(),
      name: newEstimate.name,
      totalPoints: 0,
      createdAt: new Date(),
      status: 'draft',
    };

    setEstimates(prev => [estimate, ...prev]);
    setNewEstimate({ name: '', description: '' });
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
                {t('createNew')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="estimateName" className="text-sm font-medium text-default">
                    {t('projectName')}
                  </label>
                  <Input
                    id="estimateName"
                    value={newEstimate.name}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('enterProjectName')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="estimateDescription" className="text-sm font-medium text-default">
                    {t('description')}
                  </label>
                  <Input
                    id="estimateDescription"
                    value={newEstimate.description}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('briefDescription')}
                  />
                </div>
              </div>
              <Button onClick={handleCreateEstimate} className="w-full md:w-auto">
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('createEstimate')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('yourEstimates')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estimates.map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium text-default">{estimate.name}</h3>
                      <p className="text-sm text-secondary">
                        {estimate.totalPoints} {t('functionPoints')} • {estimate.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        estimate.status === 'completed' ? 'bg-green-100 text-green-800' :
                        estimate.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`status.${estimate.status}`)}
                      </span>
                      <Button variant="ghost" size="sm">
                        {t('edit')}
                      </Button>
                    </div>
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
                <ChartIcon className="w-5 h-5 text-primary" />
                {t('quickReference')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-default mb-2">{t('functionTypes')}</h4>
                <div className="space-y-2">
                  {functionTypes.map((type) => (
                    <div key={type.value} className="text-sm">
                      <span className="font-medium text-secondary">{type.value}:</span>
                      <span className="ml-1 text-muted">{type.label.split('(')[1]?.replace(')', '') || type.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-default mb-2">{t('complexityLevels')}</h4>
                <div className="space-y-2">
                  {complexityLevels.map((level) => (
                    <div key={level.value} className="text-sm">
                      <span className="font-medium text-secondary">{level.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('totalEstimates')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('totalEstimates')}</span>
                <span className="font-semibold text-default">{estimates.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('completed')}</span>
                <span className="font-semibold text-default">
                  {estimates.filter(e => e.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t('inProgress')}</span>
                <span className="font-semibold text-default">
                  {estimates.filter(e => e.status === 'in_progress').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 