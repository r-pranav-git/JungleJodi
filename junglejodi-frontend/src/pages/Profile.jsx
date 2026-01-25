import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { Leaf, Sun, Moon, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const { createProfile, theme } = useAppStore();
    const [formData, setFormData] = useState({
        species: '',
        habitat: 'land',
        foodHabit: 'herbivore',
        activityTime: 'diurnal',
        personality: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProfile(formData);
        navigate('/matches');
    };

    const isNight = theme === 'night';

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-xl w-full mx-auto ${isNight ? 'glass-card-dark text-white' : 'glass-card text-gray-800'} p-10 relative overflow-hidden my-10`}
        >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />

            <div className="relative">
                <h2 className={`text-4xl font-extrabold text-center mb-8 flex items-center justify-center gap-3 ${isNight ? 'text-green-300' : 'text-green-800'}`}>
                    <Sparkles className="animate-pulse" />
                    <span className="forest-title">Identify Yourself</span>
                </h2>

                <p className="text-center mb-10 opacity-80 font-medium">Create your animal spirit to begin the adventure...</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="block text-sm font-bold mb-2 ml-1 opacity-70 uppercase tracking-wider">Identity</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none text-lg ${isNight
                                    ? 'bg-slate-900/50 border-white/10 focus:border-green-400 text-white'
                                    : 'bg-white/50 border-green-100 focus:border-green-500 text-gray-800'
                                    }`}
                                placeholder="What animal are you?"
                                value={formData.species}
                                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                            />
                            <Leaf className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 ml-1 opacity-70 uppercase tracking-wider">Realm</label>
                            <select
                                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${isNight
                                    ? 'bg-slate-900/50 border-white/10 focus:border-green-400 text-white'
                                    : 'bg-white/50 border-green-100 focus:border-green-500 text-gray-800'
                                    }`}
                                value={formData.habitat}
                                onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                            >
                                <option value="land">🌲 Wild Lands</option>
                                <option value="water">🌊 Deep Waters</option>
                                <option value="trees">🌳 High Canopy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 ml-1 opacity-70 uppercase tracking-wider">Nature</label>
                            <select
                                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${isNight
                                    ? 'bg-slate-900/50 border-white/10 focus:border-green-400 text-white'
                                    : 'bg-white/50 border-green-100 focus:border-green-500 text-gray-800'
                                    }`}
                                value={formData.foodHabit}
                                onChange={(e) => setFormData({ ...formData, foodHabit: e.target.value })}
                            >
                                <option value="herbivore">🌿 Herbivore</option>
                                <option value="carnivore">🍖 Carnivore</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-4 ml-1 opacity-70 uppercase tracking-wider">Energy Cycle</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['diurnal', 'nocturnal'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, activityTime: type })}
                                    className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${formData.activityTime === type
                                        ? (isNight ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/30' : 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/30')
                                        : (isNight ? 'bg-slate-900/50 border-white/10 hover:border-white/30' : 'bg-white/50 border-green-100 hover:border-green-200')
                                        }`}
                                >
                                    {type === 'diurnal' ? <Sun size={20} /> : <Moon size={20} />}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 ml-1 opacity-70 uppercase tracking-wider">Spirit Trait</label>
                        <input
                            type="text"
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${isNight
                                ? 'bg-slate-900/50 border-white/10 focus:border-green-400 text-white'
                                : 'bg-white/50 border-green-100 focus:border-green-500 text-gray-800'
                                }`}
                            placeholder="e.g. Brave, Mysterious, Gentle"
                            value={formData.personality}
                            onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 rounded-2xl bg-green-600 hover:bg-green-700 border-4 border-green-800 text-white font-black text-xl flex items-center justify-center gap-3 tracking-widest uppercase active:scale-95 transition-transform shadow-xl"
                    >
                        <Compass className="animate-spin-slow" /> Awaken Spirit
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default Profile;
