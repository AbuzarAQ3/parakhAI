// src/features/landing/pages/HomePage.jsx
import react from 'react'
import Hero from '../sections/Hero';
import TrustBar from '../sections/TrustBar';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import CTASection from '../sections/CTASection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <CTASection />
    </>
  );
};

export default HomePage;