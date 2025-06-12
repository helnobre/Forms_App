import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import UserInfoForm from "@/components/user-info-form";
import AssessmentForm from "@/components/assessment-form";
import SectionNav from "@/components/section-nav";
import { FormSection, UserFormData, AssessmentFormData } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const sections: FormSection[] = [
  { id: "user-info", title: "User Information", icon: "user-circle", completed: false },
  { id: "general-org", title: "General Organization", icon: "building", completed: false },
  { id: "privacy-compliance", title: "Privacy & Compliance", icon: "shield-alt", completed: false },
  { id: "sensitive-data", title: "Sensitive Data", icon: "lock", completed: false },
  { id: "risk-assessment", title: "Risk Assessment", icon: "exclamation-triangle", completed: false },
  { id: "password-policy", title: "Password Policy", icon: "key", completed: false },
  { id: "two-factor-auth", title: "2FA & Security", icon: "mobile-alt", completed: false },
  { id: "training", title: "Training", icon: "graduation-cap", completed: false },
  { id: "disaster-recovery", title: "Disaster Recovery", icon: "server", completed: false },
];

export default function AssessmentPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formSections, setFormSections] = useState(sections);
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Cyber Risk Assessment Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Assessment Progress</span>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentSection + 1} of {sections.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden xl:block">
          <SectionNav
            sections={formSections}
            currentSection={currentSection}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
