import React, { useState, useEffect } from 'react';
import { Task, GTDCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Partial<Task>) => void;
  onCancel: () => void;
  adhdMode?: boolean;
}

const categoryOptions: { value: GTDCategory; label: string }[] = [
  { value: 'capture', label: '📥 収集' },
  { value: 'next_actions', label: '⚡ 次にやること' },
  { value: 'projects', label: '📁 プロジェクト' },
  { value: 'waiting_for', label: '⏳ 待機中' },
  { value: 'someday_maybe', label: '🌟 いつかやる' },
  { value: 'calendar', label: '📅 カレンダー' },
  { value: 'reference', label: '📚 資料' },
];

const difficultyOptions = [
  { value: 1, label: '超簡単 😊', color: 'text-green-600' },
  { value: 2, label: '簡単 🙂', color: 'text-blue-600' },
  { value: 3, label: '普通 😐', color: 'text-yellow-600' },
  { value: 4, label: '難しい 😅', color: 'text-orange-600' },
  { value: 5, label: '超難しい 😰', color: 'text-red-600' },
];

const energyLevelOptions = [
  { value: 'low', label: '🔋 低エネルギー' },
  { value: 'medium', label: '🔋🔋 中エネルギー' },
  { value: 'high', label: '🔋🔋🔋 高エネルギー' },
];

const levelOptions = [
  { value: 'large', label: '🏔️ 大タスク - 複雑で時間がかかる作業' },
  { value: 'medium', label: '⛰️ 中タスク - 適度な作業量' },
  { value: 'small', label: '🏃 小タスク - すぐにできる小さな作業' },
];

export function TaskForm({ task, onSave, onCancel, adhdMode = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'capture' as GTDCategory,
    difficulty: task?.difficulty || 3,
    estimatedTime: task?.estimatedTime || 30,
    energyLevel: task?.energyLevel || 'medium',
    context: task?.context?.join(', ') || '',
    level: task?.level || 'medium' as 'large' | 'medium' | 'small',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      context: formData.context.split(',').map(c => c.trim()).filter(Boolean),
      difficulty: formData.difficulty as 1 | 2 | 3 | 4 | 5,
      energyLevel: formData.energyLevel as 'low' | 'medium' | 'high',
      level: formData.level as 'large' | 'medium' | 'small',
    };

    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className={cn(
        'w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl border-2 border-gray-300',
        adhdMode && 'p-8' 
      )}>
        <div className="bg-white rounded-lg">
          <Card className="bg-white shadow-none border-none">
        <CardHeader>
          <CardTitle className={adhdMode ? 'text-2xl' : 'text-xl'}>
            {task ? '📝 タスク編集' : '✨ 新しいタスク'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="タイトル *"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="タスクの内容を入力してください"
              required
              adhdMode={adhdMode}
            />

            <div>
              <label className={cn(
                'block font-medium text-gray-700 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="詳細な説明があれば入力してください"
                rows={3}
                className={cn(
                  'w-full border border-gray-300 rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  adhdMode ? 'adhd-input' : 'px-3 py-2 text-sm'
                )}
              />
            </div>

            <div>
              <label className={cn(
                'block font-medium text-gray-700 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                カテゴリ
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as GTDCategory }))}
                className={cn(
                  'w-full border border-gray-300 rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  adhdMode ? 'adhd-input' : 'px-3 py-2 text-sm'
                )}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={cn(
                'block font-medium text-gray-700 mb-3',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                難易度
              </label>
              <div className="grid grid-cols-1 gap-2">
                {difficultyOptions.map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-center p-3 border rounded-lg cursor-pointer transition-all',
                      formData.difficulty === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400',
                      adhdMode && 'p-4'
                    )}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={option.value}
                      checked={formData.difficulty === option.value}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        difficulty: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
                      }))}
                      className="mr-3"
                    />
                    <span className={cn(
                      option.color,
                      adhdMode ? 'text-base font-medium' : 'text-sm'
                    )}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={cn(
                'block font-medium text-gray-700 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                タスクレベル
              </label>
              <div className="space-y-2">
                {levelOptions.map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-start p-3 border rounded-lg cursor-pointer transition-all',
                      formData.level === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400',
                      adhdMode && 'p-4'
                    )}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={option.value}
                      checked={formData.level === option.value}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        level: e.target.value as 'large' | 'medium' | 'small'
                      }))}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <span className={cn(
                        'font-medium',
                        adhdMode ? 'text-base' : 'text-sm'
                      )}>
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="推定時間（分）"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    estimatedTime: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  min="1"
                  step="1"
                  placeholder="例: 30"
                  adhdMode={adhdMode}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {[5, 10, 15, 30, 60, 120].map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, estimatedTime: time }))}
                      className={cn(
                        'px-2 py-1 text-xs rounded border transition-colors',
                        formData.estimatedTime === time 
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      )}
                    >
                      {time}分
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={cn(
                  'block font-medium text-gray-700 mb-2',
                  adhdMode ? 'text-base' : 'text-sm'
                )}>
                  必要エネルギー
                </label>
                <select
                  value={formData.energyLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: e.target.value as "low" | "medium" | "high" }))}
                  className={cn(
                    'w-full border border-gray-300 rounded-md shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    adhdMode ? 'adhd-input' : 'px-3 py-2 text-sm'
                  )}
                >
                  {energyLevelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="コンテキスト（カンマ区切り）"
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              placeholder="例: 家, パソコン, 電話"
              adhdMode={adhdMode}
            />

            <div className={cn(
              'flex gap-3',
              adhdMode ? 'flex-col sm:flex-row' : 'flex-row'
            )}>
              <Button
                type="submit"
                variant="primary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                className="flex-1"
              >
                💾 保存
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={onCancel}
                className="flex-1"
              >
                ❌ キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}