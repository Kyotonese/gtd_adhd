import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface QuickCaptureProps {
  onCapture: (text: string) => void;
  adhdMode?: boolean;
}

export function QuickCapture({ onCapture, adhdMode = false }: QuickCaptureProps) {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCapture(input.trim());
      setInput('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setInput('');
    }
  };

  return (
    <Card className={cn(
      'sticky top-4 z-10 mb-6',
      adhdMode && 'adhd-card shadow-lg'
    )}>
      <CardContent className={adhdMode ? 'p-6' : 'p-4'}>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onKeyDown={handleKeyDown}
                placeholder="頭に浮かんだことを何でも入力してください..."
                className={cn(
                  'transition-all duration-200',
                  isExpanded && 'ring-2 ring-primary-500'
                )}
                adhdMode={adhdMode}
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size={adhdMode ? 'lg' : 'md'}
              adhdMode={adhdMode}
              disabled={!input.trim()}
            >
              💡 キャプチャ
            </Button>
          </div>
          
          {isExpanded && (
            <div className={cn(
              'mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200',
              adhdMode && 'p-6'
            )}>
              <p className={cn(
                'text-blue-700 dark:text-blue-300 mb-2',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                💭 <strong>GTD収集のコツ:</strong>
              </p>
              <ul className={cn(
                'text-blue-600 dark:text-blue-400 space-y-1',
                adhdMode ? 'text-base' : 'text-sm'
              )}>
                <li>• 完璧でなくても大丈夫。とにかく記録しましょう</li>
                <li>• 後で整理します。今は頭から出すことに集中</li>
                <li>• Enterで送信、Escapeでキャンセル</li>
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}