export type PriorityClass = 'Critical' | 'High' | 'Standard' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'Needs Attention' | 'Task Comp';

export interface Task {
  id: string;
  title: string;
  summary: string;
  unitTag: string;
  timingTarget: string;
  priority: PriorityClass;
  status: Status;
  links: string;
  aiSuggestion?: {
    suggestedPriority: PriorityClass;
    riskAnalysis: string;
    clarityFeedback: string;
  };
  createdAt: number;
}
