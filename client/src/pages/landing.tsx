import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, ArrowRight, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const handleAssessmentClick = () => {
    setLocation("/assessment");
  };

  const handleAdminClick = () => {
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">
                Cyber Risk Assessment Platform
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="text-sm"
              >
                {language === 'en' ? 'PT' : 'EN'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="h-24 w-24 text-primary" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Comprehensive Cyber Risk Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Evaluate your organization's cybersecurity posture with our comprehensive assessment tool. 
              Get insights into vulnerabilities and receive recommendations to strengthen your security framework.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Assessment Portal Card */}
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <FileText className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Assessment
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Begin your comprehensive cybersecurity risk assessment. 
                    Answer questions across multiple security domains to identify 
                    vulnerabilities and compliance gaps.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      17 comprehensive security sections
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Auto-save functionality
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      File upload capabilities
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Multilingual support
                    </div>
                  </div>
                  <Button 
                    onClick={handleAssessmentClick}
                    className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Begin Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Dashboard Card */}
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <Users className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Admin Dashboard
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Access the administrative dashboard to review all submitted 
                    assessments, analyze responses, and manage user data across 
                    your organization.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      View all user responses
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Assessment analytics
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Export capabilities
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      User management
                    </div>
                  </div>
                  <Button 
                    onClick={handleAdminClick}
                    className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Why Choose Our Assessment Platform?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Coverage</h4>
                <p className="text-gray-600">
                  Covers all major cybersecurity domains including access control, 
                  encryption, training, and incident response.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Questions</h4>
                <p className="text-gray-600">
                  Database-driven questions that adapt to your responses with 
                  intelligent form logic and file upload capabilities.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Multi-User Support</h4>
                <p className="text-gray-600">
                  Support for multiple organizations with separate data 
                  storage and comprehensive admin oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Cyber Risk Assessment Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}