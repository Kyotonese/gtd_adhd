'use client';

import React, { useState } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PomodoroStatsProps {
  adhdMode?: boolean;
  className?: string;
}

export function PomodoroStats({ adhdMode = false, className }: PomodoroStatsProps) {
  const { sessions, stats } = usePomodoro();
  const [view, setView] = useState<'stats' | 'history'>('stats');

  // 過去7日間のデータを生成
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const getDayStats = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const daySessions = sessions.filter(s => 
      s.startTime >= dayStart && 
      s.startTime < dayEnd &&
      s.completed
    );

    const workSessions = daySessions.filter(s => s.type === 'work');
    const focusTime = workSessions.reduce((total, s) => total + s.duration, 0);

    return {
      sessions: daySessions.length,
      workSessions: workSessions.length,
      focusTime,
    };
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今日';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨日';
    }
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'work': return '作業';
      case 'short_break': return '短い休憩';
      case 'long_break': return '長い休憩';
      default: return type;
    }
  };

  const getSessionTypeEmoji = (type: string) => {
    switch (type) {
      case 'work': return '🍅';
      case 'short_break': return '☕';
      case 'long_break': return '🌟';
      default: return '📝';
    }
  };

  const recentSessions = sessions
    .filter(s => s.completed)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 10);

  return (
    <Card className={cn('w-full', adhdMode && 'adhd-card', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('flex items-center gap-2', adhdMode ? 'text-xl' : 'text-lg')}>
            📊 ポモドーロ統計
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={view === 'stats' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('stats')}
            >
              統計
            </Button>
            <Button
              variant={view === 'history' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('history')}
            >
              履歴
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {view === 'stats' ? (
          <div className="space-y-6">
            {/* 今日の統計 */}
            <div>
              <h3 className={cn('font-semibold mb-3', adhdMode ? 'text-lg' : 'text-base')}>
                今日の実績
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className={cn('text-2xl font-bold text-red-600', adhdMode && 'text-3xl')}>
                    {stats.todaysSessions}
                  </p>
                  <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
                    総セッション
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className={cn('text-2xl font-bold text-blue-600', adhdMode && 'text-3xl')}>
                    {stats.todaysFocusTime}
                  </p>
                  <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
                    集中時間（分）
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className={cn('text-2xl font-bold text-green-600', adhdMode && 'text-3xl')}>
                    {Math.round((stats.completedSessions / Math.max(stats.totalSessions, 1)) * 100)}%
                  </p>
                  <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
                    完了率
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className={cn('text-2xl font-bold text-purple-600', adhdMode && 'text-3xl')}>
                    {stats.currentStreak}
                  </p>
                  <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
                    連続日数
                  </p>
                </div>
              </div>
            </div>

            {/* 全体の統計 */}
            <div>
              <h3 className={cn('font-semibold mb-3', adhdMode ? 'text-lg' : 'text-base')}>
                全体の実績
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={cn('text-3xl font-bold text-gray-800', adhdMode && 'text-4xl')}>
                    {stats.totalSessions}
                  </p>
                  <p className={cn('text-gray-600 mt-1', adhdMode ? 'text-base' : 'text-sm')}>
                    総セッション数
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={cn('text-3xl font-bold text-gray-800', adhdMode && 'text-4xl')}>
                    {formatDuration(stats.totalFocusTime)}
                  </p>
                  <p className={cn('text-gray-600 mt-1', adhdMode ? 'text-base' : 'text-sm')}>
                    総集中時間
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={cn('text-3xl font-bold text-gray-800', adhdMode && 'text-4xl')}>
                    {stats.completedSessions}
                  </p>
                  <p className={cn('text-gray-600 mt-1', adhdMode ? 'text-base' : 'text-sm')}>
                    完了セッション
                  </p>
                </div>
              </div>
            </div>

            {/* 過去7日間の傾向 */}
            <div>
              <h3 className={cn('font-semibold mb-3', adhdMode ? 'text-lg' : 'text-base')}>
                過去7日間の傾向
              </h3>
              <div className="space-y-2">
                {last7Days.map((date, index) => {
                  const dayStats = getDayStats(date);
                  const maxSessions = Math.max(...last7Days.map(d => getDayStats(d).sessions), 1);
                  const barWidth = (dayStats.sessions / maxSessions) * 100;

                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={cn('w-12 text-right', adhdMode ? 'text-base' : 'text-sm')}>
                        {formatDate(date)}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {dayStats.sessions > 0 && (
                            <span className="text-white text-xs font-medium">
                              {dayStats.sessions}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={cn('w-16 text-left text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
                        {dayStats.focusTime}分
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className={cn('font-semibold', adhdMode ? 'text-lg' : 'text-base')}>
              最近の完了セッション
            </h3>
            
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className={adhdMode ? 'text-lg' : 'text-base'}>
                  まだ完了したセッションがありません
                </p>
                <p className={adhdMode ? 'text-base' : 'text-sm'}>
                  ポモドーロタイマーを使って作業を始めましょう！
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={cn(
                      'flex items-center justify-between p-3 bg-gray-50 rounded-lg',
                      adhdMode && 'p-4'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={adhdMode ? 'text-2xl' : 'text-xl'}>
                        {getSessionTypeEmoji(session.type)}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              session.type === 'work' ? 'bg-red-100 text-red-800' :
                              session.type === 'short_break' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800',
                              adhdMode ? 'text-base px-3 py-1' : 'text-sm'
                            )}
                          >
                            {getSessionTypeLabel(session.type)}
                          </Badge>
                          {session.taskTitle && (
                            <span className={cn(
                              'text-gray-600',
                              adhdMode ? 'text-base' : 'text-sm'
                            )}>
                              - {session.taskTitle}
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          'text-gray-500',
                          adhdMode ? 'text-base' : 'text-sm'
                        )}>
                          {session.startTime.toLocaleString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'font-medium',
                        adhdMode ? 'text-lg' : 'text-base'
                      )}>
                        {session.duration}分
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}