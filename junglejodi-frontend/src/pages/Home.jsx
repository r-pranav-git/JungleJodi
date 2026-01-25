import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Heart, Sparkles, PawPrint } from "lucide-react";
import useAppStore from "../store/useAppStore";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAppStore();

    const handleEnter = () => {
        if (user) navigate("/matches");
        else navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6 font-sans text-gray-800">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
                        <PawPrint size={16} />
                        The #1 Dating App for Animals
                    </div>

                    <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
                        Keep Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                            Wild Heart
                        </span>{" "}
                        Beating.
                    </h1>

                    <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                        A creative platform built on ecological compatibility. Find your perfect match based on habitat, food chain, and forest roles.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={handleEnter}
                            className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-gray-200 transition-all hover:-translate-y-1"
                        >
                            Start Matching
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigate("/profile")}
                            className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 px-8 py-4 rounded-full font-bold text-lg shadow-sm transition-all"
                        >
                            Create Profile
                        </button>
                    </div>

                    <div className="flex items-center gap-8 pt-8 opacity-70">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">🦁</div>
                            ))}
                        </div>
                        <p className="text-sm font-medium">Join 2,000+ happy couples</p>
                    </div>
                </motion.div>

                {/* RIGHT FEATURE CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    {/* Decorative blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-bf from-emerald-200/40 to-green-200/40 blur-3xl rounded-full -z-10" />

                    <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-white/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[3rem] -z-0" />

                        <h3 className="text-3xl font-bold mb-8 relative z-10">Why Choose Us?</h3>

                        <div className="grid gap-6 relative z-10">
                            {[
                                { icon: <Leaf className="text-emerald-600" />, title: "Eco-Compatibility", desc: "Matches based on natural habitats." },
                                { icon: <Heart className="text-rose-500" />, title: "True Connection", desc: "No swipes, just meaningful forest quests." },
                                { icon: <Sparkles className="text-amber-500" />, title: "Playful Stories", desc: "Express yourself through narrative." }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{feature.title}</h4>
                                        <p className="text-gray-500 leading-snug">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 bg-gray-900 text-white p-6 rounded-3xl flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Success Story</p>
                                <p className="font-bold">"Found my den-mate!"</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">👋</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
