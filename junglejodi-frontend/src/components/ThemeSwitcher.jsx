import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useStore();

    const themes = [
        { id: 'spring', label: 'Spring', emoji: '🌸', color: 'bg-green-400/20' },
        { id: 'monsoon', label: 'Monsoon', emoji: '🌧️', color: 'bg-blue-400/20' },
        { id: 'night', label: 'Night', emoji: '🌙', color: 'bg-indigo-400/20' }
    ];

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-4 z-[100] p-2 glass-card-dark rounded-full">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative px-6 py-3 rounded-full transition-all duration-500 flex items-center gap-2 font-black uppercase tracking-widest text-xs overflow-hidden ${theme === t.id ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {theme === t.id && (
                        <motion.div
                            layoutId="activeTheme"
                            className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/40"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{t.emoji}</span>
                    <span className="relative z-10 hidden md:block">{t.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
