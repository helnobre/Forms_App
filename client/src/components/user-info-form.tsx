import { useState } from "react";
import { UserCircle, Save, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserFormData } from "@/lib/types";

interface UserInfoFormProps {
  data: UserFormData;
  onChange: (data: UserFormData) => void;
  onNext: () => void;
  onSave: () => void;
  lastSaved: Date | null;
}

export default function UserInfoForm({ data, onChange, onNext, onSave, lastSaved }: UserInfoFormProps) {
  const { toast } = useToast();
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
    
    if (!data.fullName?.trim()) newErrors.fullName = "Full name is required";
    if (!data.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Email is invalid";
    if (!data.company?.trim()) newErrors.company = "Company name is required";
    if (!data.position?.trim()) newErrors.position = "Position is required";
    if (!data.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!data.employeeCount) newErrors.employeeCount = "Employee count is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onSave();
      onNext();
      toast({
        title: "User information saved",
        description: "You can now proceed to the assessment sections.",
      });
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
            User Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Please provide your contact information and company details.
          </p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name *
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
                Email Address *
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
                Company Name *
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
                Position/Title *
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
                Phone Number *
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
                Number of Employees *
              </Label>
              <Select
                value={data.employeeCount}
                onValueChange={(value) => handleInputChange("employeeCount", value)}
              >
                <SelectTrigger className={`mt-2 ${errors.employeeCount ? "border-red-500 focus:border-red-500" : ""}`}>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
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
            <Button onClick={handleContinue}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
