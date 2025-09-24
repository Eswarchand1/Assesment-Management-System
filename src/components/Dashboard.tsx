import React, { useState, useEffect } from 'react';
import { FileText, Download, Settings, LogOut, User, Activity } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Session {
  session_id: string;
  assessment_id: string;
  assessment_type: string;
}

interface DashboardProps {
  user: User;
  token: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, token, onLogout }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const generateReport = async (sessionId: string) => {
    setGenerateLoading(sessionId);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Report generated successfully! File: ${data.fileName}`
        });
      } else {
        throw new Error(data.error || 'Failed to generate report');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to generate report'
      });
    } finally {
      setGenerateLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Assessment Dashboard</h1>
                <p className="text-gray-300">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
              : 'bg-red-500/20 border border-red-500/50 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Available Sessions</p>
                <p className="text-white text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Assessment Types</p>
                <p className="text-white text-2xl font-bold">
                  {new Set(sessions.map(s => s.assessment_id)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">System Status</p>
                <p className="text-white text-2xl font-bold">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white mb-2">Available Assessment Sessions</h2>
            <p className="text-gray-300">Generate PDF reports from assessment data</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-4 text-gray-300 font-medium">Session ID</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Assessment ID</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Assessment Type</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr 
                    key={session.session_id} 
                    className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <code className="text-blue-400 bg-blue-500/20 px-2 py-1 rounded text-sm">
                        {session.session_id}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-medium">
                        {session.assessment_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-200">
                        {session.assessment_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => generateReport(session.session_id)}
                        disabled={generateLoading === session.session_id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generateLoading === session.session_id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {generateLoading === session.session_id ? 'Generating...' : 'Generate PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sessions.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No assessment sessions available</p>
              <p className="text-gray-500 text-sm mt-2">Check your data configuration or contact support</p>
            </div>
          )}
        </div>

        {/* Configuration Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">Supported Assessment Types</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• as_hr_02 - Health & Fitness Assessment</li>
                <li>• as_card_01 - Cardiac Assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Configuration Features</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Dynamic section configuration</li>
                <li>• JSON path field mapping</li>
                <li>• Value classification ranges</li>
                <li>• Template flexibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};