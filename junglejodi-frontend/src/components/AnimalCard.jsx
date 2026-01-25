import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';

const AnimalCard = ({ animal, isNight }) => {
    return (
        <motion.div
            className={`${isNight ? 'glass-card-dark text-white' : 'glass-card text-gray-800'} p-6 rounded-3xl relative overflow-hidden`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${isNight ? 'bg-indigo-950/50' : 'bg-green-100'}`}>
                    {animal.species === 'Rabbit' ? '🐰' : animal.species === 'Wolf' ? '🐺' : animal.species === 'Elephant' ? '🐘' : '🐾'}
                </div>
                <div>
                    <h3 className="text-xl font-black">{animal.species}</h3>
                    <p className="text-sm opacity-70 italic">{animal.personality}</p>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <div className="flex items-center gap-1 text-xs font-bold opacity-70 bg-black/5 px-2 py-1 rounded-lg">
                    <MapPin size={12} /> {animal.habitat}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold opacity-70 bg-black/5 px-2 py-1 rounded-lg">
                    <Zap size={12} /> {animal.activityTime}
                </div>
            </div>
        </motion.div>
    );
};

export default AnimalCard;
