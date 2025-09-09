import React, { useState } from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TaskDecompositionProps {
  task: Task;
  onCreateSubtask: (parentId: string, subtaskData: Partial<Task>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onClose: () => void;
  adhdMode?: boolean;
}

export function TaskDecomposition({
  task,
  onCreateSubtask,
  onUpdateTask,
  onClose,
  adhdMode = false,
}: TaskDecompositionProps) {
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>(['', '', '']);
  const [isAutoDecompose, setIsAutoDecompose] = useState(false);

  // 自動分解の提案
  const autoDecomposePrompts = {
    large: [
      'この大きなタスクの最初のステップは何ですか？',
      '次に必要な準備や調査は何ですか？',
      '最後に必要な仕上げや確認作業は何ですか？',
    ],
    medium: [
      '具体的にどんな作業が必要ですか？',
      'どんな材料や道具が必要ですか？',
      '完了の判断基準は何ですか？',
    ],
    small: [
      '最初の5分でできることは？',
      '次の15分でできることは？',
      '残りの作業は何ですか？',
    ],
  };

  const currentPrompts = autoDecomposePrompts[task.level] || autoDecomposePrompts.medium;

  const handleCreateSubtasks = () => {
    subtaskInputs.forEach((input, index) => {
      if (input.trim()) {
        const nextLevel: 'large' | 'medium' | 'small' = 
          task.level === 'large' ? 'medium' : 'small';

        onCreateSubtask(task.id, {
          title: input.trim(),
          level: nextLevel,
          category: task.category,
          difficulty: Math.max(1, task.difficulty - 1) as 1 | 2 | 3 | 4 | 5,
          energyLevel: task.energyLevel,
          estimatedTime: Math.floor((task.estimatedTime || 30) / subtaskInputs.filter(i => i.trim()).length),
        });
      }
    });

    // 親タスクを分解済みとしてマーク
    onUpdateTask(task.id, { isDecomposed: true });
    onClose();
  };

  const handleAutoFill = () => {
    const suggestions = {
      large: {
        '資料作成': ['資料の構成を考える', '必要な情報を収集する', '資料を作成・校正する'],
        '会議': ['議題を準備する', '会議を実施する', '議事録を作成し共有する'],
        '学習': ['学習計画を立てる', '教材を読み・実践する', '学習内容をまとめる'],
        'default': ['計画・準備をする', 'メイン作業を実行する', '確認・仕上げをする'],
      },
      medium: {
        '計画': ['目標を明確にする', 'スケジュールを作る', 'リソースを確保する'],
        '作業': ['環境を整える', '作業を実行する', '結果を確認する'],
        'default': ['準備する', '実行する', '確認する'],
      },
      small: {
        'default': ['最初の一歩を踏み出す', '作業を続ける', '完了する'],
      }
    };

    const levelSuggestions = suggestions[task.level] || suggestions.medium;
    const matchedSuggestions = Object.keys(levelSuggestions).find(key => 
      task.title.toLowerCase().includes(key)
    );
    
    const finalSuggestions = matchedSuggestions 
      ? levelSuggestions[matchedSuggestions as keyof typeof levelSuggestions]
      : levelSuggestions.default;

    setSubtaskInputs(finalSuggestions.map(s => s));
  };

  const getLevelInfo = (level: string) => {
    const info = {
      large: { label: '大タスク', color: 'bg-red-100 text-red-800', icon: '🏔️' },
      medium: { label: '中タスク', color: 'bg-yellow-100 text-yellow-800', icon: '⛰️' },
      small: { label: '小タスク', color: 'bg-green-100 text-green-800', icon: '🏃' },
    };
    return info[level as keyof typeof info] || info.medium;
  };

  const levelInfo = getLevelInfo(task.level);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className={cn(
        'w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl border-2 border-gray-300',
        adhdMode && 'p-8'
      )}>
        <div className="bg-white rounded-lg">
          <Card className="bg-white shadow-none border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className={adhdMode ? 'text-2xl' : 'text-xl'}>
                🔨 タスク分解
              </CardTitle>
              <Badge className={levelInfo.color}>
                {levelInfo.icon} {levelInfo.label}
              </Badge>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ❌
            </Button>
          </div>
          <div className={cn(
            'mt-4 p-4 bg-blue-50 rounded-lg',
            adhdMode && 'p-6'
          )}>
            <h3 className={cn(
              'font-semibold text-blue-900 mb-2',
              adhdMode ? 'text-lg' : 'text-base'
            )}>
              分解対象のタスク:
            </h3>
            <p className={cn(
              'text-blue-800',
              adhdMode ? 'text-base' : 'text-sm'
            )}>
              {task.title}
            </p>
            {task.description && (
              <p className={cn(
                'text-blue-600 mt-1',
                adhdMode ? 'text-sm' : 'text-xs'
              )}>
                {task.description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
          <div className="space-y-6">
            {/* 自動分解ボタン */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={handleAutoFill}
              >
                💡 自動提案を使う
              </Button>
              <Button
                variant="ghost"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={() => setIsAutoDecompose(!isAutoDecompose)}
              >
                ❓ 分解のヒント
              </Button>
            </div>

            {/* 分解のヒント */}
            {isAutoDecompose && (
              <div className={cn(
                'p-4 bg-yellow-50 border border-yellow-200 rounded-lg',
                adhdMode && 'p-6'
              )}>
                <h4 className={cn(
                  'font-semibold text-yellow-800 mb-3',
                  adhdMode ? 'text-base' : 'text-sm'
                )}>
                  💭 分解のヒント ({levelInfo.label}向け):
                </h4>
                <div className="space-y-2">
                  {currentPrompts.map((prompt, index) => (
                    <div key={index} className={cn(
                      'text-yellow-700',
                      adhdMode ? 'text-sm' : 'text-xs'
                    )}>
                      {index + 1}. {prompt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* サブタスク入力エリア */}
            <div className="space-y-4">
              <h4 className={cn(
                'font-semibold text-gray-900',
                adhdMode ? 'text-lg' : 'text-base'
              )}>
                📝 サブタスクを追加:
              </h4>
              
              {subtaskInputs.map((input, index) => (
                <div key={index} className="relative">
                  <Input
                    label={`${index + 1}つ目のサブタスク`}
                    value={input}
                    onChange={(e) => {
                      const newInputs = [...subtaskInputs];
                      newInputs[index] = e.target.value;
                      setSubtaskInputs(newInputs);
                    }}
                    placeholder={currentPrompts[index] || `サブタスク${index + 1}の内容を入力`}
                    adhdMode={adhdMode}
                  />
                </div>
              ))}

              <Button
                variant="ghost"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={() => setSubtaskInputs([...subtaskInputs, ''])}
                className="w-full border-2 border-dashed border-gray-300"
              >
                ➕ サブタスクを追加
              </Button>
            </div>

            {/* ADHD応援メッセージ */}
            {adhdMode && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  🌟 <strong>ADHD応援メッセージ:</strong>
                </p>
                <p className="text-green-700 text-sm mt-1">
                  大きなタスクを小さく分解することで、着手しやすくなります！
                  完璧でなくても大丈夫。まずは思いつくまま書き出してみましょう。
                </p>
              </div>
            )}

            {/* アクションボタン */}
            <div className={cn(
              'flex gap-3',
              adhdMode ? 'flex-col sm:flex-row' : 'flex-row'
            )}>
              <Button
                variant="primary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={handleCreateSubtasks}
                className="flex-1"
                disabled={!subtaskInputs.some(input => input.trim())}
              >
                🚀 サブタスクを作成
              </Button>
              
              <Button
                variant="secondary"
                size={adhdMode ? 'lg' : 'md'}
                adhdMode={adhdMode}
                onClick={onClose}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}