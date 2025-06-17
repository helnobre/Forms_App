import { useState, useEffect } from "react";
import { Save, ArrowRight, ArrowLeft, Upload, FileText, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  id: number;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'file';
  section: string;
  order: number;
  options: Array<{
    id: number;
    questionId: number;
    text: string;
    value: string;
    order: number;
  }>;
}

interface Response {
  id: number;
  userId: number;
  questionId: number;
  answer: string;
}

interface DynamicAssessmentFormProps {
  section: string;
  userId: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isLastSection?: boolean;
  isFirstSection?: boolean;
}

export default function DynamicAssessmentForm({
  section,
  userId,
  onNext,
  onPrevious,
  isLastSection = false,
  isFirstSection = false,
}: DynamicAssessmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [responses, setResponses] = useState<{ [questionId: number]: string }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [questionId: number]: string }>({});

  // Fetch questions for this section
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/questions/section', section],
    queryFn: () => apiRequest(`/api/questions/section/${section}`, { on401: "throw" }),
  });

  // Fetch existing responses for this user
  const { data: existingResponses = [] } = useQuery({
    queryKey: ['/api/users', userId, 'responses'],
    queryFn: () => apiRequest(`/api/users/${userId}/responses`, { on401: "throw" }),
  });

  // Load existing responses into state
  useEffect(() => {
    if (Array.isArray(existingResponses) && existingResponses.length > 0) {
      const responseMap: { [questionId: number]: string } = {};
      existingResponses.forEach((response: Response) => {
        responseMap[response.questionId] = response.answer;
      });
      setResponses(responseMap);
    }
  }, [existingResponses]);

  // Save response mutation
  const saveResponseMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: number; answer: string }) => {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId, answer }),
      });
      if (!response.ok) throw new Error('Failed to save response');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'responses'] });
    },
  });

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, questionId }: { file: File; questionId: number }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId.toString());
      formData.append('questionId', questionId.toString());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      return response.json();
    },
    onSuccess: (data: any, variables) => {
      setUploadedFiles(prev => ({
        ...prev,
        [variables.questionId]: data.fileName
      }));
      toast({
        title: "File uploaded successfully",
        description: `${data.fileName} has been uploaded.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'responses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const handleResponseChange = (questionId: number, answer: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
    
    // Auto-save the response
    saveResponseMutation.mutate({ questionId, answer });
  };

  const handleCheckboxChange = (questionId: number, optionValue: string, checked: boolean) => {
    const currentAnswers = responses[questionId] ? responses[questionId].split(',') : [];
    let newAnswers: string[];
    
    if (checked) {
      newAnswers = [...currentAnswers, optionValue];
    } else {
      newAnswers = currentAnswers.filter(answer => answer !== optionValue);
    }
    
    const answer = newAnswers.join(',');
    handleResponseChange(questionId, answer);
  };

  const handleFileUpload = (questionId: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      uploadFileMutation.mutate({ file, questionId });
    }
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = responses[question.id] || '';
    
    switch (question.type) {
      case 'text':
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your response"
            className="mt-2"
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) => handleResponseChange(question.id, value)}
            className="mt-3"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.id}`} />
                <Label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const selectedAnswers = currentAnswer ? currentAnswer.split(',') : [];
        return (
          <div className="mt-3 space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.id}`}
                  checked={selectedAnswers.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(question.id, option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="mt-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drop files here or{" "}
                <label className="text-primary font-medium cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(question.id, e.target.files)}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT up to 10MB</p>
              
              {(uploadedFiles[question.id] || currentAnswer) && (
                <div className="mt-3">
                  <div className="flex items-center justify-center text-sm text-green-600">
                    <FileText className="w-4 h-4 mr-1" />
                    {uploadedFiles[question.id] || currentAnswer}
                    <Check className="w-4 h-4 ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (questionsLoading) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">No questions available for this section.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {section.replace('-', ' ')} Assessment
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 block">
                  {question.text}
                </Label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Auto-saving responses...
              </span>
            </div>
            <div className="flex space-x-3">
              {!isFirstSection && (
                <Button variant="outline" onClick={onPrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {onNext && (
                <Button onClick={onNext}>
                  {isLastSection ? "Complete Assessment" : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}