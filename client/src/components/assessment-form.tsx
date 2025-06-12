import { useState } from "react";
import { Save, ArrowRight, ArrowLeft, Upload, FileText, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormSection, AssessmentFormData, RiskAssessment } from "@/lib/types";

interface AssessmentFormProps {
  sectionIndex: number;
  section: FormSection;
  data: AssessmentFormData;
  onChange: (data: AssessmentFormData) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onComplete: () => void;
  lastSaved: Date | null;
  isLastSection: boolean;
  isLoading: boolean;
}

const riskScenarios = [
  "Systems or data unavailable for a period of time",
  "Ransomware/malware causing loss of internal data",
  "Ransomware/malware causing loss of customer data",
  "Ransomware/malware causing loss of third-party data",
  "Cyber event resulting in loss of confidential information",
];

const impactOptions = [
  { value: "no-effect", label: "No Effect" },
  { value: "minor", label: "Minor Impact" },
  { value: "moderate", label: "Moderate Impact" },
  { value: "major", label: "Major Impact" },
];

export default function AssessmentForm({
  sectionIndex,
  section,
  data,
  onChange,
  onNext,
  onPrevious,
  onSave,
  onComplete,
  lastSaved,
  isLastSection,
  isLoading,
}: AssessmentFormProps) {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string[] }>({});

  const handleInputChange = (field: keyof AssessmentFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (field: keyof AssessmentFormData, value: string, checked: boolean) => {
    const currentArray = (data[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    handleInputChange(field, newArray);
  };

  const handleRiskAssessmentChange = (scenarioIndex: number, field: keyof RiskAssessment, value: string) => {
    const currentRiskAssessments = data.riskAssessments || riskScenarios.map(scenario => ({
      scenario,
      financialImpact: "",
      reputationalImpact: "",
      complianceImpact: "",
    }));

    const updatedAssessments = currentRiskAssessments.map((assessment, index) => 
      index === scenarioIndex ? { ...assessment, [field]: value } : assessment
    );

    handleInputChange("riskAssessments", updatedAssessments);
  };

  const handleFileUpload = (sectionId: string, files: FileList | null) => {
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] || []), ...fileNames]
      }));
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleContinue = () => {
    onSave();
    if (isLastSection) {
      onComplete();
    } else {
      onNext();
    }
  };

  const getIcon = (iconName: string) => {
    const iconProps = { className: "text-primary mr-2" };
    switch (iconName) {
      case "building": return <div {...iconProps}>🏢</div>;
      case "shield-alt": return <div {...iconProps}>🛡️</div>;
      case "lock": return <div {...iconProps}>🔒</div>;
      case "exclamation-triangle": return <div {...iconProps}>⚠️</div>;
      case "key": return <div {...iconProps}>🔑</div>;
      case "mobile-alt": return <div {...iconProps}>📱</div>;
      case "graduation-cap": return <div {...iconProps}>🎓</div>;
      case "server": return <div {...iconProps}>🖥️</div>;
      default: return <div {...iconProps}>📋</div>;
    }
  };

  const renderSectionContent = () => {
    switch (section.id) {
      case "general-org":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                What percentage of your staff work remotely for a significant proportion of their time?
              </Label>
              <Select
                value={data.remoteWorkPercentage || ""}
                onValueChange={(value) => handleInputChange("remoteWorkPercentage", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25">0-25%</SelectItem>
                  <SelectItem value="26-50">26-50%</SelectItem>
                  <SelectItem value="51-75">51-75%</SelectItem>
                  <SelectItem value="76-100">76-100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "privacy-compliance":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Are you required to be compliant with GDPR or similar privacy legislation?
              </Label>
              <RadioGroup
                value={data.gdprCompliance || ""}
                onValueChange={(value) => handleInputChange("gdprCompliance", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="gdpr-yes" />
                  <Label htmlFor="gdpr-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="gdpr-no" />
                  <Label htmlFor="gdpr-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Which acts are you required to comply with? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "gdpr", label: "GDPR" },
                  { value: "hipaa", label: "HIPAA" },
                  { value: "ccpa", label: "CCPA" },
                  { value: "popi", label: "POPI" },
                  { value: "privacy-act", label: "Australian Privacy Act" },
                  { value: "lgpd", label: "Brazil LGPD" },
                ].map((act) => (
                  <div key={act.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={act.value}
                      checked={(data.complianceActs || []).includes(act.value)}
                      onCheckedChange={(checked) =>
                        handleArrayChange("complianceActs", act.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={act.value} className="text-sm">
                      {act.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "sensitive-data":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you handle high-risk protected information about clients? (Health information, information about minors, criminal records, etc.)
              </Label>
              <RadioGroup
                value={data.sensitiveClientData || ""}
                onValueChange={(value) => handleInputChange("sensitiveClientData", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sensitive-yes" />
                  <Label htmlFor="sensitive-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sensitive-no" />
                  <Label htmlFor="sensitive-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you maintain any sensitive government information?
              </Label>
              <RadioGroup
                value={data.governmentData || ""}
                onValueChange={(value) => handleInputChange("governmentData", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="gov-yes" />
                  <Label htmlFor="gov-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="gov-no" />
                  <Label htmlFor="gov-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "risk-assessment":
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Assess the impact of cyber events on your business across Financial, Reputational, and Compliance categories.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 border border-gray-200">
                      Scenario
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700 border border-gray-200">
                      Financial Impact
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700 border border-gray-200">
                      Reputational Impact
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700 border border-gray-200">
                      Compliance Impact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {riskScenarios.map((scenario, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-200">
                        {scenario}
                      </td>
                      <td className="py-3 px-4 border border-gray-200">
                        <Select
                          value={data.riskAssessments?.[index]?.financialImpact || ""}
                          onValueChange={(value) => handleRiskAssessmentChange(index, "financialImpact", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {impactOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 border border-gray-200">
                        <Select
                          value={data.riskAssessments?.[index]?.reputationalImpact || ""}
                          onValueChange={(value) => handleRiskAssessmentChange(index, "reputationalImpact", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {impactOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 border border-gray-200">
                        <Select
                          value={data.riskAssessments?.[index]?.complianceImpact || ""}
                          onValueChange={(value) => handleRiskAssessmentChange(index, "complianceImpact", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {impactOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "password-policy":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you have a Password Management policy?
              </Label>
              <RadioGroup
                value={data.passwordPolicy || ""}
                onValueChange={(value) => handleInputChange("passwordPolicy", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="password-policy-yes" />
                  <Label htmlFor="password-policy-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="password-policy-no" />
                  <Label htmlFor="password-policy-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Which requirements are included in your password policy? (Select all that apply)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "min-8", label: "Minimum Length ≥8" },
                  { value: "min-12", label: "Minimum Length ≥12" },
                  { value: "mixed-case", label: "Required Mixed Case" },
                  { value: "special-chars", label: "Require Special Characters" },
                  { value: "no-repeat", label: "No Repeated Passwords" },
                  { value: "expiry", label: "Password Expiry (≤120 days)" },
                ].map((requirement) => (
                  <div key={requirement.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={requirement.value}
                      checked={(data.passwordRequirements || []).includes(requirement.value)}
                      onCheckedChange={(checked) =>
                        handleArrayChange("passwordRequirements", requirement.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={requirement.value} className="text-sm">
                      {requirement.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Upload Password Policy Document
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center file-upload-area">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drop files here or{" "}
                  <label className="text-primary font-medium cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload("password-policy", e.target.files)}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                {uploadedFiles["password-policy"] && (
                  <div className="mt-3 space-y-1">
                    {uploadedFiles["password-policy"].map((fileName, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-green-600">
                        <FileText className="w-4 h-4 mr-1" />
                        {fileName}
                        <Check className="w-4 h-4 ml-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "two-factor-auth":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you require Multi Factor Authentication for Email/Cloud Storage?
              </Label>
              <RadioGroup
                value={data.mfaEmail || ""}
                onValueChange={(value) => handleInputChange("mfaEmail", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="mfa-email-yes" />
                  <Label htmlFor="mfa-email-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="mfa-email-no" />
                  <Label htmlFor="mfa-email-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you require Multi Factor Authentication for remote access or VPN?
              </Label>
              <RadioGroup
                value={data.mfaRemoteAccess || ""}
                onValueChange={(value) => handleInputChange("mfaRemoteAccess", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="mfa-vpn-yes" />
                  <Label htmlFor="mfa-vpn-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="mfa-vpn-no" />
                  <Label htmlFor="mfa-vpn-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "training":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Does each user receive annual cyber security awareness training?
              </Label>
              <RadioGroup
                value={data.annualTraining || ""}
                onValueChange={(value) => handleInputChange("annualTraining", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="training-yes" />
                  <Label htmlFor="training-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="training-no" />
                  <Label htmlFor="training-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Does the company conduct phishing simulation tests?
              </Label>
              <RadioGroup
                value={data.phishingTests || ""}
                onValueChange={(value) => handleInputChange("phishingTests", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="phishing-yes" />
                  <Label htmlFor="phishing-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="phishing-no" />
                  <Label htmlFor="phishing-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Upload Training Evidence
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center file-upload-area">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Upload training schedules, attendance records, or certificates
                </p>
                <label className="mt-2 inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload("training", e.target.files)}
                  />
                </label>
                {uploadedFiles["training"] && (
                  <div className="mt-3 space-y-1">
                    {uploadedFiles["training"].map((fileName, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-green-600">
                        <FileText className="w-4 h-4 mr-1" />
                        {fileName}
                        <Check className="w-4 h-4 ml-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "disaster-recovery":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you have documented Disaster Recovery policies?
              </Label>
              <RadioGroup
                value={data.disasterRecoveryPolicy || ""}
                onValueChange={(value) => handleInputChange("disasterRecoveryPolicy", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dr-policy-yes" />
                  <Label htmlFor="dr-policy-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dr-policy-no" />
                  <Label htmlFor="dr-policy-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Is the disaster recovery plan tested at least annually?
              </Label>
              <RadioGroup
                value={data.drTesting || ""}
                onValueChange={(value) => handleInputChange("drTesting", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dr-testing-yes" />
                  <Label htmlFor="dr-testing-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dr-testing-no" />
                  <Label htmlFor="dr-testing-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you have a Cyber Incident Response Plan?
              </Label>
              <RadioGroup
                value={data.incidentResponsePlan || ""}
                onValueChange={(value) => handleInputChange("incidentResponsePlan", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="incident-plan-yes" />
                  <Label htmlFor="incident-plan-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="incident-plan-no" />
                  <Label htmlFor="incident-plan-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "incident-history":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Have you had any cyber security incidents in the past 2 years?
              </Label>
              <RadioGroup
                value={data.pastIncidents || ""}
                onValueChange={(value) => handleInputChange("pastIncidents", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="incidents-yes" />
                  <Label htmlFor="incidents-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="incidents-no" />
                  <Label htmlFor="incidents-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "cyber-risk":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Have you undertaken a cyber risk assessment in the past 12 months?
              </Label>
              <RadioGroup
                value={data.cyberRiskAssessmentDone || ""}
                onValueChange={(value) => handleInputChange("cyberRiskAssessmentDone", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="cyber-risk-yes" />
                  <Label htmlFor="cyber-risk-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="cyber-risk-no" />
                  <Label htmlFor="cyber-risk-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you maintain a Risk Register?
              </Label>
              <RadioGroup
                value={data.riskRegisterMaintained || ""}
                onValueChange={(value) => handleInputChange("riskRegisterMaintained", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="risk-register-yes" />
                  <Label htmlFor="risk-register-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="risk-register-no" />
                  <Label htmlFor="risk-register-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "encryption":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Is data encrypted in transit over the internet?
              </Label>
              <RadioGroup
                value={data.dataEncryptedInTransitInternet || ""}
                onValueChange={(value) => handleInputChange("dataEncryptedInTransitInternet", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="encrypt-internet-yes" />
                  <Label htmlFor="encrypt-internet-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="encrypt-internet-no" />
                  <Label htmlFor="encrypt-internet-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Is data encrypted at rest?
              </Label>
              <RadioGroup
                value={data.dataEncryptedAtRest || ""}
                onValueChange={(value) => handleInputChange("dataEncryptedAtRest", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="encrypt-rest-yes" />
                  <Label htmlFor="encrypt-rest-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="encrypt-rest-no" />
                  <Label htmlFor="encrypt-rest-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "antivirus":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you require Anti-Virus software on all workstations?
              </Label>
              <RadioGroup
                value={data.antivirusRequired || ""}
                onValueChange={(value) => handleInputChange("antivirusRequired", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="antivirus-yes" />
                  <Label htmlFor="antivirus-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="antivirus-no" />
                  <Label htmlFor="antivirus-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you use Intrusion Detection or Prevention Systems (IDS/IPS)?
              </Label>
              <RadioGroup
                value={data.idsIpsUsed || ""}
                onValueChange={(value) => handleInputChange("idsIpsUsed", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="ids-yes" />
                  <Label htmlFor="ids-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ids-no" />
                  <Label htmlFor="ids-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "access-control":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you have documented Access Control policies?
              </Label>
              <RadioGroup
                value={data.accessControlPolicy || ""}
                onValueChange={(value) => handleInputChange("accessControlPolicy", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="access-policy-yes" />
                  <Label htmlFor="access-policy-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="access-policy-no" />
                  <Label htmlFor="access-policy-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you segment your network to protect critical systems?
              </Label>
              <RadioGroup
                value={data.networkSegmentation || ""}
                onValueChange={(value) => handleInputChange("networkSegmentation", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="segmentation-yes" />
                  <Label htmlFor="segmentation-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="segmentation-no" />
                  <Label htmlFor="segmentation-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "vulnerability":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you conduct vulnerability scanning?
              </Label>
              <RadioGroup
                value={data.vulnerabilityScanning || ""}
                onValueChange={(value) => handleInputChange("vulnerabilityScanning", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vuln-scan-yes" />
                  <Label htmlFor="vuln-scan-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vuln-scan-no" />
                  <Label htmlFor="vuln-scan-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you have a patch management process?
              </Label>
              <RadioGroup
                value={data.patchManagement || ""}
                onValueChange={(value) => handleInputChange("patchManagement", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="patch-mgmt-yes" />
                  <Label htmlFor="patch-mgmt-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="patch-mgmt-no" />
                  <Label htmlFor="patch-mgmt-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "security-framework":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you follow an established security framework?
              </Label>
              <RadioGroup
                value={data.securityFramework || ""}
                onValueChange={(value) => handleInputChange("securityFramework", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="framework-yes" />
                  <Label htmlFor="framework-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="framework-no" />
                  <Label htmlFor="framework-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {data.securityFramework === "yes" && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Which framework do you primarily follow?
                </Label>
                <Select
                  value={data.primaryFramework || ""}
                  onValueChange={(value) => handleInputChange("primaryFramework", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iso27001">ISO 27001</SelectItem>
                    <SelectItem value="nist">NIST</SelectItem>
                    <SelectItem value="cis">CIS Controls</SelectItem>
                    <SelectItem value="pci-dss">PCI DSS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case "siem":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you use breach detection tools (SIEM, SOC services)?
              </Label>
              <RadioGroup
                value={data.breachDetectionTools || ""}
                onValueChange={(value) => handleInputChange("breachDetectionTools", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="siem-yes" />
                  <Label htmlFor="siem-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="siem-no" />
                  <Label htmlFor="siem-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Do you use SIEM or SOC monitoring services?
              </Label>
              <RadioGroup
                value={data.siemSocUsed || ""}
                onValueChange={(value) => handleInputChange("siemSocUsed", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="soc-yes" />
                  <Label htmlFor="soc-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="soc-no" />
                  <Label htmlFor="soc-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Section content not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {getIcon(section.icon)}
            {section.title}
          </h3>
        </div>
        <CardContent className="p-6">
          {renderSectionContent()}
        </CardContent>
      </Card>

      {/* Form Navigation */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onPrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleContinue}>
                {isLastSection ? "Complete Assessment" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
