```
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <>
            <div className="tag-line">
                <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center px-4 sm:px-6 md:px-8 mb-2 sm:mb-3 md:mb-4 font-lora">
                    Empower Your Future:
                </h2>
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center px-4 sm:px-6 md:px-8 my-4 sm:my-6 md:my-8 font-lora">
                    Choose Life
                </h1>
                <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center px-4 sm:px-6 md:px-8 mt-2 sm:mt-3 md:mt-4 font-lora">
                    Not Drugs
                </h2>
                <p 
                    className="description max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-center px-4 sm:px-6 md:px-8 mt-8 sm:mt-12 md:mt-16 lg:mt-20 leading-relaxed sm:leading-loose text-white font-poppins" 
                    id="Description"
                >
                    Experience this storyline play-through to learn more about the effects of drugs on your body and how to
                    avoid them.
                    <br />
                    Every <strong className="font-lora text-xl sm:text-2xl md:text-3xl font-bold">Choice </strong>Matters in this play-through.
                    <br />
                    try to make the right choices to get the best ending.
                    <br />
                    <br />
                </p>
            </div>

            <div className="game-redirect-container">
                <h2 className="text-white font-lora text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 md:mb-5 text-center">
                    Ready?
                </h2>
                <ul className="rules list-disc flex flex-col w-4/5 sm:w-3/5 md:w-3/5 justify-center mb-2 sm:mb-4 md:mb-5 text-white">
                    <li className="mb-1 sm:mb-2 md:mb-5 font-lora text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-left">
                        Game Have 4 stages
                    </li>
                    <li className="mb-1 sm:mb-2 md:mb-5 font-lora text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-left">
                        Every stage have its own choices
                    </li>
                    <li className="mb-1 sm:mb-2 md:mb-5 font-lora text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-left">
                        Your Choices will shape the further story of Game
                    </li>
                    <li className="mb-1 sm:mb-2 md:mb-5 font-lora text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-left">
                        Game is Best Played in Full-Screen
                    </li>
                    <li className="mb-1 sm:mb-2 md:mb-5 font-lora text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-left">
                        You can turn off story teller from Menu
                    </li>
                </ul>
                <Link 
                    to="/main-game/childhood" 
                    className="play-game game-redirect no-underline text-white text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-center py-2 px-4 sm:py-3 sm:px-5 md:py-4 md:px-6 rounded-lg border-2 sm:border-3 border-white transition-all duration-300 bg-gradient-to-br from-[#0edf23] to-[#0ba91c] hover:scale-105 shadow-[0_0_15px_#0edf23] hover:shadow-[0_0_25px_#0edf23]"
                >
                    Start Game
                </Link>
            </div>
        </>
    );
};

export default HeroSection;
```
