import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 分単位
  type: 'work' | 'short_break' | 'long_break';
  completed: boolean;
  interrupted?: boolean;
}

export interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalFocusTime: number; // 分単位
  todaysSessions: number;
  todaysFocusTime: number;
  currentStreak: number;
}

export function usePomodoro() {
  const { getUserDataKey, user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分（秒単位）
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState({
    workDuration: 25, // 分
    shortBreakDuration: 5, // 分
    longBreakDuration: 15, // 分
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    playSound: true,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ユーザー別にデータを読み込み
  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }

    const sessionsKey = getUserDataKey('pomodoro-sessions');
    const settingsKey = getUserDataKey('pomodoro-settings');
    
    if (sessionsKey) {
      const savedSessions = localStorage.getItem(sessionsKey);
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          }));
          setSessions(parsedSessions);
        } catch (error) {
          console.error('Failed to parse saved pomodoro sessions:', error);
        }
      }
    }

    if (settingsKey) {
      const savedSettings = localStorage.getItem(settingsKey);
      if (savedSettings) {
        try {
          setSettings({ ...settings, ...JSON.parse(savedSettings) });
        } catch (error) {
          console.error('Failed to parse pomodoro settings:', error);
        }
      }
    }
  }, [user, getUserDataKey]);

  // セッションデータを保存
  useEffect(() => {
    const sessionsKey = getUserDataKey('pomodoro-sessions');
    if (sessionsKey && sessions.length >= 0) {
      localStorage.setItem(sessionsKey, JSON.stringify(sessions));
    }
  }, [sessions, getUserDataKey]);

  // 設定を保存
  useEffect(() => {
    const settingsKey = getUserDataKey('pomodoro-settings');
    if (settingsKey) {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
    }
  }, [settings, getUserDataKey]);

  // タイマー処理
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // 音声通知の準備
  useEffect(() => {
    if (settings.playSound && !audioRef.current) {
      // ブラウザの基本的な音声を使用
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjuS2e/CdCgFKoHS8Nt8Lgcdb7zt6aFODgtMo+P0ul0dCDqS2fDKcCMGLYLP8N14NQkygsrx2H4wCB5rvO7koE8MCU2j4/S+YBoFP5PS8MpwKAUpcMP02H82CSCEyvLYfDAJHmu88eegUQ4GTqXh87taGgU9k9PwxnMnBSmBwfHYfzYKL4DN8+F6OAktlM7x3oYwCTCByfPZaTEILIHR8t4qCyuCzvPegzEOLILR8twrCy2BzfTdizETLoLM8N2QQAoUXrPo7KlSFAlJm9/xumoVBkKm5O+2YB4JQZjo7bllHAU/ltH3yXkpBSh6y+/tpSQOV6nf8dpuGQVImenuwWAbBTyOze+2ZBIF') as HTMLAudioElement;
    }
  }, [settings.playSound]);

  const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleTimerComplete = useCallback(() => {
    if (settings.playSound && audioRef.current) {
      audioRef.current.play().catch(() => {
        // 音声再生失敗時は無視
      });
    }

    if (currentSession) {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true,
      };
      
      setSessions(prev => [...prev, completedSession]);
      setCurrentSession(null);
    }

    setIsRunning(false);
    
    // 次のセッションタイプを決定
    const workSessions = sessions.filter(s => s.type === 'work' && s.completed).length;
    const nextSessionType = currentSession?.type === 'work' 
      ? (workSessions + 1) % settings.sessionsUntilLongBreak === 0 
        ? 'long_break' 
        : 'short_break'
      : 'work';
    
    // 次のセッション時間を設定
    const nextDuration = nextSessionType === 'work' 
      ? settings.workDuration
      : nextSessionType === 'short_break'
      ? settings.shortBreakDuration
      : settings.longBreakDuration;
    
    setTimeLeft(nextDuration * 60);
  }, [currentSession, sessions, settings]);

  const startTimer = useCallback((taskId?: string, taskTitle?: string) => {
    const sessionType: 'work' | 'short_break' | 'long_break' = timeLeft === settings.workDuration * 60 
      ? 'work' 
      : timeLeft === settings.shortBreakDuration * 60
      ? 'short_break'
      : 'long_break';

    const newSession: PomodoroSession = {
      id: generateSessionId(),
      taskId,
      taskTitle,
      startTime: new Date(),
      duration: Math.ceil(timeLeft / 60),
      type: sessionType,
      completed: false,
    };

    setCurrentSession(newSession);
    setIsRunning(true);
  }, [timeLeft, settings]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    
    if (currentSession) {
      const interruptedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date(),
        completed: false,
        interrupted: true,
      };
      
      setSessions(prev => [...prev, interruptedSession]);
    }
    
    setCurrentSession(null);
    setTimeLeft(settings.workDuration * 60);
  }, [currentSession, settings.workDuration]);

  const resetTimer = useCallback((sessionType: 'work' | 'short_break' | 'long_break' = 'work') => {
    setIsRunning(false);
    setCurrentSession(null);
    
    const duration = sessionType === 'work' 
      ? settings.workDuration
      : sessionType === 'short_break'
      ? settings.shortBreakDuration
      : settings.longBreakDuration;
    
    setTimeLeft(duration * 60);
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const getStats = useCallback((): PomodoroStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completedSessions = sessions.filter(s => s.completed);
    const todaySessions = sessions.filter(s => 
      s.startTime >= today && s.startTime < tomorrow
    );
    const todayCompletedSessions = todaySessions.filter(s => s.completed);

    const totalFocusTime = completedSessions
      .filter(s => s.type === 'work')
      .reduce((total, s) => total + s.duration, 0);

    const todaysFocusTime = todayCompletedSessions
      .filter(s => s.type === 'work')
      .reduce((total, s) => total + s.duration, 0);

    // 連続日数を計算（簡単な実装）
    const workSessions = completedSessions.filter(s => s.type === 'work');
    const currentStreak = workSessions.length > 0 ? Math.min(workSessions.length, 7) : 0;

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalFocusTime,
      todaysSessions: todaySessions.length,
      todaysFocusTime,
      currentStreak,
    };
  }, [sessions]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getCurrentSessionType = useCallback(() => {
    if (!currentSession) {
      return timeLeft === settings.workDuration * 60 
        ? 'work' 
        : timeLeft === settings.shortBreakDuration * 60
        ? 'short_break'
        : 'long_break';
    }
    return currentSession.type;
  }, [currentSession, timeLeft, settings]);

  return {
    isRunning,
    timeLeft,
    currentSession,
    sessions,
    settings,
    stats: getStats(),
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    updateSettings,
    formatTime,
    getCurrentSessionType,
  };
}