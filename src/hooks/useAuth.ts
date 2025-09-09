import { useState, useEffect, useCallback } from 'react';

export interface User {
  username: string;
  loginTime: Date;
  lastActiveTime: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからユーザー情報を読み込み
  useEffect(() => {
    const savedUser = localStorage.getItem('gtd-current-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          ...parsedUser,
          loginTime: new Date(parsedUser.loginTime),
          lastActiveTime: new Date(parsedUser.lastActiveTime),
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('gtd-current-user');
      }
    }
    setIsLoading(false);
  }, []);

  // ユーザー情報をローカルストレージに保存
  useEffect(() => {
    if (user) {
      localStorage.setItem('gtd-current-user', JSON.stringify(user));
    }
  }, [user]);

  const login = useCallback((username: string) => {
    const now = new Date();
    const newUser: User = {
      username: username.trim(),
      loginTime: now,
      lastActiveTime: now,
    };
    
    setUser(newUser);
    
    // ユーザーリストを更新（複数ユーザー対応）
    const userList = JSON.parse(localStorage.getItem('gtd-user-list') || '[]');
    const existingUserIndex = userList.findIndex((u: User) => u.username === newUser.username);
    
    if (existingUserIndex >= 0) {
      userList[existingUserIndex] = newUser;
    } else {
      userList.push(newUser);
    }
    
    localStorage.setItem('gtd-user-list', JSON.stringify(userList));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('gtd-current-user');
  }, []);

  const updateLastActiveTime = useCallback(() => {
    if (user) {
      const updatedUser = {
        ...user,
        lastActiveTime: new Date(),
      };
      setUser(updatedUser);
    }
  }, [user]);

  const switchUser = useCallback((username: string) => {
    logout();
    login(username);
  }, [login, logout]);

  const getRecentUsers = useCallback(() => {
    const userList = JSON.parse(localStorage.getItem('gtd-user-list') || '[]');
    return userList
      .map((u: any) => ({
        ...u,
        loginTime: new Date(u.loginTime),
        lastActiveTime: new Date(u.lastActiveTime),
      }))
      .sort((a: User, b: User) => b.lastActiveTime.getTime() - a.lastActiveTime.getTime())
      .slice(0, 5); // 最近の5人
  }, []);

  const getUserDataKey = useCallback((key: string) => {
    return user ? `gtd-${user.username}-${key}` : null;
  }, [user]);

  return {
    user,
    isLoading,
    login,
    logout,
    updateLastActiveTime,
    switchUser,
    getRecentUsers,
    getUserDataKey,
    isLoggedIn: !!user,
  };
}