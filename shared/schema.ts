import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  phone: text("phone").notNull(),
  employeeCount: text("employee_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  year: integer("year").notNull(),
  completedAt: timestamp("completed_at"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  
  // General Organization Information
  remoteWorkPercentage: text("remote_work_percentage"),
  
  // Privacy and Compliance
  gdprCompliance: text("gdpr_compliance"),
  breachReportingRequired: text("breach_reporting_required"),
  breachNotificationRequired: text("breach_notification_required"),
  complianceActs: text("compliance_acts").array(),
  
  // Sensitive Data Handling
  sensitiveClientData: text("sensitive_client_data"),
  governmentData: text("government_data"),
  confidentialCommercialData: text("confidential_commercial_data"),
  
  // Impact Risk Assessment
  riskAssessments: jsonb("risk_assessments"),
  
  // Incident History
  pastIncidents: text("past_incidents"),
  
  // Cyber Risk Assessment
  cyberRiskAssessmentDone: text("cyber_risk_assessment_done"),
  riskAssessmentInternal: text("risk_assessment_internal"),
  lastRiskAssessment: text("last_risk_assessment"),
  riskRegisterMaintained: text("risk_register_maintained"),
  riskRegisterUpdated: text("risk_register_updated"),
  thirdPartyRisksConsidered: text("third_party_risks_considered"),
  
  // Password Policy
  passwordPolicy: text("password_policy"),
  passwordPolicyReviewed: text("password_policy_reviewed"),
  passwordRequirements: text("password_requirements").array(),
  
  // Two Factor Authentication
  mfaEmail: text("mfa_email"),
  mfaRemoteAccess: text("mfa_remote_access"),
  singleSignOn: text("single_sign_on"),
  
  // Encryption
  dataEncryptedInTransitInternet: text("data_encrypted_transit_internet"),
  dataEncryptedInTransitInternal: text("data_encrypted_transit_internal"),
  encryptionKeyManagement: text("encryption_key_management").array(),
  dataEncryptedAtRest: text("data_encrypted_at_rest"),
  
  // Anti Virus
  antivirusRequired: text("antivirus_required"),
  antimalwareRequired: text("antimalware_required"),
  idsIpsUsed: text("ids_ips_used"),
  idsIpsDetails: text("ids_ips_details"),
  antivirusMonitoring: text("antivirus_monitoring"),
  
  // Access Control Management
  accessControlPolicy: text("access_control_policy"),
  accessControlPolicyReviewed: text("access_control_policy_reviewed"),
  remoteAccessPolicy: text("remote_access_policy"),
  remoteAccessPolicyReviewed: text("remote_access_policy_reviewed"),
  accessControlTools: text("access_control_tools"),
  networkSegmentation: text("network_segmentation"),
  
  // Awareness Training
  annualTraining: text("annual_training"),
  periodicTraining: text("periodic_training"),
  phishingTests: text("phishing_tests"),
  trainingProvider: text("training_provider"),
  employeeEngagement: text("employee_engagement"),
  retentionAssessment: text("retention_assessment"),
  
  // Vulnerability Management
  vulnerabilityScanning: text("vulnerability_scanning"),
  scanningFrequency: text("scanning_frequency"),
  patchManagement: text("patch_management"),
  vulnerabilityRemediation: text("vulnerability_remediation"),
  
  // Disaster Recovery and Business Continuity
  disasterRecoveryPolicy: text("disaster_recovery_policy"),
  drPolicyUpdated: text("dr_policy_updated"),
  drTesting: text("dr_testing"),
  dataRestoreTesting: text("data_restore_testing"),
  businessContinuityPlan: text("business_continuity_plan"),
  bcpUpdated: text("bcp_updated"),
  bcpTesting: text("bcp_testing"),
  incidentResponsePlan: text("incident_response_plan"),
  irpUpdated: text("irp_updated"),
  irpTesting: text("irp_testing"),
  penetrationTesting: text("penetration_testing"),
  penTestingAnnual: text("pen_testing_annual"),
  penTestingThirdParty: text("pen_testing_third_party"),
  penTestingAccredited: text("pen_testing_accredited"),
  penTestingScope: text("pen_testing_scope"),
  findingsRemediation: text("findings_remediation"),
  
  // Security Framework and ISMS
  securityFramework: text("security_framework"),
  primaryFramework: text("primary_framework"),
  frameworkStatus: text("framework_status"),
  policyReviewFrequency: text("policy_review_frequency"),
  thirdPartyProcedures: text("third_party_procedures"),
  
  // SIEM
  breachDetectionTools: text("breach_detection_tools"),
  siemSocUsed: text("siem_soc_used"),
  securitySolutions: text("security_solutions"),
  
  // Additional fields for complete coverage from document
  encryptionKeyMgmtDetails: text("encryption_key_mgmt_details"),
  idsIpsDetails2: text("ids_ips_details_2"),
  accessControlToolsDetails: text("access_control_tools_details"),
  trainingSchedule: text("training_schedule"),
  trainingAttendance: text("training_attendance"),
  periodicTrainingDetails: text("periodic_training_details"),
  phishingTestDetails: text("phishing_test_details"),
  trainingProviderDetails: text("training_provider_details"),
  vulnerabilityScanningEvidence: text("vulnerability_scanning_evidence"),
  patchManagementDetails: text("patch_management_details"),
  drPolicyDocument: text("dr_policy_document"),
  bcpDocument: text("bcp_document"),
  irpDocument: text("irp_document"),
  penetrationTestingDetails: text("penetration_testing_details"),
  frameworkEvidence: text("framework_evidence"),
  policyReviewDetails: text("policy_review_details"),
  thirdPartyProceduresDetails: text("third_party_procedures_details"),
  siemDetails: text("siem_details"),
  socDetails: text("soc_details"),
  assistanceRequired: text("assistance_required"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  type: text("type").notNull(), // 'text', 'radio', 'checkbox', 'file'
  section: text("section").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  text: text("text").notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentFiles = pgTable("assessment_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  questionId: integer("question_id").references(() => questions.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertOptionSchema = createInsertSchema(options).omit({
  id: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentFileSchema = createInsertSchema(assessmentFiles).omit({
  id: true,
  uploadedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertOption = z.infer<typeof insertOptionSchema>;
export type Option = typeof options.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertAssessmentFile = z.infer<typeof insertAssessmentFileSchema>;
export type AssessmentFile = typeof assessmentFiles.$inferSelect;
