import React from 'react';
import { Task, UserState } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface DoableNowPanelProps {
  doableTasks: Task[];
  userState: UserState;
  onUpdateUserState: (updates: Partial<UserState>) => void;
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  adhdMode?: boolean;
}

export function DoableNowPanel({
  doableTasks,
  userState,
  onUpdateUserState,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  adhdMode = false,
}: DoableNowPanelProps) {
  const updateMood = (mood: 'low' | 'medium' | 'high') => {
    onUpdateUserState({ currentMood: mood });
  };

  const updateEnergyLevel = (energy: 'low' | 'medium' | 'high') => {
    onUpdateUserState({ currentEnergyLevel: energy });
  };

  const updateAvailableTime = (time: number) => {
    onUpdateUserState({ availableTime: time });
  };

  const timeOptions = [
    { value: 15, label: '15分' },
    { value: 30, label: '30分' },
    { value: 60, label: '1時間' },
    { value: 120, label: '2時間' },
    { value: 240, label: '4時間' },
  ];

  return (
    <div className="space-y-6">
      {/* ユーザー状態設定 */}
      <Card className={cn(
        'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200',
        adhdMode && 'adhd-card'
      )}>
        <CardHeader>
          <CardTitle className={cn(
            'flex items-center gap-2',
            adhdMode ? 'text-xl' : 'text-lg'
          )}>
            🎯 今の状態を教えてください
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={cn(
              'block font-medium text-gray-700 mb-2',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              気分・モチベーション
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'low', label: '😔 低い', color: 'bg-red-100 text-red-800' },
                { value: 'medium', label: '😊 普通', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'high', label: '😄 高い', color: 'bg-green-100 text-green-800' },
              ].map(option => (
                <Button
                  key={option.value}
                  variant={userState.currentMood === option.value ? 'primary' : 'secondary'}
                  size={adhdMode ? 'lg' : 'md'}
                  adhdMode={adhdMode}
                  onClick={() => updateMood(option.value as 'low' | 'medium' | 'high')}
                  className={cn(
                    'transition-all duration-200',
                    userState.currentMood === option.value && 'ring-2 ring-primary-500'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className={cn(
              'block font-medium text-gray-700 mb-2',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              エネルギーレベル
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'low', label: '🔋 低', color: 'bg-gray-100 text-gray-800' },
                { value: 'medium', label: '🔋🔋 中', color: 'bg-blue-100 text-blue-800' },
                { value: 'high', label: '🔋🔋🔋 高', color: 'bg-green-100 text-green-800' },
              ].map(option => (
                <Button
                  key={option.value}
                  variant={userState.currentEnergyLevel === option.value ? 'primary' : 'secondary'}
                  size={adhdMode ? 'lg' : 'md'}
                  adhdMode={adhdMode}
                  onClick={() => updateEnergyLevel(option.value as 'low' | 'medium' | 'high')}
                  className={cn(
                    'transition-all duration-200',
                    userState.currentEnergyLevel === option.value && 'ring-2 ring-primary-500'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className={cn(
              'block font-medium text-gray-700 mb-2',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              使える時間
            </label>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map(option => (
                <Button
                  key={option.value}
                  variant={userState.availableTime === option.value ? 'primary' : 'secondary'}
                  size={adhdMode ? 'lg' : 'md'}
                  adhdMode={adhdMode}
                  onClick={() => updateAvailableTime(option.value)}
                  className={cn(
                    'transition-all duration-200',
                    userState.availableTime === option.value && 'ring-2 ring-primary-500'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 今すぐできるタスク */}
      <Card className={cn(
        'bg-gradient-to-r from-green-50 to-blue-50 border-green-200',
        adhdMode && 'adhd-card'
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={cn(
              'flex items-center gap-2',
              adhdMode ? 'text-xl' : 'text-lg'
            )}>
              ✨ 今すぐできるタスク
            </CardTitle>
            <Badge 
              variant="success"
              size={adhdMode ? 'lg' : 'md'}
            >
              {doableTasks.length} 件
            </Badge>
          </div>
          <p className={cn(
            'text-gray-600 mt-2',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            あなたの現在の状態で実行可能なタスクです
          </p>
        </CardHeader>
        <CardContent>
          {doableTasks.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-4">🎉</span>
              <h3 className={cn(
                'font-semibold text-gray-700 mb-2',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                素晴らしい！
              </h3>
              <p className={cn(
                'text-gray-500',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                現在の状態で実行できるタスクがありません。<br />
                新しいタスクを追加するか、状態を変更してみてください。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adhdMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    💡 <strong>ADHD応援メッセージ:</strong>
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    完璧である必要はありません。小さな一歩から始めましょう！
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {doableTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onCompleteTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    adhdMode={adhdMode}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}