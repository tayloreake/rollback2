// components/homepage/EditableHeroDemo.tsx
import React, { useState } from 'react';
import EnhancedHeroSection from './EnhancedHeroSection';

interface HeroTextContent {
  title: string;
  subtitle: string;
  description: string;
}

const EditableHeroDemo: React.FC = () => {
  const [heroText, setHeroText] = useState<HeroTextContent>({
    title: 'Trusted Professional Movers',
    subtitle: 'Your Reliable Moving Partner',
    description: 'We support businesses and families through periods of expansion, relocation, and all other important transitions with professional excellence.'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (newText: HeroTextContent) => {
    setHeroText(newText);
  };

  const saveChanges = () => {
    // Here you could save the changes to your CMS, database, or local storage
    console.log('Saving hero text changes:', heroText);
    setIsEditing(false);
    
    // Example: Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('heroText', JSON.stringify(heroText));
    }
  };

  const resetToDefault = () => {
    setHeroText({
      title: 'Trusted Professional Movers',
      subtitle: 'Your Reliable Moving Partner',
      description: 'We support businesses and families through periods of expansion, relocation, and all other important transitions with professional excellence.'
    });
  };

  return (
    <div className="relative">
      {/* Edit Controls */}
      {isEditing && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border">
          <h3 className="font-semibold mb-3">Edit Hero Content</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={saveChanges}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={resetToDefault}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* Toggle Edit Mode Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          Edit Hero Text
        </button>
      )}

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection
        heroText={heroText}
        autoSlideInterval={7000}
        enableTextEditing={isEditing}
        onTextChange={handleTextChange}
      />
    </div>
  );
};

export default EditableHeroDemo;