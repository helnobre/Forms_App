
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, FileText, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  id: number;
  text: string;
  type: string;
  section: string;
  order: number;
}

interface Response {
  id: number;
  userId: number;
  questionId: number;
  answer: string;
  createdAt: string;
  updatedAt: string;
  question: Question;
}

interface UserData {
  id: number;
  fullName: string;
  email: string;
  company: string;
  position: string;
  phone: string;
  employeeCount: string;
  createdAt: string;
}

interface AssessmentData {
  id: number;
  userId: number;
  year: number;
  completedAt: string | null;
  isCompleted: boolean;
  remoteWorkPercentage?: string;
  gdprCompliance?: string;
  breachReporting?: string;
  breachNotification?: string;
  complianceActs?: string;
  sensitiveClientData?: string;
  governmentData?: string;
  commercialData?: string;
  financialImpact?: number;
  reputationalImpact?: number;
  complianceImpact?: number;
  financialImpact2?: number;
  reputationalImpact2?: number;
  complianceImpact2?: number;
  financialImpact3?: number;
  reputationalImpact3?: number;
  complianceImpact3?: number;
  financialImpact4?: number;
  reputationalImpact4?: number;
  complianceImpact4?: number;
  financialImpact5?: number;
  reputationalImpact5?: number;
  complianceImpact5?: number;
  pastIncidents?: string;
  cyberRiskAssessment?: string;
  internalAssessment?: string;
  lastAssessment?: string;
  riskRegister?: string;
  registerUpdated?: string;
  thirdPartyRisks?: string;
  passwordPolicy?: string;
  policyReviewed?: string;
  passwordRequirements?: string;
  emailMFA?: string;
  remoteMFA?: string;
  singleSignOn?: string;
  encryptionPolicy?: string;
  encryptionReviewed?: string;
  encryptionStandards?: string;
  antiVirusDeployed?: string;
  antiVirusManaged?: string;
  antiVirusUpdated?: string;
  accessControlPolicy?: string;
  accessReviewed?: string;
  privilegedAccess?: string;
  userProvisioning?: string;
  accessReviewProcess?: string;
  securityTraining?: string;
  trainingFrequency?: string;
  awarenessProgram?: string;
  vulnerabilityManagement?: string;
  vulnerabilityFrequency?: string;
  vulnerabilityResponse?: string;
  disasterRecoveryPlan?: string;
  recoveryTesting?: string;
  recoveryDocumentation?: string;
  securityFramework?: string;
  frameworkImplementation?: string;
  complianceAudits?: string;
  siemSolution?: string;
  siemMonitoring?: string;
  incidentResponse?: string;
}

