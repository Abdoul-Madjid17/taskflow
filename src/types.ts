export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  image?: string; // Base64 encoded image
  createdAt: string;
}

export type FilterOptions = 'all' | 'active' | 'completed';

export type PriorityType = 'low' | 'medium' | 'high';