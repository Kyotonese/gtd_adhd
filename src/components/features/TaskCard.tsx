import React, { useState } from 'react';
import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getDifficultyLabel, formatTime, cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDecompose?: (task: Task) => void;
  subtasks?: Task[];
  adhdMode?: boolean;
}

export function TaskCard({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete, 
  onDecompose,
  subtasks = [],
  adhdMode = false 
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyVariant = `difficulty-${task.difficulty}` as const;
  
  const getLevelInfo = (level: string) => {
    const info = {
      large: { label: '大タスク', color: 'bg-red-100 text-red-800', icon: '🏔️' },
      medium: { label: '中タスク', color: 'bg-yellow-100 text-yellow-800', icon: '⛰️' },
      small: { label: '小タスク', color: 'bg-green-100 text-green-800', icon: '🏃' },
    };
    return info[level as keyof typeof info] || info.medium;
  };

  const levelInfo = getLevelInfo(task.level);
  const completedSubtasks = subtasks.filter(st => st.status === 'completed').length;
  const totalSubtasks = subtasks.length;
  
  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer hover:shadow-md',
        adhdMode && 'adhd-card',
        `task-difficulty-${task.difficulty}`
      )}
      adhdMode={adhdMode}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={levelInfo.color} size={adhdMode ? 'md' : 'sm'}>
                {levelInfo.icon} {levelInfo.label}
              </Badge>
              {totalSubtasks > 0 && (
                <Badge variant="secondary" size={adhdMode ? 'md' : 'sm'}>
                  📝 {completedSubtasks}/{totalSubtasks}
                </Badge>
              )}
            </div>
            <h3 className={cn(
              'font-semibold text-gray-900 line-clamp-2',
              adhdMode ? 'text-lg' : 'text-base'
            )}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Badge 
              variant={difficultyVariant}
              size={adhdMode ? 'lg' : 'md'}
            >
              {getDifficultyLabel(task.difficulty)}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className={cn(
            'text-gray-600 mb-3 line-clamp-2',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {task.estimatedTime && (
            <Badge variant="secondary" size={adhdMode ? 'md' : 'sm'}>
              ⏱️ {formatTime(task.estimatedTime)}
            </Badge>
          )}
          
          <Badge 
            variant={task.energyLevel === 'high' ? 'warning' : 'secondary'}
            size={adhdMode ? 'md' : 'sm'}
          >
            🔋 {task.energyLevel === 'low' ? '低' : task.energyLevel === 'medium' ? '中' : '高'}
          </Badge>

          {task.context && task.context.map(ctx => (
            <Badge key={ctx} variant="secondary" size={adhdMode ? 'md' : 'sm'}>
              📍 {ctx}
            </Badge>
          ))}
        </div>

        {/* サブタスク進捗バー */}
        {totalSubtasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'text-gray-600 font-medium',
                adhdMode ? 'text-sm' : 'text-xs'
              )}>
                サブタスク進捗
              </span>
              <span className={cn(
                'text-gray-500',
                adhdMode ? 'text-sm' : 'text-xs'
              )}>
                {Math.round((completedSubtasks / totalSubtasks) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>
            
            {/* サブタスク表示切り替え */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 p-1"
            >
              {isExpanded ? '▼ サブタスクを隠す' : '▶ サブタスクを表示'}
            </Button>
            
            {/* サブタスクリスト */}
            {isExpanded && (
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className={cn(
                    'flex items-center gap-2 p-2 rounded border',
                    subtask.status === 'completed' 
                      ? 'bg-green-50 border-green-200 line-through text-green-700'
                      : 'bg-gray-50 border-gray-200'
                  )}>
                    <span className={adhdMode ? 'text-sm' : 'text-xs'}>
                      {subtask.status === 'completed' ? '✅' : '⭕'}
                    </span>
                    <span className={cn(
                      'flex-1',
                      adhdMode ? 'text-sm' : 'text-xs'
                    )}>
                      {subtask.title}
                    </span>
                    <Badge className={getLevelInfo(subtask.level).color} size="sm">
                      {getLevelInfo(subtask.level).icon}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={cn(
          'flex gap-2',
          adhdMode ? 'flex-col sm:flex-row' : 'flex-row'
        )}>
          <Button
            variant="success"
            size={adhdMode ? 'lg' : 'md'}
            adhdMode={adhdMode}
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            className="flex-1"
          >
            ✅ 完了
          </Button>
          
          {/* タスク分解ボタン */}
          {onDecompose && (task.level === 'large' || task.level === 'medium') && !task.isDecomposed && (
            <Button
              variant="warning"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={(e) => {
                e.stopPropagation();
                onDecompose(task);
              }}
              className={adhdMode ? '' : 'px-3'}
            >
              🔨 分解
            </Button>
          )}
          
          <Button
            variant="secondary"
            size={adhdMode ? 'lg' : 'md'}
            adhdMode={adhdMode}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className={adhdMode ? '' : 'px-3'}
          >
            ✏️ 編集
          </Button>
          
          {isHovered && (
            <Button
              variant="danger"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className={adhdMode ? '' : 'px-3'}
            >
              🗑️ 削除
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}