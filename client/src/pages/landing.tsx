import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, ArrowRight, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";
import moore from "@/assets/moore.png"

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
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Moore Logo" className="h-8 w-auto" />
              <h1 className="text-lg font-semibold text-gray-900">
                {t('landing.header.title')}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              className="text-sm font-medium"
            >
              {language === 'en' ? 'PT' : 'EN'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative p-4 bg-white rounded-2xl shadow-lg">
                <img src={moore} alt="Moore Logo" className="h-8 w-auto" />
                {/*<Shield className="h-16 w-16 text-blue-600" />*/}
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('landing.hero.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('landing.hero.description')}
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex justify-center max-w-3xl mx-auto mb-16">
            {/* Assessment Card */}
            <Card className="group bg-white shadow-xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer max-w-md" onClick={handleAssessmentClick}>
              <CardContent className="p-8 text-center">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('landing.assessment.title')}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('landing.assessment.description')}
                </p>
                <Button 
                  className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  size="lg"
                >
                  {t('landing.assessment.button')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>17 Security Domains</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Multi-language Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Enterprise Ready</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>{t('landing.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}