import React from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';

const TeamSection = () => {
    const teamMembers = [
        {
            name: "Raunak Kumar Gupta",
            title: "Full Stack Developer",
            handle: "raunakgupta",
            status: "Student",
            contactText: "Connect",
            avatarUrl: "/assets/rkg-1.png",
            miniAvatarUrl: "/assets/rkg.jpg",
            linkedIn: "https://www.linkedin.com/in/raunak-kumar-gupta-7b3503270/"
        },
        {
            name: "Piyush Chaudhary",
            title: "Backend Developer",
            handle: "piyush",
            status: "Student",
            contactText: "Contact",
            avatarUrl: "/assets/lol.png",
            miniAvatarUrl: "/assets/lol.png",
            linkedIn: "https://www.linkedin.com/in/piyush-chaudhary-9b5999187/"
        }
    ];

    return (
        <div
            id="aboutTeam"
            className="min-h-screen bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-lg flex flex-col items-center justify-center px-4 py-16 md:py-20"
        >
            <h1 className="text-white font-[Lora] text-3xl md:text-5xl font-bold text-center mb-12 flex items-center justify-center gap-3 drop-shadow-lg">
                About Our Team:
                <img src="/assets/sudo.png" className="h-10 md:h-12" alt="Sudo" />
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl px-4">
                {teamMembers.map((member, index) => (
                    <div key={index} className="flex justify-center">
                        <ProfileCard
                            name={member.name}
                            title={member.title}
                            handle={member.handle}
                            status={member.status}
                            contactText={member.contactText}
                            avatarUrl={member.avatarUrl}
                            miniAvatarUrl={member.miniAvatarUrl}
                            enableTilt={true}
                            onContactClick={() => window.open(member.linkedIn, '_blank')}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamSection;
