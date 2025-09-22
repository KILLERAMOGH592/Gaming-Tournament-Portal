import React from 'react';
import { Tournament } from '../types/tournament';
import { Calendar, Users, DollarSign, Trophy, Gamepad2 } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
}

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const participantCount = tournament.tournament_participants?.[0]?.count || 0;
  const spotsLeft = tournament.max_participants - participantCount;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Live';
      case 'completed': return 'Finished';
      default: return status;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{tournament.title}</h3>
            <p className="text-blue-400 font-semibold">{tournament.game}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(tournament.status)}`}>
          {getStatusText(tournament.status)}
        </span>
      </div>

      <p className="text-gray-300 mb-4 line-clamp-2">{tournament.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm">
            {participantCount}/{tournament.max_participants}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">${tournament.prize_pool}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-sm">${tournament.entry_fee}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-sm">
            {new Date(tournament.start_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          by {tournament.created_by_user?.username || 'Anonymous'}
        </div>
        {spotsLeft > 0 && tournament.status === 'upcoming' ? (
          <div className="text-sm text-green-400 font-semibold">
            {spotsLeft} spots left
          </div>
        ) : tournament.status === 'upcoming' ? (
          <div className="text-sm text-red-400 font-semibold">
            Tournament Full
          </div>
        ) : null}
      </div>
    </div>
  );
}