// components/homepage/HeroSection.tsx
import React from 'react';
import EnhancedHeroSection from './EnhancedHeroSection';

// Main HeroSection component that wraps the enhanced version
const HeroSection: React.FC = () => {
    return (
        <EnhancedHeroSection 
            heroText={{
                title: 'Trusted Professional Movers',
                subtitle: 'Your Reliable Moving Partner',
                description: 'We support businesses and families through periods of expansion, relocation, and all other important transitions with professional excellence.'
            }}
            autoSlideInterval={6000}
            enableTextEditing={false}
        />
    );
};

export default HeroSection;
