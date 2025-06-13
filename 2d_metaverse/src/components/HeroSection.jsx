import React from 'react'
import HeroSection2 from './HeroSection2'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router'
import { useThemeStore } from '../store/useThemestore'
const HeroSection = () => {
  const {authUser} = useAuthStore();
  const {setSectionTarget} = useThemeStore();

  const handleToView = ()=>{
    setSectionTarget('learn');
  }
  return (
    <>
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
  {/* Title and Subtitle */}
  <div className="z-10 text-center mt-20 px-6">
    <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
      Explore the{" "}
      <span className="bg-gradient-to-r from-yellow-300 via-green-400 to-blue-500 text-transparent bg-clip-text">
        Metaverse
      </span>
    </h1>
    <p className="mt-4 text-lg text-white/90">
      Dive into a pixel-perfect 2D adventure island
    </p>

    <div className="mt-6 flex justify-center gap-4">
      {authUser && <Link to="/map" className="px-6 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
        Enter Now
      </Link>}
      {!authUser && <Link to ="/Signup" className="px-6 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
        SignUp
      </Link>}
      <button onClick={()=>handleToView()} className="px-6 py-2 rounded border border-white text-white font-semibold hover:bg-white hover:text-black transition">
        Learn More
      </button>
    </div>
  </div>

  {/* Image below the content */}
        <div className="p-2 z-0 mt-10 flex justify-center">
        <div className="p-[1px] bg-gradienrounded-2xl">
             <div className="animate-[pulse-glow_1s_infinite] p-[4px] bg-gradient-to-r from-[#EDE342] via-[#2c5364] to-[#00c9ff] rounded-2xl shadow-[0_0_20px_#00c9ff]">
            <img
                src="/Pellet Town.png"
                alt="2D Island"
                className=" sm:w-full sm:h-100 rounded-2xl object-contain"
            />
            </div>
        </div>
        </div>
</section>
 {/* <HeroSection2/> */}
    </>

  )
}
export default HeroSection