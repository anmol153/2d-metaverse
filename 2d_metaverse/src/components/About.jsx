import React from "react";

const About = () => {
  return (
    <section className="bg-[#0d0d0d] text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        <h2 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
            About 2D Metaverse
          </span>
        </h2>

        <p className="text-lg text-gray-300 leading-8">
          Welcome to <span className="text-white font-semibold">2D Metaverse</span> — a vibrant, immersive 2D virtual world where imagination meets interaction. 
          Designed for modern explorers, developers, and gamers, our platform blends pixel-perfect aesthetics with real-time technology 
          to deliver a unique social experience like no other.
        </p>

        {/* First Row of Features */}
        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#161616] p-6 rounded-xl border border-gray-700 hover:shadow-lg transition duration-300 max-w-3xl">
            <h3 className="text-xl font-semibold text-teal-400 mb-3">🌐 Immersive 2D Environment</h3>
            <p className="text-gray-300">
              Explore a beautifully crafted pixel-art world filled with interactive locations and rich visuals that draw you in.
            </p>
          </div>
          <div className="bg-[#161616] p-6 rounded-xl border border-gray-700 hover:shadow-lg transition duration-300 max-w-3xl">
            <h3 className="text-xl font-semibold text-pink-400 mb-3">🧑‍🤝‍🧑 Real-Time Interaction</h3>
            <p className="text-gray-300">
              Connect with others using instant multiplayer chat and movement, powered by WebSocket/Socket.IO.
            </p>
          </div>
        </div>

        {/* Centered Single Feature */}
        <div className="mt-10 max-w-xl mx-auto text-left">
          <div className="bg-[#161616] p-6 rounded-xl border border-gray-700 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">📹 Video & Chat Features</h3>
            <p className="text-gray-300">
              Talk face-to-face or message friends in real-time with our integrated communication suite built for connection and fun.
            </p>
          </div>
        </div>

        <p className="text-gray-400 pt-10 max-w-3xl mx-auto">
          Whether you're here to make friends, host events, or just explore, Metaverse is your digital playground — limitless, creative, and ever-evolving.
        </p>
      </div>
    </section>
  );
};

export default About;
