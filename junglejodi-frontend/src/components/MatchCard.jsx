import useStore from '../store/useStore';
import { Heart, Activity, MapPin, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const MatchCard = ({ match, onInteract }) => {
    const { theme } = useStore();
    const isNight = theme === 'night';

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${isNight ? 'glass-card-dark text-white' : 'glass-card text-gray-800'} p-8 relative group cursor-pointer transition-all duration-500`}
        >
            <div className="absolute top-4 right-4 text-xs font-black uppercase tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">
                ID: {match.id.slice(-4)}
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transition-transform group-hover:rotate-6 duration-500 ${isNight ? 'bg-indigo-950/50 shadow-indigo-500/20' : 'bg-emerald-50 shadow-emerald-500/10'}`}>
                        {match.species === 'Rabbit' ? '🐰' : match.species === 'Wolf' ? '🐺' : match.species === 'Elephant' ? '🐘' : '🐾'}
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full text-white shadow-lg"
                    >
                        <ShieldCheck size={16} />
                    </motion.div>
                </div>

                <div>
                    <h3 className="text-2xl font-black tracking-tight mb-1">{match.species}</h3>
                    <p className="text-sm opacity-70 italic font-medium">"{match.personality || 'A mysterious beast...'}"</p>
                </div>

                <div className="flex gap-4 w-full">
                    <div className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 ${isNight ? 'bg-white/5' : 'bg-black/5'}`}>
                        <MapPin size={16} className="text-green-500" />
                        <span className="text-[10px] font-bold uppercase opacity-60">Realm</span>
                        <span className="text-xs font-black">{match.habitat}</span>
                    </div>
                    <div className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 ${isNight ? 'bg-white/5' : 'bg-black/5'}`}>
                        <Zap size={16} className="text-yellow-500" />
                        <span className="text-[10px] font-bold uppercase opacity-60">Energy</span>
                        <span className="text-xs font-black">{match.activityTime}</span>
                    </div>
                </div>

                <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                        <span className="opacity-60 text-[10px]">Compatibility</span>
                        <span className="text-green-400">{match.compatibility}%</span>
                    </div>
                    <div className={`w-full ${isNight ? 'bg-white/10' : 'bg-black/5'} h-3 rounded-full overflow-hidden p-[2px]`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${match.compatibility}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full"
                        />
                    </div>
                </div>

                <button
                    onClick={() => onInteract(match)}
                    className="w-full py-4 rounded-2xl btn-premium text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 group/btn active:scale-95"
                >
                    <Heart size={20} className="group-hover/btn:fill-white transition-all" />
                    Bond Now
                </button>
            </div>
        </motion.div>
    );
};

export default MatchCard;
