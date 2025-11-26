import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCards = () => {
    const features = [
        {
            to: '/main-game/childhood',
            image: '/assets/main-game-ss.png',
            title: 'Interactive Story Game',
            description: 'Play a Interactive Story game consisting of different choices and visuals'
        },
        {
            to: '/forum',
            image: '/assets/forum-ss.png',
            title: 'Sudo: Anti-Drug Forum',
            description: 'Connect with people who are fighting against drugs and Councillors'
        },
        {
            to: '/dynamic-game',
            image: '/assets/dynamic-game-ss.png',
            title: 'Dynamic Game',
            description: 'Every time experience a new story line with Sudo AI'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-lg flex flex-col items-center justify-center gap-6 px-4 py-12 pb-32 md:py-20 md:pb-20">
            <h1 className="text-white font-[Lora] text-3xl md:text-5xl font-bold text-center mb-4 drop-shadow-lg">
                What's New?
            </h1>

            <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center md:items-stretch w-full max-w-6xl gap-6 md:gap-8">
                {features.map((feature, index) => (
                    <Link
                        to={feature.to}
                        key={index}
                        className="group flex flex-col items-center justify-between w-full md:flex-1 md:min-w-[280px] md:max-w-sm bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-2xl p-6 md:p-7 border border-white/10 transition-all duration-300 ease-in-out hover:scale-105 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(14,223,35,0.3)] cursor-pointer transform"
                    >
                        <div className="w-full mb-5">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full h-28 md:h-44 object-cover rounded-xl border border-white/20 group-hover:border-green-400/40 transition-all duration-300"
                            />
                        </div>

                        <h3 className="text-white font-[Poppins] text-lg md:text-2xl font-bold mb-3 text-center leading-tight group-hover:text-green-400 transition-colors duration-300">
                            {feature.title}
                        </h3>

                        <p className="text-gray-300 font-[Poppins] text-sm md:text-base font-medium text-center leading-relaxed group-hover:text-white transition-colors duration-300">
                            {feature.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeatureCards;
