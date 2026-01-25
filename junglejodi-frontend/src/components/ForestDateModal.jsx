import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import { X, TreePine, Waves, Moon, Sparkles } from 'lucide-react';

const InteractionModal = ({ match, onClose }) => {
    const { interact, theme } = useAppStore();
    const isNight = theme === 'night';

    const activities = [
        { name: 'Tree-top Swing', icon: <TreePine />, color: 'from-emerald-400 to-green-600' },
        { name: 'Riverbank Walk', icon: <Waves />, color: 'from-blue-400 to-cyan-600' },
        { name: 'Moonlight Hunt', icon: <Moon />, color: 'from-indigo-600 to-violet-800' },
    ];

    const handleInteract = (type) => {
        interact(type, match.species);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className={`${isNight ? 'glass-card-dark text-white' : 'glass-card text-gray-800'} p-10 max-w-lg w-full shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden`}
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-2xl transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center text-green-400 animate-bounce">
                        <Sparkles size={40} />
                    </div>

                    <div>
                        <h2 className="text-4xl font-black mb-2 tracking-tight">Bonding Ritual</h2>
                        <p className="opacity-70 font-bold uppercase tracking-widest text-xs">Connecting with {match.species}</p>
                    </div>

                    <div className="w-full space-y-4">
                        {activities.map((act) => (
                            <button
                                key={act.name}
                                onClick={() => handleInteract(act.name)}
                                className={`w-full p-6 bg-gradient-to-r ${act.color} rounded-x-2xl rounded-3xl flex items-center gap-6 font-black text-xl text-white shadow-xl transition-all hover:scale-[1.03] active:scale-95 group relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="p-3 bg-white/20 rounded-2xl shadow-inner group-hover:rotate-12 transition-transform">{act.icon}</span>
                                <span className="tracking-wide">{act.name}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all uppercase text-[10px] bg-black/20 px-3 py-1 rounded-full">Select</div>
                            </button>
                        ))}
                    </div>

                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">The forest spirits are watching...</p>
                </div>
            </motion.div>
        </div>
    );
};

export default InteractionModal;
