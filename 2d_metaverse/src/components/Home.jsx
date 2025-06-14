import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSection from './HeroSection';
import { useThemeStore } from '../store/useThemestore';
import { useEffect } from 'react';
import About from './About';
import HeroSection2 from './HeroSection2';
const Home = () => {
  const {sectionTarget,setSectionTarget}  = useThemeStore();
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    console.log(sectionTarget);
    if (sectionTarget === 'about') {
      ref2.current?.scrollIntoView({ behavior: 'smooth' });
    } else if(sectionTarget ==='home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if(sectionTarget === 'learn'){
      ref3.current?.scrollIntoView({behavior: 'smooth'});
    }
    setTimeout(()=>setSectionTarget(""),100);
  }, [sectionTarget!==""]);


  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  return (
    <>
      {/* SECTION TO ANIMATE */}
      <div ref={ref} className='w-full h-screen overflow-hidden relative grid place-items-center pt-20'>

        <motion.h1
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 50, delay: 0.3 }}
        className="mt-[-20rem] text-7xl md:text-9xl font-extrabold z-20 relative bg-clip-text text-center"
        style={{
            backgroundImage: 'linear-gradient(to right, #facc15, #4ade80, #3b82f6)',
            backgroundSize: '200% auto',
            backgroundPosition: '0% center',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Caprasimo', serif",
            textShadow: '0 0 4px rgba(0, 0, 0, 0.8), 1px 1px 2px #000',
            animation: 'shine 6s linear infinite',
            y:textY
        }}
        >
        Enter the Metaverse
        </motion.h1>


        {/* Background Image */}
        <motion.div
          className='absolute inset-0 z-0 transform-gpu'
          style={{
            y: backgroundY,
            backgroundImage: `url(/_9ac7235d-b230-4092-ad1e-df458809bf99.jpg)`,
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
            
            
          }}
        ></motion.div>

        {/* Man Layer */}
        <motion.div
          className='absolute inset-0 z-20 transform-gpu'
          style={{
            backgroundImage: `url(/man.png)`,
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
            filter: 'brightness(0%)'
          }}
        ></motion.div>
      </div>

      <HeroSection/>
      <div ref ={ref3}>
      <HeroSection2/>
      </div>
      <div ref={ref2}>
        <About/>
      </div>
    </>
  );
};

export default Home;
