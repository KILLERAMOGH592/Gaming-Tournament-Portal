import React, { useState } from 'react';
import { Tournament } from '../types/tournament';
import { X, Shield, Play, Pause, Trophy, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  user: any;
  onClose: () => void;
  tournaments: Tournament[];
  onUpdate: () => void;
}

export default function AdminPanel({ user, onClose, tournaments, onUpdate }: AdminPanelProps) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);

  const userTournaments = tournaments.filter(t => t.created_by === user.id);

  const updateTournamentStatus = async (tournamentId: string, status: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ status })
        .eq('id', tournamentId);

      if (error) throw error;
      onUpdate();
    } catch (error: any) {
      console.error('Error updating tournament status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'upcoming': return 'ongoing';
      case 'ongoing': return 'completed';
      default: return currentStatus;
    }
  };

  const getActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'upcoming': return 'Start Tournament';
      case 'ongoing': return 'End Tournament';
      default: return 'Complete';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Your Tournaments</h3>
          {userTournaments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>You haven't created any tournaments yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTournaments.map((tournament) => (
                <div key={tournament.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{tournament.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(tournament.status)}`}>
                          {tournament.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{tournament.game}</p>
                      <div className="text-sm text-gray-400">
                        Participants: {tournament.tournament_participants?.[0]?.count || 0}/{tournament.max_participants}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {tournament.status !== 'completed' && (
                        <button
                          onClick={() => updateTournamentStatus(tournament.id, getNextStatus(tournament.status))}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {tournament.status === 'upcoming' ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <Pause className="w-4 h-4" />
                          )}
                          {getActionText(tournament.status)}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedTournament(tournament)}
                        className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTournament && (
          <div className="border-t border-slate-700 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Managing: {selectedTournament.title}
            </h4>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 mb-4">
                Tournament management features will be implemented here, including:
              </p>
              <ul className="text-gray-400 space-y-1 mb-4">
                <li>• Match result entry</li>
                <li>• Participant management</li>
                <li>• Bracket updates</li>
                <li>• Prize distribution</li>
              </ul>
              <button
                onClick={() => setSelectedTournament(null)}
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}