import React, { useState } from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn, getDifficultyLabel, formatTime } from '@/lib/utils';

interface CompletedTasksProps {
  completedTasks: Task[];
  onUncompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  adhdMode?: boolean;
}

interface CompletedTaskCardProps {
  task: Task;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  adhdMode?: boolean;
}

function CompletedTaskCard({ 
  task, 
  onUncomplete, 
  onDelete, 
  adhdMode = false 
}: CompletedTaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  
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

  const getCompletedTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else {
      return `${diffDays}日前`;
    }
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer opacity-75 hover:opacity-100',
        'bg-green-50 border-green-200',
        adhdMode && 'adhd-card'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-lg">✅</span>
              <Badge className={levelInfo.color} size={adhdMode ? 'md' : 'sm'}>
                {levelInfo.icon} {levelInfo.label}
              </Badge>
              <Badge variant="success" size={adhdMode ? 'md' : 'sm'}>
                完了済み
              </Badge>
            </div>
            <h3 className={cn(
              'font-semibold text-gray-700 line-through',
              adhdMode ? 'text-lg' : 'text-base'
            )}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Badge 
              variant={difficultyVariant}
              size={adhdMode ? 'lg' : 'md'}
              className="opacity-60"
            >
              {getDifficultyLabel(task.difficulty)}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className={cn(
            'text-gray-500 mb-3 line-clamp-2 line-through',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {task.estimatedTime && (
            <Badge variant="secondary" size={adhdMode ? 'md' : 'sm'} className="opacity-60">
              ⏱️ {formatTime(task.estimatedTime)}
            </Badge>
          )}
          
          <Badge variant="secondary" size={adhdMode ? 'md' : 'sm'} className="opacity-60">
            🔋 {task.energyLevel === 'low' ? '低' : task.energyLevel === 'medium' ? '中' : '高'}
          </Badge>

          <Badge variant="secondary" size={adhdMode ? 'md' : 'sm'} className="opacity-60">
            ⏰ {getCompletedTimeAgo(task.updatedAt)}完了
          </Badge>
        </div>

        {showActions && (
          <div className={cn(
            'flex gap-2',
            adhdMode ? 'flex-col sm:flex-row' : 'flex-row'
          )}>
            <Button
              variant="warning"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={(e) => {
                e.stopPropagation();
                onUncomplete(task.id);
              }}
              className="flex-1"
            >
              ↩️ 完了取り消し
            </Button>
            
            <Button
              variant="danger"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('このタスクを完全に削除しますか？')) {
                  onDelete(task.id);
                }
              }}
              className={adhdMode ? '' : 'px-3'}
            >
              🗑️ 削除
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CompletedTasks({ 
  completedTasks, 
  onUncompleteTask, 
  onDeleteTask, 
  adhdMode = false 
}: CompletedTasksProps) {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'difficulty'>('recent');

  const getFilteredTasks = () => {
    const now = new Date();
    let filtered = completedTasks;

    // 期間フィルター
    switch (filterPeriod) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = completedTasks.filter(task => task.updatedAt >= today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = completedTasks.filter(task => task.updatedAt >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = completedTasks.filter(task => task.updatedAt >= monthAgo);
        break;
      default:
        filtered = completedTasks;
    }

    // ソート
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
        break;
      case 'difficulty':
        filtered.sort((a, b) => b.difficulty - a.difficulty);
        break;
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const getFilterCounts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      today: completedTasks.filter(task => task.updatedAt >= today).length,
      week: completedTasks.filter(task => task.updatedAt >= weekAgo).length,
      month: completedTasks.filter(task => task.updatedAt >= monthAgo).length,
      all: completedTasks.length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            'font-bold text-gray-900 mb-2',
            adhdMode ? 'text-2xl' : 'text-xl'
          )}>
            ✅ 完了したタスク
          </h2>
          <p className={cn(
            'text-gray-600',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            頑張った成果を振り返りましょう！
          </p>
        </div>
        
        <Badge variant="success" size={adhdMode ? 'lg' : 'md'}>
          {filteredTasks.length} 件
        </Badge>
      </div>

      {/* フィルター・ソート */}
      <Card className={cn(
        'bg-blue-50 border-blue-200',
        adhdMode && 'adhd-card'
      )}>
        <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
          <div className="space-y-4">
            <div>
              <label className={cn(
                'block font-medium text-gray-700 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                📅 期間で絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'today', label: `今日 (${filterCounts.today})` },
                  { key: 'week', label: `今週 (${filterCounts.week})` },
                  { key: 'month', label: `今月 (${filterCounts.month})` },
                  { key: 'all', label: `全て (${filterCounts.all})` },
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={filterPeriod === option.key ? 'primary' : 'secondary'}
                    size={adhdMode ? 'lg' : 'md'}
                    adhdMode={adhdMode}
                    onClick={() => setFilterPeriod(option.key as typeof filterPeriod)}
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
                🔄 並び順
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'recent', label: '新しい順' },
                  { key: 'oldest', label: '古い順' },
                  { key: 'difficulty', label: '難易度順' },
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? 'primary' : 'secondary'}
                    size={adhdMode ? 'lg' : 'md'}
                    adhdMode={adhdMode}
                    onClick={() => setSortBy(option.key as typeof sortBy)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ADHD応援メッセージ */}
      {adhdMode && filteredTasks.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <p className="text-green-800 text-base font-medium">
              🎉 <strong>素晴らしい成果です！</strong>
            </p>
            <p className="text-green-700 text-sm mt-1">
              {filteredTasks.length}個のタスクを完了しました。一つ一つの小さな積み重ねが大きな成果につながります。
              間違って完了にしてしまったタスクがあれば、カードをホバーして「完了取り消し」で元に戻せます。
            </p>
          </CardContent>
        </Card>
      )}

      {/* 完了タスク一覧 */}
      {filteredTasks.length === 0 ? (
        <Card className={cn(
          'text-center py-12',
          adhdMode && 'adhd-card'
        )}>
          <CardContent>
            <span className="text-6xl mb-4 block">🎯</span>
            <h3 className={cn(
              'font-semibold text-gray-700 mb-2',
              adhdMode ? 'text-lg' : 'text-base'
            )}>
              {filterPeriod === 'all' ? 'まだ完了したタスクがありません' : '該当する期間に完了したタスクがありません'}
            </h3>
            <p className={cn(
              'text-gray-500',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              タスクを完了すると、ここに成果が蓄積されていきます
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <CompletedTaskCard
              key={task.id}
              task={task}
              onUncomplete={onUncompleteTask}
              onDelete={onDeleteTask}
              adhdMode={adhdMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}