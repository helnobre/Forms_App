import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'pt';
  setLanguage: (lang: 'en' | 'pt') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'Moore Risk Assessment Portal',
    'header.progress': 'Assessment Progress',
    
    // Navigation
    'nav.userInfo': 'User Information',
    'nav.generalOrg': 'General Organization',
    'nav.privacyCompliance': 'Privacy & Compliance',
    'nav.sensitiveData': 'Sensitive Data',
    'nav.riskAssessment': 'Risk Assessment',
    'nav.incidentHistory': 'Incident History',
    'nav.cyberRisk': 'Cyber Risk Assessment',
    'nav.passwordPolicy': 'Password Policy',
    'nav.twoFactorAuth': '2FA & Security',
    'nav.encryption': 'Encryption',
    'nav.antiVirus': 'Anti Virus',
    'nav.accessControl': 'Access Control',
    'nav.training': 'Training',
    'nav.vulnerability': 'Vulnerability Management',
    'nav.disasterRecovery': 'Disaster Recovery',
    'nav.securityFramework': 'Security Framework',
    'nav.siem': 'SIEM',
    
    // User Info Form
    'userInfo.title': 'User Information',
    'userInfo.description': 'Please provide your contact information and company details.',
    'userInfo.fullName': 'Full Name',
    'userInfo.email': 'Email Address',
    'userInfo.company': 'Company Name',
    'userInfo.position': 'Position/Title',
    'userInfo.phone': 'Phone Number',
    'userInfo.employeeCount': 'Number of Employees',
    'userInfo.continue': 'Continue',
    'userInfo.saving': 'Saving...',
    'userInfo.lastSaved': 'Last saved',
    'userInfo.required': 'required',
    
    // Employee Count Options
    'employees.1-10': '1-10 employees',
    'employees.11-50': '11-50 employees',
    'employees.51-200': '51-200 employees',
    'employees.201-500': '201-500 employees',
    'employees.501-1000': '501-1000 employees',
    'employees.1000+': '1000+ employees',
    
    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.complete': 'Complete Assessment',
    'common.loading': 'Loading...',
    
    // Questions - General Organization
    'questions.generalOrg.remoteWork': 'What percentage of your staff work remotely for a significant proportion of their time?',
    
    // Questions - Privacy & Compliance
    'questions.privacyCompliance.gdpr': 'Are you required to be compliant with GDPR or similar privacy legislation (e.g., HIPAA, CCPA, POPI, PDPA)?',
    'questions.privacyCompliance.breachReporting': 'Does any of the required legislation require the organisation to report a breach to a legislative body?',
    'questions.privacyCompliance.breachNotification': 'Does any of the required legislation require you to report a breach to any affected parties?',
    'questions.privacyCompliance.complianceActs': 'Which of these acts are you required to comply with? (Select all that apply)',
    
    // Questions - Sensitive Data
    'questions.sensitiveData.clientData': 'Aside from standard financial information, do you handle high-risk protected information about clients (e.g., health information, information about minors, criminal records)?',
    'questions.sensitiveData.governmentData': 'Do you maintain any sensitive government information?',
    'questions.sensitiveData.commercialData': 'Do you hold significant confidential information belonging to the organisation that would be of commercial value to competitors or other companies (e.g., IP, contract information, financial information)?',
    
    // Questions - Risk Assessment
    'questions.riskAssessment.title': 'Impact Risk Assessment',
    'questions.riskAssessment.description': 'For each scenario, assess the impact in three categories: Financial, Reputational, and Compliance.',
    'questions.riskAssessment.scenario1': 'The ability for systems or data to be unavailable or inaccessible for a period of time',
    'questions.riskAssessment.scenario2': 'A cyber event e.g. ransomware/malware causing loss of internal data',
    'questions.riskAssessment.scenario3': 'A cyber event e.g. ransomware/malware causing loss of customer data',
    'questions.riskAssessment.scenario4': 'A cyber event e.g. ransomware/malware causing loss of third-party data',
    'questions.riskAssessment.scenario5': 'A cyber event resulting in the loss of confidential information',
    
    // Questions - Incident History
    'questions.incidentHistory.pastIncidents': 'To what extent have you experienced any data privacy incident or security incidents in the last 5 years?',
    
    // Questions - Cyber Risk Assessment
    'questions.cyberRisk.assessmentDone': 'Has your organization performed a Cyber Risk Assessment?',
    'questions.cyberRisk.internal': 'Was the risk assessment done internally?',
    'questions.cyberRisk.lastAssessment': 'When was the last risk assessment done?',
    'questions.cyberRisk.riskRegister': 'Does your organization maintain a cyber risk register?',
    'questions.cyberRisk.registerUpdated': 'When was the risk register last updated?',
    'questions.cyberRisk.thirdPartyRisks': 'Have you specifically considered the risks posed to your cyber security by 3rd party contractors?',
    
    // Questions - Password Policy
    'questions.passwordPolicy.hasPolicy': 'Do you have a Password Management policy for access to your organization\'s platforms, applications and databases?',
    'questions.passwordPolicy.reviewed': 'Has this been reviewed within the last calendar year?',
    'questions.passwordPolicy.requirements': 'Which of these are required by your password policy? (Select all that apply)',
    
    // Password Requirements
    'passwordReq.minLength8': 'Minimum Length ≥8',
    'passwordReq.minLength12': 'Minimum Length ≥12',
    'passwordReq.mixedCase': 'Required Mixed Case',
    'passwordReq.noRepeated': 'No Repeated Digits',
    'passwordReq.specialChars': 'Require Special Case Characters',
    'passwordReq.maxRepeated': 'Maximum number of repeated characters or digits',
    'passwordReq.noRepeatedPasswords': 'No repeated passwords within X changes',
    'passwordReq.expiry': 'Passwords must be changed within a fixed period (No greater than 120 days)',
    'passwordReq.proprietary': 'Proprietary Complexity Algorithm (E.g. Google)',
    
    // Questions - Two Factor Authentication
    'questions.twoFactor.email': 'Do you require Multi Factor Authentication for Email/Cloud Storage?',
    'questions.twoFactor.remoteAccess': 'Do you require Multi Factor Authentication for remote access or VPN access?',
    'questions.twoFactor.sso': 'In general is the access to critical systems managed via a single sign on platform (E.g. Active Directory)?',
    
    // Toasts and validation messages
    'validation.nameRequired': 'Full name is required',
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Email is invalid',
    'validation.companyRequired': 'Company name is required',
    'validation.positionRequired': 'Position is required',
    'validation.phoneRequired': 'Phone number is required',
    'validation.employeeCountRequired': 'Employee count is required',
    'toast.userSaved': 'User information saved',
    'toast.userSavedDesc': 'Your information has been successfully stored.',
    'toast.assessmentComplete': 'Assessment completed!',
    'toast.assessmentCompleteDesc': 'Your cyber risk assessment has been submitted successfully.',
    'toast.error': 'Error',
    'toast.tryAgain': 'Please try again.',
    'toast.requiredFields': 'Please complete all required fields',
    'toast.requiredFieldsDesc': 'All fields marked with * are required.',
    
    // Landing Page
    'landing.header.title': 'Cyber Risk Assessment Platform',
    'landing.hero.title': 'Comprehensive Cyber Risk Assessment',
    'landing.hero.description': 'Evaluate your organization\'s cybersecurity posture with our comprehensive assessment tool. Get insights into vulnerabilities and receive recommendations to strengthen your security framework.',
    'landing.assessment.title': 'Start Assessment',
    'landing.assessment.description': 'Begin your comprehensive cybersecurity risk assessment. Answer questions across multiple security domains to identify vulnerabilities and compliance gaps.',
    'landing.assessment.feature1': '17 comprehensive security sections',
    'landing.assessment.feature2': 'Auto-save functionality',
    'landing.assessment.feature3': 'File upload capabilities',
    'landing.assessment.feature4': 'Multilingual support',
    'landing.assessment.button': 'Begin Assessment',
    'landing.admin.title': 'Admin Dashboard',
    'landing.admin.description': 'Access the administrative dashboard to review all submitted assessments, analyze responses, and manage user data across your organization.',
    'landing.admin.feature1': 'View all user responses',
    'landing.admin.feature2': 'Assessment analytics',
    'landing.admin.feature3': 'Export capabilities',
    'landing.admin.feature4': 'User management',
    'landing.admin.button': 'Access Dashboard',
    'landing.features.title': 'Why Choose Our Assessment Platform?',
    'landing.features.coverage.title': 'Comprehensive Coverage',
    'landing.features.coverage.description': 'Covers all major cybersecurity domains including access control, encryption, training, and incident response.',
    'landing.features.dynamic.title': 'Dynamic Questions',
    'landing.features.dynamic.description': 'Database-driven questions that adapt to your responses with intelligent form logic and file upload capabilities.',
    'landing.features.multiUser.title': 'Multi-User Support',
    'landing.features.multiUser.description': 'Support for multiple organizations with separate data storage and comprehensive admin oversight.',
    'landing.footer.copyright': '© 2025 Cyber Risk Assessment Platform. All rights reserved.',
  },
  pt: {
    // Header
    'header.title': 'Portal de ITGC da Moore',
    'header.progress': 'Progresso da Avaliação',
    
    // Navigation
    'nav.userInfo': 'Informações do Usuário',
    'nav.generalOrg': 'Organização Geral',
    'nav.privacyCompliance': 'Privacidade e Conformidade',
    'nav.sensitiveData': 'Dados Sensíveis',
    'nav.riskAssessment': 'Avaliação de Risco',
    'nav.incidentHistory': 'Histórico de Incidentes',
    'nav.cyberRisk': 'Avaliação de Risco Cibernético',
    'nav.passwordPolicy': 'Política de Senhas',
    'nav.twoFactorAuth': '2FA e Segurança',
    'nav.encryption': 'Criptografia',
    'nav.antiVirus': 'Antivírus',
    'nav.accessControl': 'Controle de Acesso',
    'nav.training': 'Treinamento',
    'nav.vulnerability': 'Gestão de Vulnerabilidades',
    'nav.disasterRecovery': 'Recuperação de Desastres',
    'nav.securityFramework': 'Framework de Segurança',
    'nav.siem': 'SIEM',
    
    // User Info Form
    'userInfo.title': 'Informações do Usuário',
    'userInfo.description': 'Por favor, forneça suas informações de contato e detalhes da empresa.',
    'userInfo.fullName': 'Nome Completo',
    'userInfo.email': 'Endereço de Email',
    'userInfo.company': 'Nome da Empresa',
    'userInfo.position': 'Cargo/Título',
    'userInfo.phone': 'Número de Telefone',
    'userInfo.employeeCount': 'Número de Funcionários',
    'userInfo.continue': 'Continuar',
    'userInfo.saving': 'Salvando...',
    'userInfo.lastSaved': 'Salvo pela última vez',
    'userInfo.required': 'obrigatório',
    
    // Employee Count Options
    'employees.1-10': '1-10 funcionários',
    'employees.11-50': '11-50 funcionários',
    'employees.51-200': '51-200 funcionários',
    'employees.201-500': '201-500 funcionários',
    'employees.501-1000': '501-1000 funcionários',
    'employees.1000+': '1000+ funcionários',
    
    // Common
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.save': 'Salvar',
    'common.complete': 'Concluir Avaliação',
    'common.loading': 'Carregando...',
    
    // Questions - General Organization
    'questions.generalOrg.remoteWork': 'Que percentual da sua equipe trabalha remotamente por uma proporção significativa do tempo?',
    
    // Questions - Privacy & Compliance
    'questions.privacyCompliance.gdpr': 'Você é obrigado a estar em conformidade com GDPR ou legislação de privacidade similar (ex.: HIPAA, CCPA, POPI, PDPA)?',
    'questions.privacyCompliance.breachReporting': 'Alguma legislação exigida requer que a organização relate uma violação a um órgão legislativo?',
    'questions.privacyCompliance.breachNotification': 'Alguma legislação exigida requer que você relate uma violação às partes afetadas?',
    'questions.privacyCompliance.complianceActs': 'Com quais destes atos você é obrigado a cumprir? (Selecione todos que se aplicam)',
    
    // Questions - Sensitive Data
    'questions.sensitiveData.clientData': 'Além de informações financeiras padrão, você lida com informações protegidas de alto risco sobre clientes (ex.: informações de saúde, informações sobre menores, registros criminais)?',
    'questions.sensitiveData.governmentData': 'Você mantém alguma informação sensível do governo?',
    'questions.sensitiveData.commercialData': 'Você possui informações confidenciais significativas pertencentes à organização que seriam de valor comercial para concorrentes ou outras empresas (ex.: PI, informações contratuais, informações financeiras)?',
    
    // Questions - Risk Assessment
    'questions.riskAssessment.title': 'Avaliação de Impacto de Risco',
    'questions.riskAssessment.description': 'Para cada cenário, avalie o impacto em três categorias: Financeiro, Reputacional e Conformidade.',
    'questions.riskAssessment.scenario1': 'A capacidade de sistemas ou dados ficarem indisponíveis ou inacessíveis por um período de tempo',
    'questions.riskAssessment.scenario2': 'Um evento cibernético ex.: ransomware/malware causando perda de dados internos',
    'questions.riskAssessment.scenario3': 'Um evento cibernético ex.: ransomware/malware causando perda de dados do cliente',
    'questions.riskAssessment.scenario4': 'Um evento cibernético ex.: ransomware/malware causando perda de dados de terceiros',
    'questions.riskAssessment.scenario5': 'Um evento cibernético resultando na perda de informações confidenciais',
    
    // Questions - Incident History
    'questions.incidentHistory.pastIncidents': 'Em que medida você experimentou algum incidente de privacidade de dados ou incidentes de segurança nos últimos 5 anos?',
    
    // Questions - Cyber Risk Assessment
    'questions.cyberRisk.assessmentDone': 'Sua organização realizou uma Avaliação de Risco Cibernético?',
    'questions.cyberRisk.internal': 'A avaliação de risco foi feita internamente?',
    'questions.cyberRisk.lastAssessment': 'Quando foi feita a última avaliação de risco?',
    'questions.cyberRisk.riskRegister': 'Sua organização mantém um registro de risco cibernético?',
    'questions.cyberRisk.registerUpdated': 'Quando o registro de risco foi atualizado pela última vez?',
    'questions.cyberRisk.thirdPartyRisks': 'Você considerou especificamente os riscos impostos à sua segurança cibernética por contratados terceirizados?',
    
    // Questions - Password Policy
    'questions.passwordPolicy.hasPolicy': 'Você tem uma política de Gerenciamento de Senhas para acesso às plataformas, aplicações e bancos de dados da sua organização?',
    'questions.passwordPolicy.reviewed': 'Isso foi revisado no último ano civil?',
    'questions.passwordPolicy.requirements': 'Quais destes são exigidos pela sua política de senhas? (Selecione todos que se aplicam)',
    
    // Password Requirements
    'passwordReq.minLength8': 'Comprimento Mínimo ≥8',
    'passwordReq.minLength12': 'Comprimento Mínimo ≥12',
    'passwordReq.mixedCase': 'Maiúsculas e Minúsculas Obrigatórias',
    'passwordReq.noRepeated': 'Sem Dígitos Repetidos',
    'passwordReq.specialChars': 'Exigir Caracteres Especiais',
    'passwordReq.maxRepeated': 'Número máximo de caracteres ou dígitos repetidos',
    'passwordReq.noRepeatedPasswords': 'Sem senhas repetidas dentro de X alterações',
    'passwordReq.expiry': 'Senhas devem ser alteradas dentro de um período fixo (Não superior a 120 dias)',
    'passwordReq.proprietary': 'Algoritmo de Complexidade Proprietário (Ex.: Google)',
    
    // Questions - Two Factor Authentication
    'questions.twoFactor.email': 'Você exige Autenticação de Múltiplo Fator para Email/Armazenamento em Nuvem?',
    'questions.twoFactor.remoteAccess': 'Você exige Autenticação de Múltiplo Fator para acesso remoto ou acesso VPN?',
    'questions.twoFactor.sso': 'Em geral, o acesso a sistemas críticos é gerenciado via uma plataforma de login único (Ex.: Active Directory)?',
    
    // Toasts and validation messages
    'validation.nameRequired': 'Nome completo é obrigatório',
    'validation.emailRequired': 'Email é obrigatório',
    'validation.emailInvalid': 'Email é inválido',
    'validation.companyRequired': 'Nome da empresa é obrigatório',
    'validation.positionRequired': 'Cargo é obrigatório',
    'validation.phoneRequired': 'Número de telefone é obrigatório',
    'validation.employeeCountRequired': 'Número de funcionários é obrigatório',
    'toast.userSaved': 'Informações do usuário salvas',
    'toast.userSavedDesc': 'Suas informações foram armazenadas com sucesso.',
    'toast.assessmentComplete': 'Avaliação concluída!',
    'toast.assessmentCompleteDesc': 'Sua avaliação de risco cibernético foi enviada com sucesso.',
    'toast.error': 'Erro',
    'toast.tryAgain': 'Por favor, tente novamente.',
    'toast.requiredFields': 'Por favor, complete todos os campos obrigatórios',
    'toast.requiredFieldsDesc': 'Todos os campos marcados com * são obrigatórios.',
    
    // Landing Page
    'landing.header.title': 'Plataforma de Avaliação de Risco Cibernético',
    'landing.hero.title': 'Avaliação Abrangente de Risco Cibernético',
    'landing.hero.description': 'Avalie a postura de segurança cibernética da sua organização com nossa ferramenta de avaliação abrangente. Obtenha insights sobre vulnerabilidades e receba recomendações para fortalecer seu framework de segurança.',
    'landing.assessment.title': 'Iniciar Avaliação',
    'landing.assessment.description': 'Comece sua avaliação abrangente de risco de segurança cibernética. Responda perguntas em múltiplos domínios de segurança para identificar vulnerabilidades e lacunas de conformidade.',
    'landing.assessment.feature1': '17 seções abrangentes de segurança',
    'landing.assessment.feature2': 'Funcionalidade de salvamento automático',
    'landing.assessment.feature3': 'Capacidades de upload de arquivos',
    'landing.assessment.feature4': 'Suporte multilíngue',
    'landing.assessment.button': 'Iniciar Avaliação',
    'landing.admin.title': 'Painel Administrativo',
    'landing.admin.description': 'Acesse o painel administrativo para revisar todas as avaliações enviadas, analisar respostas e gerenciar dados de usuários em sua organização.',
    'landing.admin.feature1': 'Visualizar todas as respostas dos usuários',
    'landing.admin.feature2': 'Análises de avaliação',
    'landing.admin.feature3': 'Capacidades de exportação',
    'landing.admin.feature4': 'Gerenciamento de usuários',
    'landing.admin.button': 'Acessar Painel',
    'landing.features.title': 'Por que Escolher Nossa Plataforma de Avaliação?',
    'landing.features.coverage.title': 'Cobertura Abrangente',
    'landing.features.coverage.description': 'Cobre todos os principais domínios de segurança cibernética incluindo controle de acesso, criptografia, treinamento e resposta a incidentes.',
    'landing.features.dynamic.title': 'Perguntas Dinâmicas',
    'landing.features.dynamic.description': 'Perguntas baseadas em banco de dados que se adaptam às suas respostas com lógica de formulário inteligente e capacidades de upload de arquivos.',
    'landing.features.multiUser.title': 'Suporte Multi-Usuário',
    'landing.features.multiUser.description': 'Suporte para múltiplas organizações com armazenamento de dados separado e supervisão administrativa abrangente.',
    'landing.footer.copyright': '© 2025 Plataforma de Avaliação de Risco Cibernético. Todos os direitos reservados.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}