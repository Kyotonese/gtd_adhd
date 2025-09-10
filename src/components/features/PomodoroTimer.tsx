'use client';

import React, { useState } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  taskId?: string;
  taskTitle?: string;
  adhdMode?: boolean;
  className?: string;
}

export function PomodoroTimer({ 
  taskId, 
  taskTitle, 
  adhdMode = false,
  className 
}: PomodoroTimerProps) {
  const {
    isRunning,
    timeLeft,
    currentSession,
    settings,
    stats,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formatTime,
    getCurrentSessionType,
    updateSettings,
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const sessionType = getCurrentSessionType();
  const progress = currentSession 
    ? ((currentSession.duration * 60 - timeLeft) / (currentSession.duration * 60)) * 100
    : 0;

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'work': return '作業時間';
      case 'short_break': return '短い休憩';
      case 'long_break': return '長い休憩';
      default: return '作業時間';
    }
  };

  const getSessionTypeEmoji = (type: string) => {
    switch (type) {
      case 'work': return '🍅';
      case 'short_break': return '☕';
      case 'long_break': return '🌟';
      default: return '🍅';
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-red-50 border-red-200 text-red-800';
      case 'short_break': return 'bg-green-50 border-green-200 text-green-800';
      case 'long_break': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setShowSettings(false);
  };

  const handleCancelSettings = () => {
    setTempSettings(settings);
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', adhdMode && 'adhd-card', className)}>
        <CardHeader>
          <CardTitle className={cn('text-center', adhdMode ? 'text-xl' : 'text-lg')}>
            ⚙️ ポモドーロ設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={cn('block font-medium mb-2', adhdMode ? 'text-base' : 'text-sm')}>
              作業時間（分）
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.workDuration}
              onChange={(e) => setTempSettings(prev => ({ 
                ...prev, 
                workDuration: parseInt(e.target.value) || 25 
              }))}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                adhdMode && 'text-lg p-3'
              )}
            />
          </div>

          <div>
            <label className={cn('block font-medium mb-2', adhdMode ? 'text-base' : 'text-sm')}>
              短い休憩（分）
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={tempSettings.shortBreakDuration}
              onChange={(e) => setTempSettings(prev => ({ 
                ...prev, 
                shortBreakDuration: parseInt(e.target.value) || 5 
              }))}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                adhdMode && 'text-lg p-3'
              )}
            />
          </div>

          <div>
            <label className={cn('block font-medium mb-2', adhdMode ? 'text-base' : 'text-sm')}>
              長い休憩（分）
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={tempSettings.longBreakDuration}
              onChange={(e) => setTempSettings(prev => ({ 
                ...prev, 
                longBreakDuration: parseInt(e.target.value) || 15 
              }))}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                adhdMode && 'text-lg p-3'
              )}
            />
          </div>

          <div>
            <label className={cn('block font-medium mb-2', adhdMode ? 'text-base' : 'text-sm')}>
              長い休憩まのセッション数
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={tempSettings.sessionsUntilLongBreak}
              onChange={(e) => setTempSettings(prev => ({ 
                ...prev, 
                sessionsUntilLongBreak: parseInt(e.target.value) || 4 
              }))}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                adhdMode && 'text-lg p-3'
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={tempSettings.playSound}
                onChange={(e) => setTempSettings(prev => ({ 
                  ...prev, 
                  playSound: e.target.checked 
                }))}
                className="rounded"
              />
              <span className={adhdMode ? 'text-base' : 'text-sm'}>音で通知</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              className="flex-1"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
            >
              保存
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancelSettings}
              className="flex-1"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
            >
              キャンセル
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', adhdMode && 'adhd-card', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('text-center flex-1', adhdMode ? 'text-xl' : 'text-lg')}>
            {getSessionTypeEmoji(sessionType)} ポモドーロタイマー
          </CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="ml-2"
          >
            ⚙️
          </Button>
        </div>
        
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className={cn(
              getSessionTypeColor(sessionType),
              adhdMode ? 'text-base px-4 py-2' : 'text-sm'
            )}
          >
            {getSessionTypeLabel(sessionType)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* タイマー表示 */}
        <div className="text-center">
          <div className={cn(
            'font-mono font-bold text-gray-900',
            adhdMode ? 'text-6xl' : 'text-4xl'
          )}>
            {formatTime(timeLeft)}
          </div>
          
          {/* 進捗バー */}
          <div className={cn('w-full bg-gray-200 rounded-full mt-4', adhdMode ? 'h-4' : 'h-2')}>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                sessionType === 'work' ? 'bg-red-500' :
                sessionType === 'short_break' ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 現在のタスク */}
        {taskTitle && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className={cn('text-gray-600 mb-1', adhdMode ? 'text-base' : 'text-sm')}>
              作業中のタスク
            </p>
            <p className={cn('font-medium text-gray-900', adhdMode ? 'text-lg' : 'text-base')}>
              {taskTitle}
            </p>
          </div>
        )}

        {/* コントロールボタン */}
        <div className="grid grid-cols-2 gap-3">
          {!isRunning ? (
            <Button
              variant="primary"
              size={adhdMode ? 'lg' : 'md'}
              onClick={() => startTimer(taskId, taskTitle)}
              className="col-span-2"
              adhdMode={adhdMode}
            >
              {currentSession ? '▶️ 再開' : '▶️ 開始'}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size={adhdMode ? 'lg' : 'md'}
                onClick={pauseTimer}
                adhdMode={adhdMode}
              >
                ⏸️ 一時停止
              </Button>
              <Button
                variant="danger"
                size={adhdMode ? 'lg' : 'md'}
                onClick={stopTimer}
                adhdMode={adhdMode}
              >
                ⏹️ 停止
              </Button>
            </>
          )}
        </div>

        {/* セッション切り替えボタン */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={sessionType === 'work' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => resetTimer('work')}
            disabled={isRunning}
            className={adhdMode ? 'py-2' : 'py-1'}
          >
            🍅 作業
          </Button>
          <Button
            variant={sessionType === 'short_break' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => resetTimer('short_break')}
            disabled={isRunning}
            className={adhdMode ? 'py-2' : 'py-1'}
          >
            ☕ 短休憩
          </Button>
          <Button
            variant={sessionType === 'long_break' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => resetTimer('long_break')}
            disabled={isRunning}
            className={adhdMode ? 'py-2' : 'py-1'}
          >
            🌟 長休憩
          </Button>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className={cn('text-2xl font-bold text-red-600', adhdMode && 'text-3xl')}>
              {stats.todaysSessions}
            </p>
            <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
              今日のセッション
            </p>
          </div>
          <div className="text-center">
            <p className={cn('text-2xl font-bold text-blue-600', adhdMode && 'text-3xl')}>
              {stats.todaysFocusTime}
            </p>
            <p className={cn('text-gray-600', adhdMode ? 'text-base' : 'text-sm')}>
              集中時間（分）
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}