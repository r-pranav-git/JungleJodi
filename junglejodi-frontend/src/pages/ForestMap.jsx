import React from 'react';
import { motion } from 'framer-motion';
import { Map, Zap } from 'lucide-react';

const ForestMap = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 h-full text-white text-center">
            <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="p-8 glass-card mb-6"
            >
                <Map size={80} className="text-emerald-300 opacity-80" />
            </motion.div>
            <h2 className="text-4xl font-serif font-bold mb-4">The Forest Map</h2>
            <p className="text-xl opacity-70 max-w-md mx-auto">
                Explore the different zones of the JungleJodi ecosystem.
                <br />
                <span className="text-sm italic mt-2 block text-yellow-300/80">(Coming soon: Real-time zones!)</span>
            </p>

            <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-2xl opacity-50 pointer-events-none">
                {['Riverbank', 'Canopy', 'Cave System', 'Meadows'].map((zone) => (
                    <div key={zone} className="border border-white/20 rounded-xl p-6 flex flex-col items-center gap-2">
                        <Zap size={24} />
                        <span className="uppercase tracking-widest font-bold">{zone}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForestMap;
