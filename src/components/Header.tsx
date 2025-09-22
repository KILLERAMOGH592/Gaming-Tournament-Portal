import React from 'react';
import { Trophy, User, Shield, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ user, onAuthClick, onAdminClick }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">GameTourneys</h1>
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 hidden sm:inline">
                Welcome, <span className="text-white font-semibold">{user.email}</span>
              </span>
              <button
                onClick={onAdminClick}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}