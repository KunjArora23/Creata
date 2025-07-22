import React from 'react'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import HowItWorksSection from '../sections/HowItWorksSection'
import WhyUseSection from '../sections/WhyUseSection'
import FeaturesSection from '../sections/FeaturesSection'
import CallToActionSection from '../sections/CallToActionSection'
import FooterSection from '../sections/FooterSection'

function HomePage() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <HowItWorksSection />
            <WhyUseSection />
            <CallToActionSection />
            <FooterSection />
        </>
    )
}

export default HomePage