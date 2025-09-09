import React from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ProgressPanelProps {
  tasks: Task[];
  completedTasks: Task[];
  adhdMode?: boolean;
}

export function ProgressPanel({ 
  tasks, 
  completedTasks, 
  adhdMode = false 
}: ProgressPanelProps) {
  const activeTasks = tasks.filter(task => task.status === 'active');
  const totalTasks = activeTasks.length + completedTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const getCompletedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return completedTasks.filter(task => {
      const completedDate = task.updatedAt;
      return completedDate >= today && completedDate < tomorrow;
    });
  };

  const completedToday = getCompletedToday();
  
  const getCompletedThisWeek = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return completedTasks.filter(task => task.updatedAt >= oneWeekAgo);
  };

  const completedThisWeek = getCompletedThisWeek();

  const getDifficultyStats = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    completedTasks.forEach(task => {
      stats[task.difficulty]++;
    });
    return stats;
  };

  const difficultyStats = getDifficultyStats();

  return (
    <div className="space-y-6">
      <Card className={cn(
        'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200',
        adhdMode && 'adhd-card'
      )}>
        <CardHeader>
          <CardTitle className={cn(
            'flex items-center gap-2',
            adhdMode ? 'text-xl' : 'text-lg'
          )}>
            📊 進捗状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={cn(
                'text-3xl font-bold text-blue-600 mb-1',
                adhdMode && 'text-4xl'
              )}>
                {completedToday.length}
              </div>
              <div className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                今日完了
              </div>
            </div>
            
            <div className="text-center">
              <div className={cn(
                'text-3xl font-bold text-green-600 mb-1',
                adhdMode && 'text-4xl'
              )}>
                {completedThisWeek.length}
              </div>
              <div className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                今週完了
              </div>
            </div>
            
            <div className="text-center">
              <div className={cn(
                'text-3xl font-bold text-purple-600 mb-1',
                adhdMode && 'text-4xl'
              )}>
                {Math.round(completionRate)}%
              </div>
              <div className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                完了率
              </div>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={cn(
                'font-medium text-gray-700',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                全体の進捗
              </span>
              <span className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                {completedTasks.length} / {totalTasks}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* ADHD応援メッセージ */}
          {adhdMode && completedToday.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">
                🎉 <strong>素晴らしい！</strong>
              </p>
              <p className="text-green-700 text-sm mt-1">
                今日は{completedToday.length}個のタスクを完了しました。
                小さな成功の積み重ねが大きな成果につながります！
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 難易度別統計 */}
      <Card className={cn(
        adhdMode && 'adhd-card'
      )}>
        <CardHeader>
          <CardTitle className={cn(
            'flex items-center gap-2',
            adhdMode ? 'text-xl' : 'text-lg'
          )}>
            🏆 完了タスクの難易度分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: 1, label: '超簡単', color: 'bg-green-100 text-green-800', icon: '😊' },
              { level: 2, label: '簡単', color: 'bg-blue-100 text-blue-800', icon: '🙂' },
              { level: 3, label: '普通', color: 'bg-yellow-100 text-yellow-800', icon: '😐' },
              { level: 4, label: '難しい', color: 'bg-orange-100 text-orange-800', icon: '😅' },
              { level: 5, label: '超難しい', color: 'bg-red-100 text-red-800', icon: '😰' },
            ].map(({ level, label, color, icon }) => {
              const count = difficultyStats[level as keyof typeof difficultyStats];
              const percentage = completedTasks.length > 0 ? (count / completedTasks.length) * 100 : 0;
              
              return (
                <div key={level} className="flex items-center gap-3">
                  <Badge className={cn(color, 'min-w-[100px] justify-between')}>
                    <span>{icon} {label}</span>
                    <span className="ml-2">{count}</span>
                  </Badge>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-500',
                        level === 1 && 'bg-green-400',
                        level === 2 && 'bg-blue-400',
                        level === 3 && 'bg-yellow-400',
                        level === 4 && 'bg-orange-400',
                        level === 5 && 'bg-red-400',
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-gray-600 min-w-[50px] text-right',
                    adhdMode ? 'text-base' : 'text-sm'
                  )}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
          
          {adhdMode && completedTasks.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">
                💪 <strong>成長の記録:</strong>
              </p>
              <p className="text-blue-700 text-sm mt-1">
                これまでに {completedTasks.length} 個のタスクを完了しています。
                どんなに小さなことでも、あなたの努力は価値があります！
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}