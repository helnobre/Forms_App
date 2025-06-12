import { useState, useEffect } from "react";
import { Shield, Globe, Menu, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserInfoForm from "@/components/user-info-form";
import AssessmentForm from "@/components/assessment-form";
import SectionNav from "@/components/section-nav";
import { FormSection, UserFormData, AssessmentFormData } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
const sections: FormSection[] = [
  { id: "user-info", title: "nav.userInfo", icon: "user-circle", completed: false },
  { id: "general-org", title: "nav.generalOrg", icon: "building", completed: false },
  { id: "privacy-compliance", title: "nav.privacyCompliance", icon: "shield-alt", completed: false },
  { id: "sensitive-data", title: "nav.sensitiveData", icon: "lock", completed: false },
  { id: "risk-assessment", title: "nav.riskAssessment", icon: "exclamation-triangle", completed: false },
  { id: "incident-history", title: "nav.incidentHistory", icon: "history", completed: false },
  { id: "cyber-risk", title: "nav.cyberRisk", icon: "shield", completed: false },
  { id: "password-policy", title: "nav.passwordPolicy", icon: "key", completed: false },
  { id: "two-factor-auth", title: "nav.twoFactorAuth", icon: "mobile-alt", completed: false },
  { id: "encryption", title: "nav.encryption", icon: "lock", completed: false },
  { id: "anti-virus", title: "nav.antiVirus", icon: "shield-check", completed: false },
  { id: "access-control", title: "nav.accessControl", icon: "user-check", completed: false },
  { id: "training", title: "nav.training", icon: "graduation-cap", completed: false },
  { id: "vulnerability", title: "nav.vulnerability", icon: "bug", completed: false },
  { id: "disaster-recovery", title: "nav.disasterRecovery", icon: "server", completed: false },
  { id: "security-framework", title: "nav.securityFramework", icon: "layers", completed: false },
  { id: "siem", title: "nav.siem", icon: "monitor", completed: false },
];

export default function AssessmentPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formSections, setFormSections] = useState(sections);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    employeeCount: "",
  });
  const [assessmentFormData, setAssessmentFormData] = useState<AssessmentFormData>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language, setLanguage, t } = useLanguage();

  const progress = ((currentSection + 1) / sections.length) * 100;

  // Mutations for database operations
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return await response.json();
    },
    onSuccess: (user: any) => {
      setUserId(user.id);
      toast({
        title: "User information saved",
        description: "Your information has been successfully stored.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving user information",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const response = await apiRequest('POST', '/api/assessments', assessmentData);
      return await response.json();
    },
    onSuccess: (assessment: any) => {
      setAssessmentId(assessment.id);
      setLastSaved(new Date());
    },
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/assessments/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      setLastSaved(new Date());
    },
  });

  const completeAssessmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/assessments/${id}/complete`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assessment completed!",
        description: "Your cyber risk assessment has been submitted successfully.",
      });
    },
  });

  const updateSectionCompletion = (sectionIndex: number, completed: boolean) => {
    setFormSections(prev => 
      prev.map((section, index) => 
        index === sectionIndex ? { ...section, completed } : section
      )
    );
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      updateSectionCompletion(currentSection, true);
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
  };

  const handleUserFormSubmit = async (userData: UserFormData) => {
    try {
      const user = await createUserMutation.mutateAsync(userData);
      
      // Create initial assessment record
      const currentYear = new Date().getFullYear();
      const assessmentData = {
        userId: user.id,
        year: currentYear,
        isCompleted: false,
        ...assessmentFormData,
      };
      
      await createAssessmentMutation.mutateAsync(assessmentData);
      handleNext();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const autoSave = async () => {
    if (assessmentId && Object.keys(assessmentFormData).length > 0) {
      try {
        await updateAssessmentMutation.mutateAsync({
          id: assessmentId,
          data: assessmentFormData,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };

  const handleAssessmentComplete = async () => {
    if (assessmentId) {
      try {
        await updateAssessmentMutation.mutateAsync({
          id: assessmentId,
          data: assessmentFormData,
        });
        await completeAssessmentMutation.mutateAsync(assessmentId);
      } catch (error) {
        console.error('Error completing assessment:', error);
      }
    }
  };

  useEffect(() => {
    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="xl:hidden mr-2"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Shield className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                {t('header.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <Select value={language} onValueChange={(value: 'en' | 'pt') => setLanguage(value)}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="pt">PT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Progress on larger screens */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-500">{t('header.progress')}</span>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentSection + 1} of {sections.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileNavOpen(false)} />
          <div className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto">
            <SectionNav
              sections={formSections.map(section => ({ 
                ...section, 
                title: t(section.title) 
              }))}
              currentSection={currentSection}
              onSectionClick={(index) => {
                handleSectionClick(index);
                setIsMobileNavOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <div className="hidden xl:block fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <SectionNav
            sections={formSections.map(section => ({ 
              ...section, 
              title: t(section.title) 
            }))}
            currentSection={currentSection}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 xl:ml-64 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentSection === 0 ? (
            <UserInfoForm
              data={userFormData}
              onChange={setUserFormData}
              onSubmit={handleUserFormSubmit}
              lastSaved={lastSaved}
              isLoading={createUserMutation.isPending}
            />
          ) : (
            <AssessmentForm
              sectionIndex={currentSection - 1}
              section={formSections[currentSection]}
              data={assessmentFormData}
              onChange={setAssessmentFormData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSave={autoSave}
              onComplete={handleAssessmentComplete}
              lastSaved={lastSaved}
              isLastSection={currentSection === sections.length - 1}
              isLoading={updateAssessmentMutation.isPending || completeAssessmentMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
