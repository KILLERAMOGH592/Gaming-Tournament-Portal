export interface Tournament {
  id: string;
  title: string;
  game: string;
  description: string;
  max_participants: number;
  entry_fee: number;
  prize_pool: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_by: string;
  created_at: string;
  tournament_participants?: { count: number }[];
  created_by_user?: { username: string };
  bracket_data?: any;
}

export interface Participant {
  id: string;
  tournament_id: string;
  user_id: string;
  joined_at: string;
  profile: {
    username: string;
    avatar_url?: string;
  };
}

export interface Match {
  id: string;
  tournament_id: string;
  player1_id: string;
  player2_id: string;
  winner_id?: string;
  round: number;
  match_order: number;
  status: 'pending' | 'ongoing' | 'completed';
  scheduled_time?: string;
  result?: any;
}