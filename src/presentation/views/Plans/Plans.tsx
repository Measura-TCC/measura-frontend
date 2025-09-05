'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlansTabs } from './components/PlansTabs';
import { PlansPageHeader } from './components/PlansPageHeader';
import { OrganizationAlert } from './components/OrganizationAlert';
import { OverviewTab } from './components/Tabs/OverviewTab';
import { PlansTab as PlansListTab } from './components/Tabs/PlansTab';
import { TemplatesTab } from './components/Tabs/TemplatesTab';
import { GQMTab } from './components/Tabs/GQMTab';
import { mockPlans, type Plan } from './utils/mockPlans';

type TabKey = 'overview' | 'plans' | 'templates' | 'gqm';

export const PlansView = () => {
  const { t } = useTranslation('plans');
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const hasOrganization = true; // placeholder for future org integration

  const totalPlans = plans.length;
  const activeCount = plans.filter(p => p.status === 'active').length;
  const completedCount = plans.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      <PlansPageHeader hasOrganization={hasOrganization} />

      <OrganizationAlert hasOrganization={hasOrganization} />

      <PlansTabs activeTab={activeTab} onTabChange={setActiveTab} hasOrganization={hasOrganization} />

      {activeTab === 'overview' && (
        <OverviewTab totalPlans={totalPlans} activePlans={activeCount} completedPlans={completedCount} />
      )}

      {activeTab === 'plans' && <PlansListTab plans={plans} setPlans={setPlans} />}

      {activeTab === 'templates' && <TemplatesTab onApplyTemplate={() => setActiveTab('plans')} />}

      {activeTab === 'gqm' && <GQMTab />}
    </div>
  );
};
