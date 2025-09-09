export interface Task {
  id: string;
  title: string;
  description?: string;
  category: GTDCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime?: number;
  context?: string[];
  energyLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'waiting' | 'someday';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  subtasks?: Task[];
  dependencies?: string[];
  parentId?: string;
  level: 'large' | 'medium' | 'small';
  isDecomposed?: boolean;
}

export type GTDCategory = 
  | 'capture' 
  | 'next_actions' 
  | 'projects' 
  | 'waiting_for' 
  | 'someday_maybe' 
  | 'calendar' 
  | 'reference';

export interface Project {
  id: string;
  title: string;
  description?: string;
  vision?: string;
  area?: LifeArea;
  status: 'active' | 'completed' | 'on_hold';
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export type LifeArea = 
  | 'work' 
  | 'health' 
  | 'family' 
  | 'personal' 
  | 'finance' 
  | 'learning' 
  | 'creativity' 
  | 'social';

export interface Context {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface UserState {
  currentMood: 'low' | 'medium' | 'high';
  currentEnergyLevel: 'low' | 'medium' | 'high';
  availableTime: number;
  currentContext: string[];
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  contexts: Context[];
  userState: UserState;
  settings: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    adhdFeatures: boolean;
    notifications: boolean;
    focusMode: boolean;
  };
}