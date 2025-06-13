import React from 'react';
import About from './About';

const features = [
  {
    title: "🌍 Immersive 2D World",
    description: "Explore beautifully crafted pixel-style environments that provide a nostalgic yet innovative virtual space. Move through cities, landscapes, and creative spaces as if you're inside a living, breathing 2D world.",
    image: "/_3b706551-142e-4ba1-a119-e23466ce07be.jpg",
    gradient: "from-[#1f1c2c] to-[#928dab]",
    shadow: "shadow-[0_0_25px_#928dab]",
    gradient2: "from-[#00ff99] via-[#00bfff] to-[#6a00ff]",
  },
  {
    title: "🧑‍🤝‍🧑 Real-Time Multiplayer",
    description: "Interact with friends and players from around the globe in real time using seamless WebSocket/Socket.IO integration. Walk, chat, emote, or team up inside the virtual world.",
    image: "/design.png",
    gradient: "from-[#16222a] to-[#3a6073]",
    shadow: "shadow-[0_0_25px_#3a6073]",
    gradient2: "from-pink-500 via-purple-500 to-blue-500",
  },
  {
    title: "💬 Integrated Chat App",
    description: "Never feel alone. Use our built-in chat system to send direct messages or group texts instantly. Emoji reactions, typing indicators, and real-time sync make the conversation lively.",
    image: "/15762571.png",
    gradient: "from-[#283048] to-[#859398]",
    shadow: "shadow-[0_0_25px_#859398]",
    gradient2: "from-red-400 via-yellow-300 to-pink-500",
  },
  {
    title: "🎥 Seamless Video Calling",
    description: "Bring your conversations to life with high-quality video calls. Whether it’s a casual hangout or a serious meeting, our integrated video chat bridges the gap between reality and the virtual world.",
    image: "/4637935.png",
    gradient: "from-[#4b6cb7] to-[#182848]",
    shadow: "shadow-[0_0_25px_#4b6cb7]",
    gradient2: "from-sky-400 via-indigo-500 to-cyan-400",
  },
];

const HeroSection2 = () => {
  return (
    <>
    <section className="bg-black min-h-screen py-20 px-6 text-white">
      {/* Section Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center leading-tight">
        What Makes{" "}
        <span className="bg-gradient-to-r from-[#00ff99] via-[#00bfff] to-[#6a00ff] text-transparent bg-clip-text">
          Metaverse
        </span>{" "}
        Unique?
      </h2>

      {/* Feature Blocks */}
      <div className="max-w-7xl mx-auto space-y-20 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${feature.gradient} ${feature.shadow} p-[3px] h-190 sm:h-150 rounded-xl transition-transform duration-300 hover:scale-[1.02]`}
          >
            <div className="bg-[#121212] rounded-xl p-6 flex flex-col md:flex-row items-center  h-190 sm:h-150 ">
              {/* Text Left */}
              <div className="w-full h-150  md:w-1/2">
                <h3 className={`bg-gradient-to-r ${feature.gradient2} text-transparent bg-clip-text sm:pt-20  text-2xl font-bold`}>{feature.title}</h3>
                <p className=" pt-10 text-gray-300 font-sans font-semibold text-lg">{feature.description}</p>
              </div>

              {/* Image Right */}
              <div className="w-full md:w-1/2 flex justify-center transition transform duration-200 hover:scale-110">
              <div className='p-[1px] bg-gradient-to-r from-pink-400 via-amber-400 to-emerald-400 rounded-xl'>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="bg-black/90 w-full max-w-sm rounded-xl object-contain"
                />
                </div>
              </div>
              </div>
            </div>
          
        ))}
      </div>
    </section>
    {/* <About/> */}
    </>
  );
};

export default HeroSection2;
