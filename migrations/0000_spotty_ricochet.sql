CREATE TABLE "assessment_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" integer NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_path" text NOT NULL,
	"section" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"year" integer NOT NULL,
	"completed_at" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"remote_work_percentage" text,
	"gdpr_compliance" text,
	"breach_reporting_required" text,
	"breach_notification_required" text,
	"compliance_acts" text[],
	"sensitive_client_data" text,
	"government_data" text,
	"confidential_commercial_data" text,
	"risk_assessments" jsonb,
	"past_incidents" text,
	"cyber_risk_assessment_done" text,
	"risk_assessment_internal" text,
	"last_risk_assessment" text,
	"risk_register_maintained" text,
	"risk_register_updated" text,
	"third_party_risks_considered" text,
	"password_policy" text,
	"password_policy_reviewed" text,
	"password_requirements" text[],
	"mfa_email" text,
	"mfa_remote_access" text,
	"single_sign_on" text,
	"data_encrypted_transit_internet" text,
	"data_encrypted_transit_internal" text,
	"encryption_key_management" text[],
	"data_encrypted_at_rest" text,
	"antivirus_required" text,
	"antimalware_required" text,
	"ids_ips_used" text,
	"ids_ips_details" text,
	"antivirus_monitoring" text,
	"access_control_policy" text,
	"access_control_policy_reviewed" text,
	"remote_access_policy" text,
	"remote_access_policy_reviewed" text,
	"access_control_tools" text,
	"network_segmentation" text,
	"annual_training" text,
	"periodic_training" text,
	"phishing_tests" text,
	"training_provider" text,
	"employee_engagement" text,
	"retention_assessment" text,
	"vulnerability_scanning" text,
	"scanning_frequency" text,
	"patch_management" text,
	"vulnerability_remediation" text,
	"disaster_recovery_policy" text,
	"dr_policy_updated" text,
	"dr_testing" text,
	"data_restore_testing" text,
	"business_continuity_plan" text,
	"bcp_updated" text,
	"bcp_testing" text,
	"incident_response_plan" text,
	"irp_updated" text,
	"irp_testing" text,
	"penetration_testing" text,
	"pen_testing_annual" text,
	"pen_testing_third_party" text,
	"pen_testing_accredited" text,
	"pen_testing_scope" text,
	"findings_remediation" text,
	"security_framework" text,
	"primary_framework" text,
	"framework_status" text,
	"policy_review_frequency" text,
	"third_party_procedures" text,
	"breach_detection_tools" text,
	"siem_soc_used" text,
	"security_solutions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"phone" text NOT NULL,
	"employee_count" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_files" ADD CONSTRAINT "assessment_files_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;