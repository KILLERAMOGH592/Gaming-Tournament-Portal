// import React, { useState, useEffect } from 'react';
// import { supabase } from './lib/supabase';
// import Header from './components/Header';
// import TournamentCard from './components/TournamentCard';
// import CreateTournament from './components/CreateTournament';
// import TournamentDetails from './components/TournamentDetails';
// import AuthModal from './components/AuthModal';
// import AdminPanel from './components/AdminPanel';
// import { Tournament } from './types/tournament';
// import { Trophy, Plus, Search, Filter } from 'lucide-react';

// function App() {
//   const [user, setUser] = useState(null);
//   const [tournaments, setTournaments] = useState<Tournament[]>([]);
//   const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
//   const [showCreateTournament, setShowCreateTournament] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [showAdminPanel, setShowAdminPanel] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       if (session?.user) {
//         fetchTournaments();
//       }
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//       if (session?.user) {
//         fetchTournaments();
//       } else {
//         setTournaments([]);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const fetchTournaments = async () => {
//     const { data, error } = await supabase
//       .from('tournaments')
//       .select(`
//         *,
//         tournament_participants(count),
//         created_by_user:profiles(username)
//       `)
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching tournaments:', error);
//       return;
//     }

//     setTournaments(data || []);
//   };

//   const filteredTournaments = tournaments.filter(tournament => {
//     const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          tournament.game.toLowerCase().includes(searchQuery.toLowerCase());
    
//     if (filterStatus === 'all') return matchesSearch;
//     return matchesSearch && tournament.status === filterStatus;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="animate-pulse">
//           <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />
//           <p className="text-white text-xl">Loading Tournament Portal...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <Header 
//         user={user} 
//         onAuthClick={() => setShowAuthModal(true)}
//         onAdminClick={() => setShowAdminPanel(true)}
//       />

//       <main className="container mx-auto px-4 py-8">
//         {!user ? (
//           <div className="text-center py-20">
//             <Trophy className="w-24 h-24 text-blue-400 mx-auto mb-8" />
//             <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
//               Gaming Tournament Portal
//             </h1>
//             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//               Compete in epic gaming tournaments, climb the leaderboards, and prove your skills against players worldwide.
//             </p>
//             <button
//               onClick={() => setShowAuthModal(true)}
//               className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
//             >
//               Join the Competition
//             </button>
//           </div>
//         ) : selectedTournament ? (
//           <TournamentDetails
//             tournament={selectedTournament}
//             user={user}
//             onBack={() => setSelectedTournament(null)}
//             onUpdate={fetchTournaments}
//           />
//         ) : showCreateTournament ? (
//           <CreateTournament
//             user={user}
//             onClose={() => setShowCreateTournament(false)}
//             onCreate={fetchTournaments}
//           />
//         ) : showAdminPanel ? (
//           <AdminPanel
//             user={user}
//             onClose={() => setShowAdminPanel(false)}
//             tournaments={tournaments}
//             onUpdate={fetchTournaments}
//           />
//         ) : (
//           <>
//             <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
//               <h1 className="text-4xl font-bold text-white">Active Tournaments</h1>
//               <div className="flex gap-4 items-center">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Search tournaments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 pr-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="pl-10 pr-8 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none appearance-none"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="upcoming">Upcoming</option>
//                     <option value="ongoing">Ongoing</option>
//                     <option value="completed">Completed</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setShowCreateTournament(true)}
//                   className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Create Tournament
//                 </button>
//               </div>
//             </div>

//             {filteredTournaments.length === 0 ? (
//               <div className="text-center py-20">
//                 <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                 <p className="text-gray-400 text-xl mb-4">No tournaments found</p>
//                 <p className="text-gray-500">Be the first to create an epic tournament!</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredTournaments.map((tournament) => (
//                   <TournamentCard
//                     key={tournament.id}
//                     tournament={tournament}
//                     onClick={() => setSelectedTournament(tournament)}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       {showAuthModal && (
//         <AuthModal onClose={() => setShowAuthModal(false)} />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import TournamentCard from './components/TournamentCard';
import CreateTournament from './components/CreateTournament';
import TournamentDetails from './components/TournamentDetails';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import { Tournament } from './types/tournament';
import { Trophy, Plus, Search, Filter } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTournaments();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTournaments();
      } else {
        setTournaments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Fetch tournaments
  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')   // 👈 keep simple first; add relations later once working
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tournaments:', error);
      return;
    }

    setTournaments(data || []);
  };

  // 🔹 Subscribe to realtime changes (auto-refresh tournaments)
  useEffect(() => {
    const channel = supabase
      .channel('tournaments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        () => fetchTournaments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔹 Apply search + filter
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.game.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && tournament.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-white text-xl">Loading Tournament Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onAdminClick={() => setShowAdminPanel(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center py-20">
            <Trophy className="w-24 h-24 text-blue-400 mx-auto mb-8" />
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Gaming Tournament Portal
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Compete in epic gaming tournaments, climb the leaderboards, and prove your skills against players worldwide.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              Join the Competition
            </button>
          </div>
        ) : selectedTournament ? (
          <TournamentDetails
            tournament={selectedTournament}
            user={user}
            onBack={() => setSelectedTournament(null)}
            onUpdate={fetchTournaments}
          />
        ) : showCreateTournament ? (
          <CreateTournament
            user={user}
            onClose={() => setShowCreateTournament(false)}
            onCreate={fetchTournaments}   // 👈 refresh after create
          />
        ) : showAdminPanel ? (
          <AdminPanel
            user={user}
            onClose={() => setShowAdminPanel(false)}
            tournaments={tournaments}
            onUpdate={fetchTournaments}
          />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-4xl font-bold text-white">Active Tournaments</h1>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowCreateTournament(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Tournament
                </button>
              </div>
            </div>

            {filteredTournaments.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-xl mb-4">No tournaments found</p>
                <p className="text-gray-500">Be the first to create an epic tournament!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onClick={() => setSelectedTournament(tournament)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;