interface AdminData {
  user: UserData;
  responses: Response[];
  assessments: AssessmentData[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Move useQuery to top level - hooks must not be called conditionally
  const { data: adminData = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/responses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/responses');
      if (!response.ok) throw new Error('Failed to fetch admin data');
      return response.json();
    },
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); // Clear any previous errors
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setPassword(""); // Clear the password field
      } else {
        setAuthError(data.message || "Invalid password");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Authentication failed. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {authError && (
                <p className="text-red-500 text-sm">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Error loading admin data</p>
        </div>
      </div>
    );
  }

  const groupResponsesBySection = (responses: Response[]) => {
    const grouped: { [section: string]: Response[] } = {};
    responses.forEach(response => {
      const section = response.question.section;
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(response);
    });
    return grouped;
  };

  const formatSectionName = (section: string) => {
    return section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatAssessmentField = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') return null;
    
    const fieldLabels: { [key: string]: string } = {
      remoteWorkPercentage: 'Remote Work Percentage',
      gdprCompliance: 'GDPR Compliance',
      breachReporting: 'Breach Reporting Required',
      breachNotification: 'Breach Notification Required',
      complianceActs: 'Compliance Acts',
      sensitiveClientData: 'Sensitive Client Data',
      governmentData: 'Government Data',
      commercialData: 'Commercial Data',
      financialImpact: 'Financial Impact (Scenario 1)',
      reputationalImpact: 'Reputational Impact (Scenario 1)',
      complianceImpact: 'Compliance Impact (Scenario 1)',
      financialImpact2: 'Financial Impact (Scenario 2)',
      reputationalImpact2: 'Reputational Impact (Scenario 2)',
      complianceImpact2: 'Compliance Impact (Scenario 2)',
      financialImpact3: 'Financial Impact (Scenario 3)',
      reputationalImpact3: 'Reputational Impact (Scenario 3)',
      complianceImpact3: 'Compliance Impact (Scenario 3)',
      financialImpact4: 'Financial Impact (Scenario 4)',
      reputationalImpact4: 'Reputational Impact (Scenario 4)',
      complianceImpact4: 'Compliance Impact (Scenario 4)',
      financialImpact5: 'Financial Impact (Scenario 5)',
      reputationalImpact5: 'Reputational Impact (Scenario 5)',
      complianceImpact5: 'Compliance Impact (Scenario 5)',
      pastIncidents: 'Past Incidents',
      cyberRiskAssessment: 'Cyber Risk Assessment Done',
      internalAssessment: 'Internal Assessment',
      lastAssessment: 'Last Assessment Date',
      riskRegister: 'Risk Register Maintained',
      registerUpdated: 'Register Last Updated',
      thirdPartyRisks: 'Third Party Risks Considered',
      passwordPolicy: 'Password Policy',
      policyReviewed: 'Policy Reviewed',
      passwordRequirements: 'Password Requirements',
      emailMFA: 'Email MFA',
      remoteMFA: 'Remote MFA',
      singleSignOn: 'Single Sign On',
      encryptionPolicy: 'Encryption Policy',
      encryptionReviewed: 'Encryption Policy Reviewed',
      encryptionStandards: 'Encryption Standards',
      antiVirusDeployed: 'Anti-virus Deployed',
      antiVirusManaged: 'Anti-virus Managed',
      antiVirusUpdated: 'Anti-virus Updated',
      accessControlPolicy: 'Access Control Policy',
      accessReviewed: 'Access Control Reviewed',
      privilegedAccess: 'Privileged Access Management',
      userProvisioning: 'User Provisioning',
      accessReviewProcess: 'Access Review Process',
      securityTraining: 'Security Training',
      trainingFrequency: 'Training Frequency',
      awarenessProgram: 'Awareness Program',
      vulnerabilityManagement: 'Vulnerability Management',
      vulnerabilityFrequency: 'Vulnerability Scan Frequency',
      vulnerabilityResponse: 'Vulnerability Response',
      disasterRecoveryPlan: 'Disaster Recovery Plan',
      recoveryTesting: 'Recovery Testing',
      recoveryDocumentation: 'Recovery Documentation',
      securityFramework: 'Security Framework',
      frameworkImplementation: 'Framework Implementation',
      complianceAudits: 'Compliance Audits',
      siemSolution: 'SIEM Solution',
      siemMonitoring: 'SIEM Monitoring',
      incidentResponse: 'Incident Response Plan'
    };

    return {
      label: fieldLabels[key] || key,
      value: value
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage and review all user assessment responses
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Assessment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Array.isArray(adminData) ? adminData.length : 0}
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Array.isArray(adminData) ? adminData.reduce((sum: number, user: AdminData) => sum + user.responses.length + (user.assessments?.length || 0), 0) : 0}
                </div>
                <div className="text-sm text-gray-500">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Array.isArray(adminData) ? adminData.filter((user: AdminData) => user.responses.length > 0 || (user.assessments && user.assessments.length > 0)).length : 0}
                </div>
                <div className="text-sm text-gray-500">Active Assessments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {Array.isArray(adminData) && adminData.map((userData: AdminData) => (
          <Card key={userData.user.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <div className="font-semibold">{userData.user.fullName}</div>
                    <div className="text-sm text-gray-500">{userData.user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-x-2">
                    <Badge variant="secondary">
                      {userData.responses.length} dynamic responses
                    </Badge>
                    {userData.assessments?.length > 0 && (
                      <Badge variant="outline">
                        {userData.assessments.length} assessments
                      </Badge>
                    )}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* User Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>{" "}
                    {userData.user.company}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Position:</span>{" "}
                    {userData.user.position}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>{" "}
                    {userData.user.phone}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Employees:</span>{" "}
                    {userData.user.employeeCount}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-medium text-gray-700">Joined:</span>{" "}
                    {new Date(userData.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Assessment Data */}
              {userData.assessments?.length > 0 && (
                <div className="space-y-6 mb-6">
                  <h4 className="font-medium text-gray-900">Assessment Answers</h4>
                  {userData.assessments.map((assessment) => (
                    <div key={assessment.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-800">
                          Assessment {assessment.year}
                        </h5>
                        <Badge variant={assessment.isCompleted ? "default" : "secondary"}>
                          {assessment.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      
                      {/* Display all assessment fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {Object.entries(assessment).map(([key, value]) => {
                          if (['id', 'userId', 'year', 'completedAt', 'isCompleted'].includes(key)) {
                            return null;
                          }
                          
                          const field = formatAssessmentField(key, value);
                          if (!field) return null;
                          
                          return (
                            <div key={key} className="bg-white p-3 rounded border">
                              <div className="font-medium text-gray-700 mb-1">{field.label}:</div>
                              <div className="text-gray-900">
                                {typeof field.value === 'number' ? field.value : field.value}
                              </div>
                            </div>
                          );
                        })}
                        
                        {assessment.completedAt && (
                          <div className="bg-white p-3 rounded border">
                            <div className="font-medium text-gray-700 mb-1">Completed At:</div>
                            <div className="text-gray-900">
                              {new Date(assessment.completedAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Question Responses */}
              {userData.responses.length > 0 && (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Dynamic Question Responses</h4>
                  {Object.entries(groupResponsesBySection(userData.responses)).map(
                    ([section, responses]) => (
                      <div key={section} className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-3">
                          {formatSectionName(section)}
                        </h5>
                        <div className="space-y-3">
                          {responses.map((response) => (
                            <div key={response.id} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    {getQuestionTypeIcon(response.question.type)}
                                    <p className="text-sm font-medium text-gray-700 ml-1">
                                      {response.question.text}
                                    </p>
                                  </div>
                                  <div className="text-sm text-gray-900 bg-gray-50 rounded p-2">
                                    {response.question.type === 'checkbox' && response.answer
                                      ? response.answer.split(',').map((item, idx) => (
                                          <Badge key={idx} variant="outline" className="mr-1 mb-1">
                                            {item.trim()}
                                          </Badge>
                                        ))
                                      : response.answer || (
                                          <span className="text-gray-400 italic">No response</span>
                                        )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Last updated: {new Date(response.updatedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Show message if no data */}
              {userData.responses.length === 0 && (!userData.assessments || userData.assessments.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No responses or assessments submitted yet
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {Array.isArray(adminData) && adminData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-500">
                No users have submitted assessment responses yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
