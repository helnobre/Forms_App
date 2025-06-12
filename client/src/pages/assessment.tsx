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

  const progress = ((currentSection + 1) / sections.length) * 100;

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

  const autoSave = () => {
    // Auto-save functionality
    setLastSaved(new Date());
    // Here you would implement the actual save to backend
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
              onNext={handleNext}
              onSave={autoSave}
              lastSaved={lastSaved}
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
              lastSaved={lastSaved}
              isLastSection={currentSection === sections.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
