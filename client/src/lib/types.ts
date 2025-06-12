export interface RiskAssessment {
  scenario: string;
  financialImpact: string;
  reputationalImpact: string;
  complianceImpact: string;
}

export interface FormSection {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
}

export interface AssessmentFormData {
  // General Organization Information
  remoteWorkPercentage?: string;
  
  // Privacy and Compliance
  gdprCompliance?: string;
  breachReportingRequired?: string;
  breachNotificationRequired?: string;
  complianceActs?: string[];
  
  // Sensitive Data Handling
  sensitiveClientData?: string;
  governmentData?: string;
  confidentialCommercialData?: string;
  
  // Impact Risk Assessment
  riskAssessments?: RiskAssessment[];
  
  // Incident History
  pastIncidents?: string;
  
  // Cyber Risk Assessment
  cyberRiskAssessmentDone?: string;
  riskAssessmentInternal?: string;
  lastRiskAssessment?: string;
  riskRegisterMaintained?: string;
  riskRegisterUpdated?: string;
  thirdPartyRisksConsidered?: string;
  
  // Password Policy
  passwordPolicy?: string;
  passwordPolicyReviewed?: string;
  passwordRequirements?: string[];
  
  // Two Factor Authentication
  mfaEmail?: string;
  mfaRemoteAccess?: string;
  singleSignOn?: string;
  
  // Encryption
  dataEncryptedInTransitInternet?: string;
  dataEncryptedInTransitInternal?: string;
  encryptionKeyManagement?: string[];
  dataEncryptedAtRest?: string;
  
  // Anti Virus
  antivirusRequired?: string;
  antimalwareRequired?: string;
  idsIpsUsed?: string;
  idsIpsDetails?: string;
  antivirusMonitoring?: string;
  
  // Access Control Management
  accessControlPolicy?: string;
  accessControlPolicyReviewed?: string;
  remoteAccessPolicy?: string;
  remoteAccessPolicyReviewed?: string;
  accessControlTools?: string;
  networkSegmentation?: string;
  
  // Awareness Training
  annualTraining?: string;
  periodicTraining?: string;
  phishingTests?: string;
  trainingProvider?: string;
  employeeEngagement?: string;
  retentionAssessment?: string;
  
  // Vulnerability Management
  vulnerabilityScanning?: string;
  scanningFrequency?: string;
  patchManagement?: string;
  vulnerabilityRemediation?: string;
  
  // Disaster Recovery and Business Continuity
  disasterRecoveryPolicy?: string;
  drPolicyUpdated?: string;
  drTesting?: string;
  dataRestoreTesting?: string;
  businessContinuityPlan?: string;
  bcpUpdated?: string;
  bcpTesting?: string;
  incidentResponsePlan?: string;
  irpUpdated?: string;
  irpTesting?: string;
  penetrationTesting?: string;
  penTestingAnnual?: string;
  penTestingThirdParty?: string;
  penTestingAccredited?: string;
  penTestingScope?: string;
  findingsRemediation?: string;
  
  // Security Framework and ISMS
  securityFramework?: string;
  primaryFramework?: string;
  frameworkStatus?: string;
  policyReviewFrequency?: string;
  thirdPartyProcedures?: string;
  
  // SIEM
  breachDetectionTools?: string;
  siemSocUsed?: string;
  securitySolutions?: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  company: string;
  position: string;
  phone: string;
  employeeCount: string;
}
