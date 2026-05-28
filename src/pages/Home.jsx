import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomeHero from '../components/organisms/HomeHero';
import HomeLevels from '../components/organisms/HomeLevels';
import HomeCampus from '../components/organisms/HomeCampus';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      {/* Header global */}
      <Navbar />

      {/* Main Content */}
      <main className="pb-16">
        
        {/* 1. Hero Section (Organism) */}
        <HomeHero 
          onStartJourney={() => navigate('/register')} 
          onLearnMore={() => navigate('/contact')} 
        />

        {/* 2. Educational Levels (Organism) */}
        <HomeLevels 
          onExploreLevels={() => navigate('/levels')} 
        />

        {/* 3. Campus Bento Grid & Gallery (Organism) */}
        <HomeCampus 
          onGalleryClick={() => navigate('/gallery')} 
        />

      </main>
    </div>
  );
};

export default Home;
