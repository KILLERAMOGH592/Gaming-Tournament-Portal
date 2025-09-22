import React, { useState } from 'react';
import { X, Trophy, Calendar, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateTournamentProps {
  user: any;
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateTournament({ user, onClose, onCreate }: CreateTournamentProps) {
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    description: '',
    max_participants: 16,
    entry_fee: 0,
    prize_pool: 0,
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('tournaments')
        .insert([{
          ...formData,
          created_by: user.id,
          status: 'upcoming'
        }]);

      if (error) throw error;

      onCreate();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('participants') || name.includes('fee') || name.includes('pool') 
        ? parseInt(value) || 0 
        : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Tournament</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Tournament Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Epic Gaming Championship"
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Game</label>
              <select
                name="game"
                value={formData.game}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Game</option>
                <option value="Fortnite">Fortnite</option>
                <option value="League of Legends">League of Legends</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Valorant">Valorant</option>
                <option value="Apex Legends">Apex Legends</option>
                <option value="Call of Duty">Call of Duty</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your tournament..."
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Max Players
              </label>
              <select
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value={8}>8 Players</option>
                <option value={16}>16 Players</option>
                <option value={32}>32 Players</option>
                <option value={64}>64 Players</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Entry Fee ($)
              </label>
              <input
                type="number"
                name="entry_fee"
                value={formData.entry_fee}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Prize Pool ($)
              </label>
              <input
                type="number"
                name="prize_pool"
                value={formData.prize_pool}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Start Date
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                End Date
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}