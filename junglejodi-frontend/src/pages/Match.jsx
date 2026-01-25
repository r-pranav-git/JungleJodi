import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import MatchCard from '../components/MatchCard';
import ForestDateModal from '../components/ForestDateModal';

const Match = () => {
    const { user, matches, fetchMatches, isLoading } = useAppStore();
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchMatches(user.id);
        }
    }, [user, fetchMatches]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <p>Please create a profile first.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto pb-20">
            <header className="text-center mb-16 relative">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-4 glass-card mb-6"
                >
                    <Sparkles size={32} className="text-green-400 animate-pulse" />
                </motion.div>
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-7xl font-black mb-4 drop-shadow-2xl font-serif text-white"
                >
                    Hi, <span className="text-green-300 italic">{user.species}</span>!
                </motion.h1>
                <p className="text-xl text-white/80 font-bold uppercase tracking-[0.3em] ml-1">The Realm Awaits</p>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-32 gap-6 glass-card shadow-2xl mx-auto max-w-lg">
                    <div className="relative">
                        <Loader2 className="animate-spin text-green-400" size={64} />
                        <div className="absolute inset-0 blur-xl bg-green-400/30 animate-pulse rounded-full" />
                    </div>
                    <p className="text-white font-black text-2xl tracking-widest uppercase text-glow">Channeling Ecosystem Spirits...</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4"
                >
                    <AnimatePresence>
                        {matches.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                onInteract={setSelectedMatch}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {matches.length === 0 && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card-dark p-20 text-center text-white relative overflow-hidden mx-auto max-w-3xl"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertCircle size={120} />
                    </div>
                    <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">The Wild is Silent</h3>
                    <p className="text-lg opacity-60 font-bold max-w-md mx-auto">No compatible matches found in this realm. Try switching forest modes or wait for a nomad to pass through.</p>
                </motion.div>
            )}

            <AnimatePresence>
                {selectedMatch && (
                    <ForestDateModal
                        match={selectedMatch}
                        onClose={() => setSelectedMatch(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Match;
