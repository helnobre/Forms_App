import { useState } from "react";
import { UserCircle, Save, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserFormData } from "@/lib/types";

interface UserInfoFormProps {
  data: UserFormData;
  onChange: (data: UserFormData) => void;
  onSubmit: (data: UserFormData) => void;
  lastSaved: Date | null;
  isLoading: boolean;
}

export default function UserInfoForm({ data, onChange, onSubmit, lastSaved, isLoading }: UserInfoFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    onChange({ ...data, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};
    
    if (!data.fullName?.trim()) newErrors.fullName = t('validation.nameRequired');
    if (!data.email?.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = t('validation.emailInvalid');
    if (!data.company?.trim()) newErrors.company = t('validation.companyRequired');
    if (!data.position?.trim()) newErrors.position = t('validation.positionRequired');
    if (!data.phone?.trim()) newErrors.phone = t('validation.phoneRequired');
    if (!data.employeeCount) newErrors.employeeCount = t('validation.employeeCountRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onSubmit(data);
    } else {
      toast({
        title: "Please complete all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserCircle className="text-primary mr-2" />
            {t('userInfo.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('userInfo.description')}
          </p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                {t('userInfo.fullName')} *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={data.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`mt-2 ${errors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('userInfo.email')} *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@company.com"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-2 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                {t('userInfo.company')} *
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Corporation"
                value={data.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className={`mt-2 ${errors.company ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.company && (
                <p className="text-sm text-red-600 mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                {t('userInfo.position')} *
              </Label>
              <Input
                id="position"
                type="text"
                placeholder="IT Director"
                value={data.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className={`mt-2 ${errors.position ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.position && (
                <p className="text-sm text-red-600 mt-1">{errors.position}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                {t('userInfo.phone')} *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`mt-2 ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">
                {t('userInfo.employeeCount')} *
              </Label>
              <Select
                value={data.employeeCount}
                onValueChange={(value) => handleInputChange("employeeCount", value)}
              >
                <SelectTrigger className={`mt-2 ${errors.employeeCount ? "border-red-500 focus:border-red-500" : ""}`}>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">{t('employees.1-10')}</SelectItem>
                  <SelectItem value="11-50">{t('employees.11-50')}</SelectItem>
                  <SelectItem value="51-200">{t('employees.51-200')}</SelectItem>
                  <SelectItem value="201-500">{t('employees.201-500')}</SelectItem>
                  <SelectItem value="501-1000">{t('employees.501-1000')}</SelectItem>
                  <SelectItem value="1000+">{t('employees.1000+')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.employeeCount && (
                <p className="text-sm text-red-600 mt-1">{errors.employeeCount}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Navigation */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <Button onClick={handleContinue} disabled={isLoading}>
              {isLoading ? t('userInfo.saving') : t('userInfo.continue')}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
