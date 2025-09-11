import { useState, useCallback, useEffect } from 'react';
import { Task, GTDCategory, UserState } from '@/types';
import { generateId, getCurrentJapaneseTime, isTaskDoableNow } from '@/lib/utils';
import { useAuth } from './useAuth';

export function useTasks() {
  const { getUserDataKey, updateLastActiveTime, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userState, setUserState] = useState<UserState>({
    currentMood: 'medium',
    currentEnergyLevel: 'medium',
    availableTime: 60,
    currentContext: ['home'],
  });

  // ユーザー別のローカルストレージからタスクを読み込み
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setUserState({
        currentMood: 'medium',
        currentEnergyLevel: 'medium',
        availableTime: 60,
        currentContext: ['home'],
      });
      return;
    }

    const tasksKey = getUserDataKey('tasks');
    const userStateKey = getUserDataKey('user-state');
    
    if (tasksKey) {
      const savedTasks = localStorage.getItem(tasksKey);
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          setTasks(parsedTasks);
        } catch (error) {
          console.error('Failed to parse saved tasks:', error);
          setTasks([]);
        }
      } else {
        // ユーザーのタスクデータがない場合は空配列で初期化
        setTasks([]);
      }
    }

    if (userStateKey) {
      const savedUserState = localStorage.getItem(userStateKey);
      if (savedUserState) {
        try {
          setUserState(JSON.parse(savedUserState));
        } catch (error) {
          console.error('Failed to parse saved user state:', error);
        }
      }
    }

    // ユーザーのアクティブ時間を更新
    updateLastActiveTime();
  }, [user, getUserDataKey, updateLastActiveTime]);

  // ユーザー別にタスクをローカルストレージに保存（ユーザーがログインしている時のみ）
  useEffect(() => {
    const tasksKey = getUserDataKey('tasks');
    if (tasksKey && user) {
      localStorage.setItem(tasksKey, JSON.stringify(tasks));
    }
  }, [tasks, getUserDataKey, user]);

  // ユーザー別にユーザー状態をローカルストレージに保存（ユーザーがログインしている時のみ）
  useEffect(() => {
    const userStateKey = getUserDataKey('user-state');
    if (userStateKey && user) {
      localStorage.setItem(userStateKey, JSON.stringify(userState));
    }
  }, [userState, getUserDataKey, user]);

  const addTask = useCallback((taskData: Partial<Task>) => {
    console.log("addTask called with:", taskData);
    const newTask: Task = {
      id: generateId(),
      title: taskData.title || '',
      description: taskData.description || '',
      category: taskData.category || 'capture',
      difficulty: taskData.difficulty || 3,
      estimatedTime: taskData.estimatedTime || 30,
      context: taskData.context || [],
      energyLevel: taskData.energyLevel || 'medium',
      status: taskData.status || 'active',
      createdAt: getCurrentJapaneseTime(),
      updatedAt: getCurrentJapaneseTime(),
      projectId: taskData.projectId,
      subtasks: [],
      dependencies: [],
      level: taskData.level || 'medium',
      isDecomposed: false,
      ...taskData,
    };

    setTasks(prev => [...prev, newTask]);
    console.log("Task added to state, new tasks array length:", tasks.length + 1);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: getCurrentJapaneseTime() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    updateTask(id, { status: 'completed' });
  }, [updateTask]);

  const uncompleteTask = useCallback((id: string) => {
    updateTask(id, { status: 'active' });
  }, [updateTask]);

  const getTasksByCategory = useCallback((category: GTDCategory) => {
    return tasks.filter(task => task.category === category && task.status !== 'completed');
  }, [tasks]);

  const getDoableNowTasks = useCallback(() => {
    return tasks.filter(task => 
      task.status === 'active' && 
      task.category === 'next_actions' &&
      isTaskDoableNow(task, userState)
    );
  }, [tasks, userState]);

  const getTodaysTasks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate >= today && 
      task.dueDate < tomorrow &&
      task.status === 'active'
    );
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'completed');
  }, [tasks]);

  const updateUserState = useCallback((updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  }, []);

  const quickCapture = useCallback((text: string) => {
    console.log("QuickCapture: Adding new task with text:", text);
    const newTask = addTask({
      title: text,
      category: "capture",
      difficulty: 1,
      energyLevel: "low",
      level: "medium",
    });
    console.log("QuickCapture: Task added successfully:", newTask);
    return newTask;
  }, [addTask]);

  const createSubtask = useCallback((parentId: string, subtaskData: Partial<Task>) => {
    const subtask: Task = {
      id: generateId(),
      title: subtaskData.title || '',
      description: subtaskData.description || '',
      category: subtaskData.category || 'capture',
      difficulty: subtaskData.difficulty || 3,
      estimatedTime: subtaskData.estimatedTime || 30,
      context: subtaskData.context || [],
      energyLevel: subtaskData.energyLevel || 'medium',
      status: subtaskData.status || 'active',
      createdAt: getCurrentJapaneseTime(),
      updatedAt: getCurrentJapaneseTime(),
      subtasks: [],
      dependencies: [],
      level: subtaskData.level || 'small',
      isDecomposed: false,
      parentId: parentId,
      ...subtaskData,
    };

    setTasks(prev => [...prev, subtask]);
    return subtask;
  }, []);

  const getSubtasks = useCallback((parentId: string) => {
    return tasks.filter(task => task.parentId === parentId);
  }, [tasks]);

  const getTasksWithSubtasks = useCallback(() => {
    const taskMap = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      if (task.parentId) {
        if (!taskMap.has(task.parentId)) {
          taskMap.set(task.parentId, []);
        }
        taskMap.get(task.parentId)!.push(task);
      }
    });

    return tasks.map(task => ({
      ...task,
      subtasks: taskMap.get(task.id) || [],
    }));
  }, [tasks]);

  return {
    tasks,
    userState,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    getTasksByCategory,
    getDoableNowTasks,
    getTodaysTasks,
    getCompletedTasks,
    updateUserState,
    quickCapture,
    createSubtask,
    getSubtasks,
    getTasksWithSubtasks,
  };
}