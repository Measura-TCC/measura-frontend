module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/core/i18n/locales/pt/layout.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Measura - Estimativa & Medição de Software\",\"description\":\"Uma aplicação web modular para medição e estimativa de software\"}"));}}),
"[project]/src/core/i18n/locales/pt/nav.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"dashboard\":\"Dashboard\",\"fpa\":\"APF\",\"gqm\":\"GQM\",\"plans\":\"Planos\",\"docs\":\"Documentação\"}"));}}),
"[project]/src/core/i18n/locales/pt/dashboard.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Dashboard\",\"welcome\":\"Bem-vindo de volta, {{name}}\",\"quickActions\":\"Ações Rápidas\",\"newFPAEstimate\":\"Nova Estimativa APF\",\"createGQMGoal\":\"Criar Meta GQM\",\"newMeasurementPlan\":\"Novo Plano de Medição\",\"statistics\":\"Estatísticas\",\"totalEstimates\":\"Total de Estimativas\",\"activeGoals\":\"Metas Ativas\",\"completedPlans\":\"Planos Concluídos\",\"yourRole\":\"Seu Cargo\",\"currentRole\":\"Cargo Atual\",\"role\":{\"admin\":\"Acesso completo ao sistema e gerenciamento de usuários\",\"manager\":\"Planejamento de medição e supervisão de equipe\",\"analyst\":\"Capacidades de análise APF e GQM\",\"user\":\"Atividades básicas de medição\"},\"recentActivity\":\"Atividade Recente\",\"activities\":{\"estimate_created\":{\"title\":\"Nova Estimativa APF Criada\",\"description\":\"Estimativa criada para o projeto \\\"{{project}}\\\"\"},\"goal_updated\":{\"title\":\"Meta GQM Atualizada\",\"description\":\"Meta de {{goal}} atualizada\"},\"plan_completed\":{\"title\":\"Plano de Medição Concluído\",\"description\":\"Plano de medição {{plan}} finalizado\"}}}"));}}),
"[project]/src/core/i18n/locales/pt/fpa.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Análise de Pontos de Função\",\"subtitle\":\"Crie e gerencie estimativas APF\",\"createNew\":\"Criar Nova Estimativa\",\"projectName\":\"Nome do Projeto\",\"description\":\"Descrição\",\"enterProjectName\":\"Digite o nome do projeto\",\"briefDescription\":\"Breve descrição\",\"createEstimate\":\"Criar Estimativa\",\"yourEstimates\":\"Suas Estimativas\",\"functionPoints\":\"pontos de função\",\"edit\":\"Editar\",\"quickReference\":\"Referência Rápida de APF\",\"functionTypes\":\"Tipos de Função\",\"complexityLevels\":\"Níveis de Complexidade\",\"totalEstimates\":\"Total de Estimativas\",\"completed\":\"Concluídas\",\"inProgress\":\"Em Progresso\",\"status\":{\"completed\":\"concluída\",\"in_progress\":\"em progresso\",\"draft\":\"rascunho\"},\"functionTypeLabels\":{\"EI\":\"Entrada Externa (EI)\",\"EO\":\"Saída Externa (EO)\",\"EQ\":\"Consulta Externa (EQ)\",\"ILF\":\"Arquivo Lógico Interno (ILF)\",\"EIF\":\"Arquivo de Interface Externa (EIF)\"},\"complexityLabels\":{\"LOW\":\"Baixa\",\"AVERAGE\":\"Média\",\"HIGH\":\"Alta\"},\"adjustmentFactors\":{\"data_communications\":\"Comunicação de Dados\",\"distributed_processing\":\"Processamento Distribuído de Dados\",\"performance\":\"Performance\",\"configuration\":\"Configuração Altamente Utilizada\",\"transaction_rate\":\"Taxa de Transação\",\"online_data_entry\":\"Entrada de Dados On-Line\",\"end_user_efficiency\":\"Eficiência do Usuário Final\",\"online_update\":\"Atualização On-Line\",\"complex_processing\":\"Processamento Complexo\",\"reusability\":\"Reusabilidade\",\"installation_ease\":\"Facilidade de Instalação\",\"operational_ease\":\"Facilidade Operacional\",\"multiple_sites\":\"Múltiplos Locais\",\"facilitate_change\":\"Facilitar Mudanças\"}}"));}}),
"[project]/src/core/i18n/locales/pt/gqm.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Goal-Question-Metric\",\"subtitle\":\"Definir metas de medição e acompanhar métricas\",\"createNewGoal\":\"Criar Nova Meta\",\"goalName\":\"Nome da Meta\",\"purpose\":\"Propósito\",\"issue\":\"Questão\",\"object\":\"Objeto\",\"viewpoint\":\"Ponto de Vista\",\"context\":\"Contexto\",\"enterGoalName\":\"Digite o nome da meta\",\"purposePlaceholder\":\"Analisar, Avaliar, Melhorar...\",\"issuePlaceholder\":\"produtividade, qualidade, custo...\",\"objectPlaceholder\":\"produto de software, processo...\",\"viewpointPlaceholder\":\"desenvolvedor, gerente, usuário...\",\"contextPlaceholder\":\"ambiente do projeto...\",\"createGoal\":\"Criar Meta\",\"yourGoals\":\"Suas Metas\",\"templates\":\"Modelos GQM\",\"totalGoals\":\"Total de Metas\",\"active\":\"Ativas\",\"status\":{\"active\":\"ativa\",\"completed\":\"concluída\",\"draft\":\"rascunho\",\"paused\":\"pausada\"},\"gqmTemplates\":{\"productivity\":{\"name\":\"Medição de Produtividade\",\"description\":\"Medir e melhorar a produtividade da equipe de desenvolvimento\",\"purpose\":\"Analisar\",\"issue\":\"produtividade\",\"object\":\"processo de desenvolvimento\",\"viewpoint\":\"gerente de projeto\",\"context\":\"projeto de desenvolvimento de software\"},\"quality\":{\"name\":\"Avaliação de Qualidade\",\"description\":\"Monitorar e melhorar a qualidade do software\",\"purpose\":\"Avaliar\",\"issue\":\"qualidade\",\"object\":\"produto de software\",\"viewpoint\":\"garantia de qualidade\",\"context\":\"ciclo de vida de desenvolvimento de software\"},\"delivery\":{\"name\":\"Performance de Entrega\",\"description\":\"Acompanhar cronogramas e performance de entrega\",\"purpose\":\"Monitorar\",\"issue\":\"performance de entrega\",\"object\":\"cronograma do projeto\",\"viewpoint\":\"stakeholder\",\"context\":\"gerenciamento de projeto\"},\"maintenance\":{\"name\":\"Eficiência de Manutenção\",\"description\":\"Medir esforço e eficiência de manutenção\",\"purpose\":\"Melhorar\",\"issue\":\"custo de manutenção\",\"object\":\"sistema de software\",\"viewpoint\":\"equipe de desenvolvimento\",\"context\":\"fase de manutenção\"}},\"commonQuestions\":{\"productivity\":[\"Quantos pontos de função são entregues por desenvolvedor por mês?\",\"Qual é o tempo médio para completar uma história do usuário?\",\"Quantos defeitos são introduzidos por ponto de função?\",\"Qual é a eficiência da revisão de código?\"],\"quality\":[\"Qual é a densidade de defeitos no software entregue?\",\"Quantos defeitos são encontrados em testes vs produção?\",\"Qual é a porcentagem de cobertura de código?\",\"Quanto tempo leva para corrigir um defeito?\"],\"delivery\":[\"Qual porcentagem de entregas são pontuais?\",\"Quão precisas são as estimativas de esforço?\",\"Qual é a tendência de velocidade ao longo dos sprints?\",\"Quantas mudanças de escopo ocorrem durante o desenvolvimento?\"]},\"metricTemplates\":[{\"name\":\"Pontos de Função por Desenvolvedor\",\"unit\":\"PF/pessoa/mês\",\"description\":\"Métrica de produtividade medindo pontos de função entregues por desenvolvedor por mês\"},{\"name\":\"Densidade de Defeitos\",\"unit\":\"defeitos/KLOC\",\"description\":\"Métrica de qualidade medindo defeitos por mil linhas de código\"},{\"name\":\"Cobertura de Código\",\"unit\":\"%\",\"description\":\"Métrica de qualidade medindo porcentagem de código coberto por testes\"},{\"name\":\"Tempo de Ciclo da História\",\"unit\":\"dias\",\"description\":\"Métrica de entrega medindo tempo do início ao fim da história\"},{\"name\":\"Velocidade\",\"unit\":\"pontos de história/sprint\",\"description\":\"Métrica de entrega medindo pontos de história completados por sprint\"},{\"name\":\"Tempo de Resolução de Defeitos\",\"unit\":\"horas\",\"description\":\"Métrica de qualidade medindo tempo médio para resolver defeitos\"}]}"));}}),
"[project]/src/core/i18n/locales/pt/plans.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Planos de Medição\",\"subtitle\":\"Crie e gerencie planos de medição para seus projetos\",\"createNewPlan\":\"Criar Novo Plano\",\"planName\":\"Nome do Plano\",\"planDescription\":\"Descrição\",\"type\":\"Tipo\",\"owner\":\"Responsável\",\"enterPlanName\":\"Digite o nome do plano\",\"descriptionPlaceholder\":\"Breve descrição do plano de medição\",\"enterPlanType\":\"Digite o tipo do plano\",\"enterPlanOwner\":\"Digite o responsável pelo plano\",\"createPlan\":\"Criar Plano\",\"yourPlans\":\"Seus Planos\",\"progress\":\"Progresso\",\"templates\":\"Modelos de Plano\",\"qualityAssurance\":\"Plano de Garantia de Qualidade\",\"qualityDescription\":\"Foco em métricas de qualidade e rastreamento de defeitos\",\"productivityAnalysis\":\"Plano de Análise de Produtividade\",\"productivityDescription\":\"Medir produtividade e eficiência da equipe\",\"projectPerformance\":\"Plano de Performance do Projeto\",\"performanceDescription\":\"Acompanhar entrega do projeto e métricas de cronograma\",\"totalPlans\":\"Total de Planos\",\"status\":{\"active\":\"ativo\",\"completed\":\"concluído\",\"draft\":\"rascunho\",\"scheduled\":\"agendado\"}}"));}}),
"[project]/src/core/i18n/locales/pt/docs.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Documentação\",\"subtitle\":\"Aprenda a usar o Measura de forma eficaz para medição de software\",\"gettingStarted\":\"Começando\",\"welcome\":\"Bem-vindo ao Measura! Este guia abrangente o ajudará a entender e implementar metodologias de medição de software de forma eficaz.\",\"whatYouLearn\":\"O que você aprenderá:\",\"learnFPA\":\"• Como criar estimativas precisas de software usando APF\",\"learnGQM\":\"• Como definir metas de medição significativas com GQM\",\"learnPlans\":\"• Como criar e gerenciar planos de medição\",\"learnBestPractices\":\"• Melhores práticas para medição de software\",\"availableDocuments\":\"Documentos Disponíveis\",\"readTime\":\"min de leitura\",\"fpa\":{\"title\":\"Análise de Pontos de Função (APF)\",\"description\":\"Aprenda a realizar Análise de Pontos de Função para estimativa de software\"},\"gqm\":{\"title\":\"Goal-Question-Metric (GQM)\",\"description\":\"Domine a abordagem GQM para planejamento de medição\"},\"plans\":{\"title\":\"Planos de Medição\",\"description\":\"Crie planos de medição eficazes para seus projetos\"},\"faq\":\"Perguntas Frequentes\",\"faqItems\":{\"whatIsFPA\":\"O que é Análise de Pontos de Função?\",\"fpaAnswer\":\"Análise de Pontos de Função é um método padronizado para medir o tamanho do software baseado na funcionalidade entregue ao usuário, independente de tecnologia e implementação.\",\"howGQMHelps\":\"Como o GQM ajuda na medição?\",\"gqmAnswer\":\"GQM fornece uma abordagem estruturada para definir metas de medição, derivar questões relevantes e identificar métricas apropriadas para responder essas questões.\",\"canUseBoth\":\"Posso usar APF e GQM juntos?\",\"bothAnswer\":\"Sim! APF fornece estimativa de tamanho enquanto GQM ajuda a definir o que e como medir. Eles se complementam em um programa abrangente de medição.\"},\"quickLinks\":\"Links Rápidos\",\"needHelp\":\"Precisa de Ajuda?\",\"helpDescription\":\"Não consegue encontrar o que procura? Estamos aqui para ajudar!\",\"versionInfo\":\"Informações da Versão\",\"application\":\"Aplicação\",\"documentation\":\"Documentação\",\"lastUpdated\":\"Última atualização\"}"));}}),
"[project]/src/core/i18n/locales/pt/common.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"loading\":\"Carregando...\",\"error\":\"Erro\",\"success\":\"Sucesso\",\"cancel\":\"Cancelar\",\"save\":\"Salvar\",\"delete\":\"Excluir\",\"edit\":\"Editar\",\"create\":\"Criar\",\"search\":\"Pesquisar\",\"filter\":\"Filtrar\",\"export\":\"Exportar\",\"import\":\"Importar\",\"user\":\"Usuário\",\"logout\":\"Sair\",\"themeToggle\":\"Alternar tema\",\"notifications\":\"Notificações\",\"welcome\":\"Bem-vindo ao Measura\",\"appSubtitle\":\"Estimativa & Medição de Software\",\"appDescription\":\"Uma aplicação web modular para medição e estimativa de software usando metodologias de Análise de Pontos de Função (APF) e Goal-Question-Metric (GQM).\",\"quickDemoLogin\":\"Login de Demonstração Rápido\",\"demoDescription\":\"Clique acima para explorar a aplicação com dados de demonstração\",\"keyFeatures\":\"Principais Recursos:\",\"feature1\":\"• Análise de Pontos de Função (APF)\",\"feature2\":\"• Modelagem Goal-Question-Metric (GQM)\",\"feature3\":\"• Criação de planos de medição\",\"feature4\":\"• Controle de acesso baseado em papéis\",\"feature5\":\"• Suporte a tema escuro/claro\",\"footerText\":\"Measura - Estimativa & Medição de Software, Evoluído\",\"techStack\":\"Construído com Next.js, React, TypeScript & Tailwind CSS\"}"));}}),
"[project]/src/core/i18n/locales/pt/login.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Login\",\"subtitle\":\"Entre na sua conta\",\"email\":\"Email\",\"password\":\"Senha\",\"enterYourEmail\":\"Digite seu email\",\"enterYourPassword\":\"Digite sua senha\",\"signingIn\":\"Entrando...\",\"signInButton\":\"Entrar\",\"dontHaveAccount\":\"Não tem uma conta?\",\"signUp\":\"Cadastre-se\",\"fillAllFields\":\"Por favor, preencha todos os campos\",\"invalidCredentials\":\"Email ou senha inválidos\",\"demoCredentials\":\"Credenciais de demonstração: admin@measura.com / password\"}"));}}),
"[project]/src/core/i18n/locales/pt/register.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Cadastro\",\"subtitle\":\"Crie sua conta\",\"username\":\"Nome de usuário\",\"email\":\"E-mail\",\"password\":\"Senha\",\"confirmPassword\":\"Confirmar Senha\",\"role\":\"Função\",\"projectManager\":\"Gerente de Projeto\",\"metricsAnalyst\":\"Analista de Medição\",\"enterFullName\":\"Digite seu nome de usuário\",\"enterEmail\":\"Digite seu e-mail\",\"createPassword\":\"Crie uma senha\",\"confirmYourPassword\":\"Confirme sua senha\",\"createAccountButton\":\"Criar Conta\",\"creatingAccount\":\"Criando conta...\",\"alreadyHaveAccount\":\"Já tem uma conta?\",\"signIn\":\"Entrar\",\"fillAllFields\":\"Por favor, preencha todos os campos\",\"passwordsDoNotMatch\":\"As senhas não coincidem\",\"passwordTooShort\":\"A senha deve ter pelo menos 8 caracteres\",\"registrationFailed\":\"Falha no registro. Tente novamente.\",\"termsAgreement\":\"Ao se cadastrar, você concorda com nossos termos de serviço e política de privacidade\"}"));}}),
"[project]/src/core/i18n/locales/en/layout.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Measura - Software Estimation & Measurement\",\"description\":\"A modular web application for software measurement and estimation\"}"));}}),
"[project]/src/core/i18n/locales/en/nav.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"dashboard\":\"Dashboard\",\"fpa\":\"FPA\",\"gqm\":\"GQM\",\"plans\":\"Plans\",\"docs\":\"Documentation\"}"));}}),
"[project]/src/core/i18n/locales/en/dashboard.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Dashboard\",\"welcome\":\"Welcome back, {{name}}\",\"quickActions\":\"Quick Actions\",\"newFPAEstimate\":\"New FPA Estimate\",\"createGQMGoal\":\"Create GQM Goal\",\"newMeasurementPlan\":\"New Measurement Plan\",\"statistics\":\"Statistics\",\"totalEstimates\":\"Total Estimates\",\"activeGoals\":\"Active Goals\",\"completedPlans\":\"Completed Plans\",\"yourRole\":\"Your Role\",\"currentRole\":\"Current Role\",\"role\":{\"admin\":\"Full system access and user management\",\"manager\":\"Measurement planning and team oversight\",\"analyst\":\"FPA and GQM analysis capabilities\",\"user\":\"Basic measurement activities\"},\"recentActivity\":\"Recent Activity\",\"activities\":{\"estimate_created\":{\"title\":\"New FPA Estimate Created\",\"description\":\"Created estimate for \\\"{{project}}\\\" project\"},\"goal_updated\":{\"title\":\"GQM Goal Updated\",\"description\":\"Updated {{goal}} goal\"},\"plan_completed\":{\"title\":\"Measurement Plan Completed\",\"description\":\"Finalized {{plan}} measurement plan\"}}}"));}}),
"[project]/src/core/i18n/locales/en/fpa.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Function Point Analysis\",\"subtitle\":\"Create and manage FPA estimates\",\"createNew\":\"Create New Estimate\",\"projectName\":\"Project Name\",\"description\":\"Description\",\"enterProjectName\":\"Enter project name\",\"briefDescription\":\"Brief description\",\"createEstimate\":\"Create Estimate\",\"yourEstimates\":\"Your Estimates\",\"functionPoints\":\"function points\",\"edit\":\"Edit\",\"quickReference\":\"FPA Quick Reference\",\"functionTypes\":\"Function Types\",\"complexityLevels\":\"Complexity Levels\",\"totalEstimates\":\"Total Estimates\",\"completed\":\"Completed\",\"inProgress\":\"In Progress\",\"status\":{\"completed\":\"completed\",\"in_progress\":\"in progress\",\"draft\":\"draft\"},\"functionTypeLabels\":{\"EI\":\"External Input (EI)\",\"EO\":\"External Output (EO)\",\"EQ\":\"External Inquiry (EQ)\",\"ILF\":\"Internal Logical File (ILF)\",\"EIF\":\"External Interface File (EIF)\"},\"complexityLabels\":{\"LOW\":\"Low\",\"AVERAGE\":\"Average\",\"HIGH\":\"High\"},\"adjustmentFactors\":{\"data_communications\":\"Data Communications\",\"distributed_processing\":\"Distributed Data Processing\",\"performance\":\"Performance\",\"configuration\":\"Heavily Used Configuration\",\"transaction_rate\":\"Transaction Rate\",\"online_data_entry\":\"On-Line Data Entry\",\"end_user_efficiency\":\"End-User Efficiency\",\"online_update\":\"On-Line Update\",\"complex_processing\":\"Complex Processing\",\"reusability\":\"Reusability\",\"installation_ease\":\"Installation Ease\",\"operational_ease\":\"Operational Ease\",\"multiple_sites\":\"Multiple Sites\",\"facilitate_change\":\"Facilitate Change\"}}"));}}),
"[project]/src/core/i18n/locales/en/gqm.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Goal-Question-Metric\",\"subtitle\":\"Define measurement goals and track metrics\",\"createNewGoal\":\"Create New Goal\",\"goalName\":\"Goal Name\",\"purpose\":\"Purpose\",\"issue\":\"Issue\",\"object\":\"Object\",\"viewpoint\":\"Viewpoint\",\"context\":\"Context\",\"enterGoalName\":\"Enter goal name\",\"purposePlaceholder\":\"Analyze, Evaluate, Improve...\",\"issuePlaceholder\":\"productivity, quality, cost...\",\"objectPlaceholder\":\"software product, process...\",\"viewpointPlaceholder\":\"developer, manager, user...\",\"contextPlaceholder\":\"project environment...\",\"createGoal\":\"Create Goal\",\"yourGoals\":\"Your Goals\",\"templates\":\"GQM Templates\",\"totalGoals\":\"Total Goals\",\"active\":\"Active\",\"status\":{\"active\":\"active\",\"completed\":\"completed\",\"draft\":\"draft\",\"paused\":\"paused\"},\"gqmTemplates\":{\"productivity\":{\"name\":\"Productivity Measurement\",\"description\":\"Measure and improve development team productivity\",\"purpose\":\"Analyze\",\"issue\":\"productivity\",\"object\":\"development process\",\"viewpoint\":\"project manager\",\"context\":\"software development project\"},\"quality\":{\"name\":\"Quality Assessment\",\"description\":\"Monitor and improve software quality\",\"purpose\":\"Evaluate\",\"issue\":\"quality\",\"object\":\"software product\",\"viewpoint\":\"quality assurance\",\"context\":\"software development lifecycle\"},\"delivery\":{\"name\":\"Delivery Performance\",\"description\":\"Track delivery timelines and performance\",\"purpose\":\"Monitor\",\"issue\":\"delivery performance\",\"object\":\"project timeline\",\"viewpoint\":\"stakeholder\",\"context\":\"project management\"},\"maintenance\":{\"name\":\"Maintenance Efficiency\",\"description\":\"Measure maintenance effort and efficiency\",\"purpose\":\"Improve\",\"issue\":\"maintenance cost\",\"object\":\"software system\",\"viewpoint\":\"development team\",\"context\":\"maintenance phase\"}},\"commonQuestions\":{\"productivity\":[\"How many function points are delivered per developer per month?\",\"What is the average time to complete a user story?\",\"How many defects are introduced per function point?\",\"What is the code review efficiency?\"],\"quality\":[\"What is the defect density in the delivered software?\",\"How many defects are found in testing vs production?\",\"What is the code coverage percentage?\",\"How long does it take to fix a defect?\"],\"delivery\":[\"What percentage of deliveries are on time?\",\"How accurate are effort estimates?\",\"What is the velocity trend over sprints?\",\"How many scope changes occur during development?\"]},\"metricTemplates\":[{\"name\":\"Function Points per Developer\",\"unit\":\"FP/person/month\",\"description\":\"Productivity metric measuring function points delivered per developer per month\"},{\"name\":\"Defect Density\",\"unit\":\"defects/KLOC\",\"description\":\"Quality metric measuring defects per thousand lines of code\"},{\"name\":\"Code Coverage\",\"unit\":\"%\",\"description\":\"Quality metric measuring percentage of code covered by tests\"},{\"name\":\"Story Cycle Time\",\"unit\":\"days\",\"description\":\"Delivery metric measuring time from story start to completion\"},{\"name\":\"Velocity\",\"unit\":\"story points/sprint\",\"description\":\"Delivery metric measuring story points completed per sprint\"},{\"name\":\"Defect Resolution Time\",\"unit\":\"hours\",\"description\":\"Quality metric measuring average time to resolve defects\"}]}"));}}),
"[project]/src/core/i18n/locales/en/plans.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Measurement Plans\",\"subtitle\":\"Create and manage measurement plans for your projects\",\"createNewPlan\":\"Create New Plan\",\"planName\":\"Plan Name\",\"planDescription\":\"Description\",\"type\":\"Type\",\"owner\":\"Owner\",\"enterPlanName\":\"Enter plan name\",\"descriptionPlaceholder\":\"Brief description of the measurement plan\",\"enterPlanType\":\"Enter plan type\",\"enterPlanOwner\":\"Enter plan owner\",\"createPlan\":\"Create Plan\",\"yourPlans\":\"Your Plans\",\"progress\":\"Progress\",\"templates\":\"Plan Templates\",\"qualityAssurance\":\"Quality Assurance Plan\",\"qualityDescription\":\"Focus on quality metrics and defect tracking\",\"productivityAnalysis\":\"Productivity Analysis Plan\",\"productivityDescription\":\"Measure team productivity and efficiency\",\"projectPerformance\":\"Project Performance Plan\",\"performanceDescription\":\"Track project delivery and timeline metrics\",\"totalPlans\":\"Total Plans\",\"status\":{\"active\":\"active\",\"completed\":\"completed\",\"draft\":\"draft\",\"scheduled\":\"scheduled\"}}"));}}),
"[project]/src/core/i18n/locales/en/docs.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Documentation\",\"subtitle\":\"Learn how to use Measura effectively for software measurement\",\"gettingStarted\":\"Getting Started\",\"welcome\":\"Welcome to Measura! This comprehensive guide will help you understand and implement software measurement methodologies effectively.\",\"whatYouLearn\":\"What you'll learn:\",\"learnFPA\":\"• How to create accurate software estimates using FPA\",\"learnGQM\":\"• How to define meaningful measurement goals with GQM\",\"learnPlans\":\"• How to create and manage measurement plans\",\"learnBestPractices\":\"• Best practices for software measurement\",\"availableDocuments\":\"Available Documents\",\"readTime\":\"min read\",\"fpa\":{\"title\":\"Function Point Analysis (FPA)\",\"description\":\"Learn how to perform Function Point Analysis for software estimation\"},\"gqm\":{\"title\":\"Goal-Question-Metric (GQM)\",\"description\":\"Master the GQM approach for measurement planning\"},\"plans\":{\"title\":\"Measurement Plans\",\"description\":\"Create effective measurement plans for your projects\"},\"faq\":\"Frequently Asked Questions\",\"faqItems\":{\"whatIsFPA\":\"What is Function Point Analysis?\",\"fpaAnswer\":\"Function Point Analysis is a standardized method for measuring software size based on the functionality delivered to the user, independent of technology and implementation.\",\"howGQMHelps\":\"How does GQM help with measurement?\",\"gqmAnswer\":\"GQM provides a structured approach to define measurement goals, derive relevant questions, and identify appropriate metrics to answer those questions.\",\"canUseBoth\":\"Can I use both FPA and GQM together?\",\"bothAnswer\":\"Yes! FPA provides size estimation while GQM helps define what and how to measure. They complement each other in a comprehensive measurement program.\"},\"quickLinks\":\"Quick Links\",\"needHelp\":\"Need Help?\",\"helpDescription\":\"Can't find what you're looking for? We're here to help!\",\"versionInfo\":\"Version Info\",\"application\":\"Application\",\"documentation\":\"Documentation\",\"lastUpdated\":\"Last updated\"}"));}}),
"[project]/src/core/i18n/locales/en/common.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"loading\":\"Loading...\",\"error\":\"Error\",\"success\":\"Success\",\"cancel\":\"Cancel\",\"save\":\"Save\",\"delete\":\"Delete\",\"edit\":\"Edit\",\"create\":\"Create\",\"search\":\"Search\",\"filter\":\"Filter\",\"export\":\"Export\",\"import\":\"Import\",\"user\":\"User\",\"logout\":\"Logout\",\"themeToggle\":\"Toggle theme\",\"notifications\":\"Notifications\",\"welcome\":\"Welcome to Measura\",\"appSubtitle\":\"Software Estimation & Measurement\",\"appDescription\":\"A modular web application for software measurement and estimation using Function Point Analysis (FPA) and Goal-Question-Metric (GQM) methodologies.\",\"quickDemoLogin\":\"Quick Demo Login\",\"demoDescription\":\"Click above to explore the application with demo data\",\"keyFeatures\":\"Key Features:\",\"feature1\":\"• Function Point Analysis (FPA)\",\"feature2\":\"• Goal-Question-Metric (GQM) modeling\",\"feature3\":\"• Measurement plan creation\",\"feature4\":\"• Role-based access control\",\"feature5\":\"• Dark/Light theme support\",\"footerText\":\"Measura - Software Estimation & Measurement, Evolved\",\"techStack\":\"Built with Next.js, React, TypeScript & Tailwind CSS\"}"));}}),
"[project]/src/core/i18n/locales/en/login.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Login\",\"subtitle\":\"Sign in to your account\",\"email\":\"Email\",\"password\":\"Password\",\"enterYourEmail\":\"Enter your email\",\"enterYourPassword\":\"Enter your password\",\"signingIn\":\"Signing in...\",\"signInButton\":\"Sign In\",\"dontHaveAccount\":\"Don't have an account?\",\"signUp\":\"Sign up\",\"fillAllFields\":\"Please fill in all fields\",\"invalidCredentials\":\"Invalid email or password\",\"demoCredentials\":\"Demo credentials: admin@measura.com / password\"}"));}}),
"[project]/src/core/i18n/locales/en/register.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"title\":\"Register\",\"subtitle\":\"Create your account\",\"username\":\"Username\",\"email\":\"Email\",\"password\":\"Password\",\"confirmPassword\":\"Confirm Password\",\"role\":\"Role\",\"projectManager\":\"Project Manager\",\"metricsAnalyst\":\"Metrics Analyst\",\"enterFullName\":\"Enter your full name\",\"enterEmail\":\"Enter your email\",\"createPassword\":\"Create a password\",\"confirmYourPassword\":\"Confirm your password\",\"createAccountButton\":\"Create Account\",\"creatingAccount\":\"Creating account...\",\"alreadyHaveAccount\":\"Already have an account?\",\"signIn\":\"Sign in\",\"fillAllFields\":\"Please fill in all fields\",\"passwordsDoNotMatch\":\"Passwords do not match\",\"passwordTooShort\":\"Password must be at least 6 characters\",\"registrationFailed\":\"Registration failed. Please try again.\",\"termsAgreement\":\"By registering, you agree to our terms of service and privacy policy\"}"));}}),
"[project]/src/core/i18n/config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
// Internationalization configuration
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next/dist/esm/i18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/initReactI18next.js [app-ssr] (ecmascript)");
// Import Portuguese resources
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$layout$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/layout.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$nav$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/nav.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$dashboard$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/dashboard.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$fpa$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/fpa.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$gqm$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/gqm.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$plans$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/plans.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$docs$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/docs.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$common$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/common.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$login$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/login.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$register$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/pt/register.json (json)");
// Import English resources
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$layout$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/layout.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$nav$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/nav.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$dashboard$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/dashboard.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$fpa$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/fpa.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$gqm$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/gqm.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$plans$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/plans.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$docs$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/docs.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$common$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/common.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$login$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/login.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$register$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/core/i18n/locales/en/register.json (json)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const resources = {
    pt: {
        layout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$layout$2e$json__$28$json$29$__["default"],
        nav: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$nav$2e$json__$28$json$29$__["default"],
        dashboard: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$dashboard$2e$json__$28$json$29$__["default"],
        fpa: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$fpa$2e$json__$28$json$29$__["default"],
        gqm: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$gqm$2e$json__$28$json$29$__["default"],
        plans: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$plans$2e$json__$28$json$29$__["default"],
        docs: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$docs$2e$json__$28$json$29$__["default"],
        common: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$common$2e$json__$28$json$29$__["default"],
        login: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$login$2e$json__$28$json$29$__["default"],
        register: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$pt$2f$register$2e$json__$28$json$29$__["default"]
    },
    en: {
        layout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$layout$2e$json__$28$json$29$__["default"],
        nav: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$nav$2e$json__$28$json$29$__["default"],
        dashboard: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$dashboard$2e$json__$28$json$29$__["default"],
        fpa: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$fpa$2e$json__$28$json$29$__["default"],
        gqm: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$gqm$2e$json__$28$json$29$__["default"],
        plans: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$plans$2e$json__$28$json$29$__["default"],
        docs: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$docs$2e$json__$28$json$29$__["default"],
        common: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$common$2e$json__$28$json$29$__["default"],
        login: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$login$2e$json__$28$json$29$__["default"],
        register: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$locales$2f$en$2f$register$2e$json__$28$json$29$__["default"]
    }
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initReactI18next"]).init({
    resources,
    lng: "pt",
    fallbackLng: "pt",
    interpolation: {
        escapeValue: false
    },
    react: {
        useSuspense: false
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
}}),
"[project]/src/core/i18n/I18nProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "I18nProvider": (()=>I18nProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$I18nextProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/I18nextProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/i18n/config.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function I18nProvider({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedLanguage = localStorage.getItem('language') || 'pt';
        if (savedLanguage && savedLanguage !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].language) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].changeLanguage(savedLanguage);
        }
        document.documentElement.lang = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].language;
        const handleLanguageChange = (lng)=>{
            localStorage.setItem('language', lng);
            document.documentElement.lang = lng;
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].on('languageChanged', handleLanguageChange);
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].off('languageChanged', handleLanguageChange);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$I18nextProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nextProvider"], {
        i18n: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        children: children
    }, void 0, false, {
        fileName: "[project]/src/core/i18n/I18nProvider.tsx",
        lineNumber: 33,
        columnNumber: 10
    }, this);
}
}}),
"[project]/src/app/layout.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/i18n/I18nProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const LayoutContent = ({ children })=>{
    const { t, i18n } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])('layout');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.title = t('title');
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', t('description'));
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = t('description');
            document.head.appendChild(meta);
        }
    }, [
        t,
        i18n.language
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: i18n.language,
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "min-h-screen bg-background text-default antialiased",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
};
const RootLayout = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LayoutContent, {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = RootLayout;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ca249651._.js.map