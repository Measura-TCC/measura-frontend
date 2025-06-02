'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/primitives';
import { BookIcon, ChartIcon, TargetIcon, DocumentIcon } from '@/presentation/assets/icons';
import { mockDocuments } from './utils/mockDocuments';

export const DocumentationView = () => {
  const { t } = useTranslation('docs');

  const sections = [
    {
      id: 'fpa',
      title: t('fpa.title'),
      icon: ChartIcon,
      description: t('fpa.description'),
      topics: [
        'Understanding Function Points',
        'Function Types (EI, EO, EQ, ILF, EIF)',
        'Complexity Assessment',
        'Adjustment Factors',
        'Calculating Final FP Count',
      ],
    },
    {
      id: 'gqm',
      title: t('gqm.title'),
      icon: TargetIcon,
      description: t('gqm.description'),
      topics: [
        'GQM Methodology Overview',
        'Defining Measurement Goals',
        'Formulating Questions',
        'Selecting Metrics',
        'Implementation Best Practices',
      ],
    },
    {
      id: 'plans',
      title: t('plans.title'),
      icon: DocumentIcon,
      description: t('plans.description'),
      topics: [
        'Planning Process',
        'Stakeholder Identification',
        'Resource Allocation',
        'Timeline Definition',
        'Risk Assessment',
      ],
    },
  ];

  const quickLinks = [
    { name: 'Getting Started Guide', href: '#getting-started' },
    { name: 'Best Practices', href: '#best-practices' },
    { name: 'Common Pitfalls', href: '#pitfalls' },
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Glossary', href: '#glossary' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t('title')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookIcon className="w-5 h-5 text-primary" />
                {t('gettingStarted')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary">
                {t('welcome')}
              </p>
              <div className="bg-background-accent p-4 rounded-lg">
                <h4 className="font-medium text-default mb-2">{t('whatYouLearn')}</h4>
                <ul className="text-sm text-secondary space-y-1">
                  <li>{t('learnFPA')}</li>
                  <li>{t('learnGQM')}</li>
                  <li>{t('learnPlans')}</li>
                  <li>{t('learnBestPractices')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('availableDocuments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 border border-border rounded-lg hover:bg-background-secondary cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-default">{doc.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'published' ? 'bg-green-100 text-green-800' :
                        doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-2">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>By {doc.author}</span>
                      <span>{doc.readTime} {t('readTime')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-background-accent text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="w-5 h-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-secondary">{section.description}</p>
                    <div>
                      <h5 className="text-sm font-medium text-default mb-2">Topics:</h5>
                      <ul className="text-xs text-muted space-y-1">
                        {section.topics.map((topic, index) => (
                          <li key={index}>• {topic}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('faq')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-default mb-1">{t('faqItems.whatIsFPA')}</h4>
                  <p className="text-sm text-secondary">
                    {t('faqItems.fpaAnswer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-default mb-1">{t('faqItems.howGQMHelps')}</h4>
                  <p className="text-sm text-secondary">
                    {t('faqItems.gqmAnswer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-default mb-1">{t('faqItems.canUseBoth')}</h4>
                  <p className="text-sm text-secondary">
                    {t('faqItems.bothAnswer')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('quickLinks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a key={link.name} href={link.href} className="block text-sm text-primary hover:text-primary-dark">
                    {link.name}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('needHelp')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-secondary">
                {t('helpDescription')}
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted">📧 support@measura.com</p>
                <p className="text-xs text-muted">📞 +1 (555) 123-4567</p>
                <p className="text-xs text-muted">💬 Live chat available</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('versionInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted">
                <p>{t('application')}: v1.0.0</p>
                <p>{t('documentation')}: v1.0.0</p>
                <p>{t('lastUpdated')}: {new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 