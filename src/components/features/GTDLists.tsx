import React, { useState } from 'react';
import { Task, GTDCategory } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface GTDListsProps {
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDecomposeTask?: (task: Task) => void;
  onAddTask?: (category: GTDCategory) => void;
  onStartPomodoro?: (taskId: string, taskTitle: string) => void;
  adhdMode?: boolean;
}

interface GTDList {
  category: GTDCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const gtdLists: GTDList[] = [
  {
    category: 'capture',
    title: '収集',
    description: '頭に浮かんだすべてのことを記録',
    icon: '📥',
    color: 'bg-gray-50 border-gray-200',
  },
  {
    category: 'next_actions',
    title: '次にやること',
    description: '今すぐ実行可能なタスク',
    icon: '⚡',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    category: 'projects',
    title: 'プロジェクト',
    description: '複数のステップが必要な取り組み',
    icon: '📁',
    color: 'bg-green-50 border-green-200',
  },
  {
    category: 'waiting_for',
    title: '待機中',
    description: '他の人の行動を待っているもの',
    icon: '⏳',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    category: 'someday_maybe',
    title: 'いつかやる',
    description: '今すぐではないが将来やりたいこと',
    icon: '🌟',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    category: 'calendar',
    title: 'カレンダー',
    description: '特定の日時に行うこと',
    icon: '📅',
    color: 'bg-red-50 border-red-200',
  },
  {
    category: 'reference',
    title: '資料',
    description: '参考情報や資料',
    icon: '📚',
    color: 'bg-indigo-50 border-indigo-200',
  },
];

export function GTDLists({ 
  tasks, 
  onCompleteTask, 
  onEditTask, 
  onDeleteTask, 
  onDecomposeTask,
  onAddTask,
  onStartPomodoro,
  adhdMode = false 
}: GTDListsProps) {
  const [selectedCategory, setSelectedCategory] = useState<GTDCategory | null>(null);

  const getTasksByCategory = (category: GTDCategory) => {
    console.log(`Getting tasks for category ${category}:`, tasks.filter(task => task.category === category && task.status !== "completed"));
    return tasks.filter(task => task.category === category && task.status !== 'completed');
  };

  const renderListOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {gtdLists.map(list => {
        const listTasks = getTasksByCategory(list.category);
        const taskCount = listTasks.length;

        return (
          <Card
            key={list.category}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-md',
              list.color,
              adhdMode && 'adhd-card'
            )}
            onClick={() => setSelectedCategory(list.category)}
          >
            <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={adhdMode ? 'text-3xl' : 'text-2xl'}>
                    {list.icon}
                  </span>
                  <div>
                    <h3 className={cn(
                      'font-semibold text-gray-900',
                      adhdMode ? 'text-lg' : 'text-base'
                    )}>
                      {list.title}
                    </h3>
                    <p className={cn(
                      'text-gray-600',
                      adhdMode ? 'text-sm' : 'text-xs'
                    )}>
                      {list.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge 
                  variant={taskCount > 0 ? 'default' : 'secondary'}
                  size={adhdMode ? 'lg' : 'md'}
                >
                  {taskCount} 件
                </Badge>
                
                {taskCount > 0 && (
                  <Button
                    variant="ghost"
                    size={adhdMode ? 'lg' : 'sm'}
                    adhdMode={adhdMode}
                  >
                {onAddTask && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(list.category);
                    }}
                    className="mr-2"
                  >
                    ➕ 追加
                  </Button>
                )}
                    詳細を見る →
                  </Button>
                )}
              </div>

              {adhdMode && taskCount > 0 && (
                <div className="mt-4 space-y-1">
                  {listTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="text-sm text-gray-600 truncate">
                      • {task.title}
                    </div>
                  ))}
                  {taskCount > 3 && (
                    <div className="text-sm text-gray-500">
                      ... 他 {taskCount - 3} 件
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderCategoryDetail = (category: GTDCategory) => {
    const list = gtdLists.find(l => l.category === category)!;
    const listTasks = getTasksByCategory(category);

    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            size={adhdMode ? 'lg' : 'md'}
            adhdMode={adhdMode}
            onClick={() => setSelectedCategory(null)}
          >
            ← 戻る
          </Button>
          
          <div className="flex items-center gap-3">
            <span className={adhdMode ? 'text-3xl' : 'text-2xl'}>
              {list.icon}
            </span>
            <div>
              <h2 className={cn(
                'font-bold text-gray-900',
                adhdMode ? 'text-2xl' : 'text-xl'
              )}>
                {list.title}
              </h2>
              <p className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                {list.description}
              </p>
            </div>
          </div>
          
          <Badge 
            variant="default"
            size={adhdMode ? 'lg' : 'md'}
            className="ml-auto"
          {onAddTask && (
            <Button
              variant="primary"
              size={adhdMode ? "lg" : "md"}
              adhdMode={adhdMode}
              onClick={() => onAddTask(category)}
              className="ml-2"
            >
              ➕ タスクを追加
            </Button>
          )}
          >
            {listTasks.length} 件
          </Badge>
        </div>

        {listTasks.length === 0 ? (
          <Card className={cn(
            'text-center py-12',
            adhdMode && 'adhd-card'
          )}>
            <CardContent>
              <span className="text-6xl mb-4 block">✨</span>
              <h3 className={cn(
                'font-semibold text-gray-700 mb-2',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                まだタスクがありません
              </h3>
              <p className={cn(
                'text-gray-500',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                新しいタスクを追加すると、ここに表示されます
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {listTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                subtasks={task.subtasks || []}
                onComplete={onCompleteTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDecompose={onDecomposeTask}
                adhdMode={adhdMode}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {selectedCategory ? (
        renderCategoryDetail(selectedCategory)
      ) : (
        <>
          <div className="mb-6">
            <h2 className={cn(
              'font-bold text-gray-900 mb-2',
              adhdMode ? 'text-2xl' : 'text-xl'
            )}>
              📋 GTDリスト
            </h2>
            <p className={cn(
              'text-gray-600',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              タスクをGTDメソッドに従って分類・管理します
            </p>
          </div>
          {renderListOverview()}
        </>
      )}
    </div>
  );
}