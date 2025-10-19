"use client";

// Internationalization configuration
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import Portuguese resources
import ptLayout from "./locales/pt/layout.json";
import ptNav from "./locales/pt/nav.json";
import ptDashboard from "./locales/pt/dashboard.json";
import ptFPA from "./locales/pt/fpa.json";
import ptGQM from "./locales/pt/gqm.json";
import ptPlans from "./locales/pt/plans.json";
import ptCommon from "./locales/pt/common.json";
import ptLogin from "./locales/pt/login.json";
import ptRegister from "./locales/pt/register.json";
import ptOrganization from "./locales/pt/organization.json";
import ptProjects from "./locales/pt/projects.json";
import ptAccount from "./locales/pt/account.json";
import ptHome from "./locales/pt/home.json";
import ptValidation from "./locales/pt/validation.json";
import ptOnboarding from "./locales/pt/onboarding.json";

// Import English resources
import enLayout from "./locales/en/layout.json";
import enNav from "./locales/en/nav.json";
import enDashboard from "./locales/en/dashboard.json";
import enFPA from "./locales/en/fpa.json";
import enGQM from "./locales/en/gqm.json";
import enPlans from "./locales/en/plans.json";
import enCommon from "./locales/en/common.json";
import enLogin from "./locales/en/login.json";
import enRegister from "./locales/en/register.json";
import enOrganization from "./locales/en/organization.json";
import enProjects from "./locales/en/projects.json";
import enAccount from "./locales/en/account.json";
import enHome from "./locales/en/home.json";
import enValidation from "./locales/en/validation.json";
import enOnboarding from "./locales/en/onboarding.json";

const resources = {
  pt: {
    layout: ptLayout,
    nav: ptNav,
    dashboard: ptDashboard,
    fpa: ptFPA,
    gqm: ptGQM,
    plans: ptPlans,
    common: ptCommon,
    login: ptLogin,
    register: ptRegister,
    organization: ptOrganization,
    projects: ptProjects,
    account: ptAccount,
    home: ptHome,
    validation: ptValidation,
    onboarding: ptOnboarding,
  },
  en: {
    layout: enLayout,
    nav: enNav,
    dashboard: enDashboard,
    fpa: enFPA,
    gqm: enGQM,
    plans: enPlans,
    common: enCommon,
    login: enLogin,
    register: enRegister,
    organization: enOrganization,
    projects: enProjects,
    account: enAccount,
    home: enHome,
    validation: enValidation,
    onboarding: enOnboarding,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
