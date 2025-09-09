'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/features/Navigation';
import { QuickCapture } from '@/components/features/QuickCapture';
import { SimpleLogin } from '@/components/features/SimpleLogin';
import { TaskForm } from '@/components/features/TaskForm';
import { DoableNowPanel } from '@/components/features/DoableNowPanel';
import { GTDLists } from '@/components/features/GTDLists';
import { ProgressPanel } from '@/components/features/ProgressPanel';
import { TaskDecomposition } from '@/components/features/TaskDecomposition';
import { CompletedTasks } from '@/components/features/CompletedTasks';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TaskCard } from '@/components/features/TaskCard';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { user, isLoading, login, logout, isLoggedIn } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [adhdMode, setAdhdMode] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [decomposingTask, setDecomposingTask] = useState<Task | undefined>(undefined);

  const {
    tasks,
    userState,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    getDoableNowTasks,
    getTodaysTasks,
    getCompletedTasks,
    updateUserState,
    quickCapture,
    createSubtask,
    getSubtasks,
    getTasksWithSubtasks,
  } = useTasks();

  const doableTasks = getDoableNowTasks();
  const todaysTasks = getTodaysTasks();
  const completedTasks = getCompletedTasks();
  const tasksWithSubtasks = getTasksWithSubtasks();

  const handleQuickCapture = (text: string) => {
    quickCapture(text);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleDecomposeTask = (task: Task) => {
    setDecomposingTask(task);
  };

  const handleCreateSubtask = (parentId: string, subtaskData: Partial<Task>) => {
    createSubtask(parentId, subtaskData);
  };

  const handleCloseDecomposition = () => {
    setDecomposingTask(undefined);
  };

  const taskCounts = {
    doableNow: doableTasks.length,
    total: tasks.filter(t => t.status === 'active').length,
    completed: completedTasks.length,
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <div className="text-lg text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  // ログインしていない場合
  if (!isLoggedIn) {
    return <SimpleLogin onLogin={login} adhdMode={adhdMode} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* ウェルカムメッセージ */}
      <Card className={cn(
        'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200',
        adhdMode && 'adhd-card'
      )}>
        <CardContent className={adhdMode ? 'p-8' : 'p-6'}>
          <div className="text-center">
            <h2 className={cn(
              'font-bold text-gray-900 mb-2',
              adhdMode ? 'text-2xl' : 'text-xl'
            )}>
              🌅 おかえりなさい！
            </h2>
            <p className={cn(
              'text-gray-600',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              今日も一歩ずつ、あなたのペースで進んでいきましょう
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 今日のハイライト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={cn(
          'bg-green-50 border-green-200',
          adhdMode && 'adhd-card'
        )}>
          <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
            <div className="text-center">
              <span className={adhdMode ? 'text-4xl' : 'text-3xl'}>⚡</span>
              <h3 className={cn(
                'font-semibold text-gray-900 mt-2',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                今すぐできる
              </h3>
              <div className={cn(
                'text-2xl font-bold text-green-600',
                adhdMode && 'text-3xl'
              )}>
                {doableTasks.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          'bg-blue-50 border-blue-200',
          adhdMode && 'adhd-card'
        )}>
          <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
            <div className="text-center">
              <span className={adhdMode ? 'text-4xl' : 'text-3xl'}>📅</span>
              <h3 className={cn(
                'font-semibold text-gray-900 mt-2',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                今日のタスク
              </h3>
              <div className={cn(
                'text-2xl font-bold text-blue-600',
                adhdMode && 'text-3xl'
              )}>
                {todaysTasks.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          'bg-purple-50 border-purple-200',
          adhdMode && 'adhd-card'
        )}>
          <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
            <div className="text-center">
              <span className={adhdMode ? 'text-4xl' : 'text-3xl'}>🎉</span>
              <h3 className={cn(
                'font-semibold text-gray-900 mt-2',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                完了済み
              </h3>
              <div className={cn(
                'text-2xl font-bold text-purple-600',
                adhdMode && 'text-3xl'
              )}>
                {completedTasks.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今すぐできるタスクのプレビュー */}
      {doableTasks.length > 0 && (
        <Card className={adhdMode ? 'adhd-card' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                'flex items-center gap-2',
                adhdMode ? 'text-xl' : 'text-lg'
              )}>
                ⚡ 今すぐできるタスク
              </CardTitle>
              <Button
                variant="primary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={() => setActiveView('doable-now')}
              >
                すべて見る
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doableTasks.slice(0, 3).map(task => {
                const taskWithSubtasks = tasksWithSubtasks.find(t => t.id === task.id);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subtasks={taskWithSubtasks?.subtasks || []}
                    onComplete={completeTask}
                    onEdit={handleEditTask}
                    onDelete={deleteTask}
                    onDecompose={handleDecomposeTask}
                    adhdMode={adhdMode}
                  />
                );
              })}
              {doableTasks.length > 3 && (
                <div className="text-center py-4">
                  <p className={cn(
                    'text-gray-600',
                    adhdMode ? 'text-base' : 'text-sm'
                  )}>
                    他 {doableTasks.length - 3} 件のタスクがあります
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        taskCounts={taskCounts}
        adhdMode={adhdMode}
        onToggleAdhdMode={() => setAdhdMode(!adhdMode)}
        user={user}
        onLogout={logout}
      />

      {/* メインコンテンツ */}
      <div className={cn(
        'flex-1',
        'lg:pl-80'
      )}>
        <div className={cn(
          'px-4 py-6',
          adhdMode ? 'px-6 py-8' : 'px-4 py-6'
        )}>
          {/* クイックキャプチャ - どのビューでも表示 */}
          <QuickCapture
            onCapture={handleQuickCapture}
            adhdMode={adhdMode}
          />

          {/* 新しいタスク作成ボタン */}
          <div className="mb-6">
            <Button
              variant="primary"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={() => setShowTaskForm(true)}
              className="w-full sm:w-auto"
            >
              ✨ 新しいタスクを作成
            </Button>
          </div>

          {/* ビュー別コンテンツ */}
          {activeView === 'dashboard' && renderDashboard()}
          
          {activeView === 'doable-now' && (
            <DoableNowPanel
              doableTasks={doableTasks}
              userState={userState}
              onUpdateUserState={updateUserState}
              onCompleteTask={completeTask}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              adhdMode={adhdMode}
            />
          )}
          
          {activeView === 'gtd-lists' && (
            <GTDLists
              tasks={tasksWithSubtasks}
              onCompleteTask={completeTask}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onDecomposeTask={handleDecomposeTask}
              adhdMode={adhdMode}
            />
          )}
          
          {activeView === 'completed' && (
            <CompletedTasks
              completedTasks={completedTasks}
              onUncompleteTask={uncompleteTask}
              onDeleteTask={deleteTask}
              adhdMode={adhdMode}
            />
          )}
          
          {activeView === 'progress' && (
            <ProgressPanel
              tasks={tasks}
              completedTasks={completedTasks}
              adhdMode={adhdMode}
            />
          )}
        </div>
      </div>

      {/* タスクフォームモーダル */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseTaskForm}
          adhdMode={adhdMode}
        />
      )}

      {/* タスク分解モーダル */}
      {decomposingTask && (
        <TaskDecomposition
          task={decomposingTask}
          onCreateSubtask={handleCreateSubtask}
          onUpdateTask={updateTask}
          onClose={handleCloseDecomposition}
          adhdMode={adhdMode}
        />
      )}
    </div>
  );
}