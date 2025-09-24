import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';

interface User {
  id: string;
  name: string;
  email: string;
}

type AuthMode = 'login' | 'register';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleRegister = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && token) {
    return <Dashboard user={user} token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Assessment
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Manager
            </span>
          </h1>
          <p className="text-gray-300">Professional Assessment Management System</p>
        </div>

        {authMode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400">🔐</span>
              </div>
              <p>Secure Auth</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-emerald-400">📊</span>
              </div>
              <p>PDF Reports</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-400">⚙️</span>
              </div>
              <p>Flexible Config</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;