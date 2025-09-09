import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { User } from '@/hooks/useAuth';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  taskCounts: {
    doableNow: number;
    total: number;
    completed: number;
  };
  adhdMode: boolean;
  onToggleAdhdMode: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: '🏠',
    description: 'メイン画面',
  },
  {
    id: 'doable-now',
    label: '今すぐできる',
    icon: '⚡',
    description: '実行可能なタスク',
  },
  {
    id: 'gtd-lists',
    label: 'GTDリスト',
    icon: '📋',
    description: 'タスクの分類管理',
  },
  {
    id: 'completed',
    label: '完了したタスク',
    icon: '✅',
    description: '完了済みタスクの管理',
  },
  {
    id: 'progress',
    label: '進捗・統計',
    icon: '📊',
    description: '達成状況の確認',
  },
];

export function Navigation({
  activeView,
  onViewChange,
  taskCounts,
  adhdMode,
  onToggleAdhdMode,
  user,
  onLogout,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* モバイル用ヘッダー */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className={cn(
            'font-bold text-gray-900',
            adhdMode ? 'text-xl' : 'text-lg'
          )}>
            🎯 GTD Task Manager
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant={adhdMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={onToggleAdhdMode}
              className="text-xs"
            >
              {adhdMode ? '🧠 ADHD' : '🧠'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </Button>
          </div>
        </div>
      </div>

      {/* モバイル用メニュー */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map(item => (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'primary' : 'ghost'}
                size="md"
                onClick={() => {
                  onViewChange(item.id);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {item.id === 'doable-now' && taskCounts.doableNow > 0 && (
                  <Badge variant="success" size="sm" className="ml-auto">
                    {taskCounts.doableNow}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* デスクトップ用サイドバー */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          {/* ヘッダー */}
          <div className={cn(
            'px-6 py-6 border-b border-gray-200',
            adhdMode && 'py-8'
          )}>
            <div className="mb-4">
              <h1 className={cn(
                'font-bold text-gray-900',
                adhdMode ? 'text-2xl' : 'text-xl'
              )}>
                🎯 GTD Task Manager
              </h1>
              <p className={cn(
                'text-gray-600',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                ADHD対応タスク管理
              </p>
            </div>
            
            {/* ユーザー情報 */}
            {user && (
              <div className={cn(
                'flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200',
                adhdMode && 'p-4'
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className={cn(
                      'font-medium text-blue-900',
                      adhdMode ? 'text-sm' : 'text-xs'
                    )}>
                      {user.username}
                    </div>
                    <div className={cn(
                      'text-blue-600',
                      adhdMode ? 'text-xs' : 'text-xs'
                    )}>
                      ログイン中
                    </div>
                  </div>
                </div>
                
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ログアウト
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* ADHD モード切り替え */}
          <div className={cn(
            'px-6 py-4 border-b border-gray-200',
            adhdMode && 'py-6'
          )}>
            <Button
              variant={adhdMode ? 'primary' : 'secondary'}
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              onClick={onToggleAdhdMode}
              className="w-full"
            >
              <span className="mr-2">🧠</span>
              {adhdMode ? 'ADHDモード ON' : 'ADHDモード OFF'}
            </Button>
            
            {adhdMode && (
              <p className="text-xs text-gray-600 mt-2 text-center">
                大きなボタンと親しみやすいUIで使いやすく
              </p>
            )}
          </div>

          {/* 統計サマリー */}
          <div className={cn(
            'px-6 py-4 border-b border-gray-200',
            adhdMode && 'py-6'
          )}>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className={cn(
                  'text-2xl font-bold text-blue-600',
                  adhdMode && 'text-3xl'
                )}>
                  {taskCounts.doableNow}
                </div>
                <div className={cn(
                  'text-gray-600',
                  adhdMode ? 'text-sm' : 'text-xs'
                )}>
                  今すぐできる
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  'text-2xl font-bold text-green-600',
                  adhdMode && 'text-3xl'
                )}>
                  {taskCounts.completed}
                </div>
                <div className={cn(
                  'text-gray-600',
                  adhdMode ? 'text-sm' : 'text-xs'
                )}>
                  完了済み
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map(item => (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'primary' : 'ghost'}
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={() => onViewChange(item.id)}
                className="w-full justify-start group"
              >
                <span className={cn(
                  'mr-3',
                  adhdMode ? 'text-xl' : 'text-lg'
                )}>
                  {item.icon}
                </span>
                
                <div className="flex-1 text-left">
                  <div className={cn(
                    'font-medium',
                    adhdMode ? 'text-base' : 'text-sm'
                  )}>
                    {item.label}
                  </div>
                  {adhdMode && (
                    <div className="text-xs opacity-75">
                      {item.description}
                    </div>
                  )}
                </div>
                
                {item.id === 'doable-now' && taskCounts.doableNow > 0 && (
                  <Badge 
                    variant="success" 
                    size={adhdMode ? 'md' : 'sm'}
                    className="ml-2"
                  >
                    {taskCounts.doableNow}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* フッター */}
          <div className={cn(
            'px-6 py-4 border-t border-gray-200',
            adhdMode && 'py-6'
          )}>
            <div className={cn(
              'text-center text-gray-500',
              adhdMode ? 'text-sm' : 'text-xs'
            )}>
              <p>GTD × ADHD</p>
              <p>あなたのペースで、一歩ずつ</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}