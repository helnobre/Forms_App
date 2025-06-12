import { Check } from "lucide-react";
import { FormSection } from "@/lib/types";

interface SectionNavProps {
  sections: FormSection[];
  currentSection: number;
  onSectionClick: (sectionIndex: number) => void;
}

export default function SectionNav({ sections, currentSection, onSectionClick }: SectionNavProps) {
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      "user-circle": "👤",
      "building": "🏢",
      "shield-alt": "🛡️",
      "lock": "🔒",
      "exclamation-triangle": "⚠️",
      "key": "🔑",
      "mobile-alt": "📱",
      "graduation-cap": "🎓",
      "server": "🖥️",
    };
    return iconMap[iconName] || "📋";
  };

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Assessment Sections</h4>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(index)}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors section-nav-item ${
                index === currentSection
                  ? "active bg-primary/10 text-primary"
                  : section.completed
                  ? "completed bg-green-50 text-green-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center mr-3 ${
                  index === currentSection
                    ? "bg-primary text-white"
                    : section.completed
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {section.completed ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="flex-1 text-left">{section.title}</span>
              <span className="text-xs opacity-50">{getIcon(section.icon)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
