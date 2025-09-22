import React from 'react';
import { Tournament, Participant } from '../types/tournament';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

interface TournamentBracketProps {
  tournament: Tournament;
  participants: Participant[];
  isAdmin: boolean;
}

export default function TournamentBracket({ tournament, participants, isAdmin }: TournamentBracketProps) {
  const generateBracket = () => {
    if (participants.length < 2) return [];
    
    const rounds = Math.ceil(Math.log2(tournament.max_participants));
    const bracket = [];
    
    for (let round = 0; round < rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round - 1);
      const roundMatches = [];
      
      for (let match = 0; match < matchesInRound; match++) {
        if (round === 0) {
          // First round - pair up participants
          const player1 = participants[match * 2];
          const player2 = participants[match * 2 + 1];
          
          roundMatches.push({
            id: `r${round}_m${match}`,
            player1: player1?.profile.username || 'TBD',
            player2: player2?.profile.username || 'TBD',
            winner: null,
            status: 'pending'
          });
        } else {
          roundMatches.push({
            id: `r${round}_m${match}`,
            player1: 'TBD',
            player2: 'TBD',
            winner: null,
            status: 'pending'
          });
        }
      }
      
      bracket.push({
        round: round + 1,
        name: round === rounds - 1 ? 'Final' : round === rounds - 2 ? 'Semi-Final' : `Round ${round + 1}`,
        matches: roundMatches
      });
    }
    
    return bracket;
  };

  const bracket = generateBracket();

  if (participants.length < 2) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Tournament Bracket
        </h3>
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Waiting for participants...</p>
          <p className="text-gray-500">At least 2 players needed to generate bracket</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Tournament Bracket
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {bracket.map((round, roundIndex) => (
            <div key={roundIndex} className="flex-shrink-0">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                {round.name}
              </h4>
              <div className="space-y-6">
                {round.matches.map((match) => (
                  <div key={match.id} className="bg-slate-700 rounded-lg p-4 min-w-48">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <span className="text-white font-medium truncate">
                          {match.player1}
                        </span>
                        {match.winner === match.player1 && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-center text-gray-400 text-sm">VS</div>
                      <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <span className="text-white font-medium truncate">
                          {match.player2}
                        </span>
                        {match.winner === match.player2 && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-center">
                      {match.status === 'pending' && (
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Clock className="w-3 h-3" />
                          Pending
                        </div>
                      )}
                      {match.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {tournament.status === 'upcoming' && (
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> The bracket will be finalized when the tournament begins. 
            Current bracket shows potential matchups based on current participants.
          </p>
        </div>
      )}
    </div>
  );
}