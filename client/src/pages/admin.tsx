import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, FileText, Calendar } from "lucide-react";
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

interface AdminData {
  user: UserData;
  responses: Response[];
}

export default function AdminPage() {
  const { data: adminData = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/responses'],
    queryFn: () => apiRequest<AdminData[]>('/api/admin/responses'),
  });

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
                <div className="text-2xl font-bold text-blue-600">{adminData.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {adminData.reduce((sum, user) => sum + user.responses.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {adminData.filter(user => user.responses.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">Active Assessments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {adminData.map((userData) => (
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
                  <Badge variant="secondary">
                    {userData.responses.length} responses
                  </Badge>
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

              {/* Responses by Section */}
              {userData.responses.length > 0 ? (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Assessment Responses</h4>
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No responses submitted yet
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {adminData.length === 0 && (
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