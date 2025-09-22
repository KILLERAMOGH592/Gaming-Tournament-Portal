import React, { useState, useEffect } from 'react';
import { Tournament, Participant } from '../types/tournament';
import { ArrowLeft, Users, Trophy, Calendar, DollarSign, UserPlus, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TournamentBracket from './TournamentBracket';

interface TournamentDetailsProps {
  tournament: Tournament;
  user: any;
  onBack: () => void;
  onUpdate: () => void;
}

export default function TournamentDetails({ tournament, user, onBack, onUpdate }: TournamentDetailsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [tournament.id]);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select(`
        *,
        profile:profiles(username, avatar_url)
      `)
      .eq('tournament_id', tournament.id);

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    setParticipants(data || []);
    setIsRegistered(data?.some(p => p.user_id === user.id) || false);
  };

  const handleJoinTournament = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .insert([{
          tournament_id: tournament.id,
          user_id: user.id
        }]);

      if (error) throw error;

      await fetchParticipants();
      onUpdate();
    } catch (error: any) {
      console.error('Error joining tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTournament = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .delete()
        .eq('tournament_id', tournament.id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchParticipants();
      onUpdate();
    } catch (error: any) {
      console.error('Error leaving tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const canJoin = tournament.status === 'upcoming' && 
                  participants.length < tournament.max_participants && 
                  !isRegistered;

  const canLeave = tournament.status === 'upcoming' && isRegistered;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Tournaments
      </button>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{tournament.title}</h1>
            <p className="text-blue-400 text-xl font-semibold mb-4">{tournament.game}</p>
            <p className="text-gray-300 max-w-2xl">{tournament.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            {canJoin && (
              <button
                onClick={handleJoinTournament}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5" />
                Join Tournament
              </button>
            )}
            
            {canLeave && (
              <button
                onClick={handleLeaveTournament}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                Leave Tournament
              </button>
            )}

            {isRegistered && tournament.status !== 'upcoming' && (
              <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Registered
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{participants.length}</div>
            <div className="text-gray-300 text-sm">/ {tournament.max_participants} Players</div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${tournament.prize_pool}</div>
            <div className="text-gray-300 text-sm">Prize Pool</div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${tournament.entry_fee}</div>
            <div className="text-gray-300 text-sm">Entry Fee</div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {new Date(tournament.start_date).toLocaleDateString()}
            </div>
            <div className="text-gray-300 text-sm">Start Date</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TournamentBracket 
            tournament={tournament} 
            participants={participants}
            isAdmin={tournament.created_by === user.id}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Participants ({participants.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={participant.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {participant.profile.username}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Joined {new Date(participant.joined_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            
            {participants.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No participants yet. Be the first to join!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}