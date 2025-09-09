import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface SimpleLoginProps {
  onLogin: (username: string) => void;
  adhdMode?: boolean;
}

export function SimpleLogin({ onLogin, adhdMode = false }: SimpleLoginProps) {
  const [username, setUsername] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const quickLogin = (name: string) => {
    setUsername(name);
    onLogin(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className={cn(
        'w-full max-w-md',
        adhdMode && 'adhd-card shadow-2xl'
      )}>
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <CardTitle className={cn(
            'text-gray-900 mb-2',
            adhdMode ? 'text-2xl' : 'text-xl'
          )}>
            GTD Task Manager
          </CardTitle>
          <p className={cn(
            'text-gray-600',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            ADHD対応タスク管理アプリ
          </p>
        </CardHeader>

        <CardContent className={adhdMode ? 'p-8' : 'p-6'}>
          <div className="space-y-6">
            {/* 簡単説明 */}
            <div className={cn(
              'p-4 bg-blue-50 border border-blue-200 rounded-lg',
              adhdMode && 'p-6'
            )}>
              <h3 className={cn(
                'font-semibold text-blue-900 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                🔒 プライバシー保護
              </h3>
              <p className={cn(
                'text-blue-700',
                adhdMode ? 'text-sm' : 'text-xs'
              )}>
                ユーザー名を入力することで、あなたのタスクデータが他の人に見られることを防げます。
                パスワードは不要で、簡単にアクセスできます。
              </p>
            </div>

            {/* ログインフォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="例: 山田太郎"
                required
                adhdMode={adhdMode}
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size={adhdMode ? 'xl' : 'lg'}
                adhdMode={adhdMode}
                className="w-full"
                disabled={!username.trim()}
              >
                🚀 始める
              </Button>
            </form>

            {/* クイックログイン */}
            <div>
              <p className={cn(
                'text-gray-600 text-center mb-3',
                adhdMode ? 'text-sm' : 'text-xs'
              )}>
                または、クイックログイン:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['ゲスト', 'テストユーザー'].map(name => (
                  <Button
                    key={name}
                    variant="secondary"
                    size={adhdMode ? 'lg' : 'md'}
                    adhdMode={adhdMode}
                    onClick={() => quickLogin(name)}
                    className="w-full"
                  >
                    👤 {name}
                  </Button>
                ))}
              </div>
            </div>

            {/* ADHD応援メッセージ */}
            {adhdMode && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  💪 <strong>一歩ずつ、あなたのペースで</strong>
                </p>
                <p className="text-green-700 text-xs mt-1">
                  このアプリは、ADHD特性を持つ方でも使いやすく設計されています。
                  無理をせず、小さなタスクから始めましょう。
                </p>
              </div>
            )}

            {/* 機能紹介 */}
            <div className="space-y-3">
              <h4 className={cn(
                'font-semibold text-gray-900',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                ✨ 主な機能
              </h4>
              <div className="space-y-2">
                {[
                  { icon: '🏔️', title: 'タスク分解', desc: '大きなタスクを小さく分解' },
                  { icon: '⚡', title: '今すぐできる', desc: '現在の状況で実行可能なタスク' },
                  { icon: '📋', title: 'GTD管理', desc: 'Getting Things Doneメソッド対応' },
                  { icon: '🧠', title: 'ADHD対応', desc: '着手しやすいUI設計' },
                ].map(feature => (
                  <div key={feature.title} className="flex items-center gap-3">
                    <span className="text-lg">{feature.icon}</span>
                    <div>
                      <div className={cn(
                        'font-medium text-gray-900',
                        adhdMode ? 'text-sm' : 'text-xs'
                      )}>
                        {feature.title}
                      </div>
                      <div className={cn(
                        'text-gray-600',
                        adhdMode ? 'text-xs' : 'text-xs'
                      )}>
                        {feature.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}