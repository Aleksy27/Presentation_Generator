'use client';

import { useState, useEffect } from 'react';
import { Presentation } from '../types/presentation';
import Slide from './Slide';
import PresentationControls from './PresentationControls';

interface SlideViewerProps {
  presentation: Presentation;
}

export default function SlideViewer({ presentation }: SlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = presentation.slides[currentSlideIndex];
  const totalSlides = presentation.slides.length;

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex]);

  if (!currentSlide) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {presentation.title}
        </h1>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
      </div>

      <div className="bg-[#0f0f0f] p-8 rounded-lg mb-6">
        <Slide slide={currentSlide} isActive={true} />
      </div>

      <PresentationControls
        currentSlide={currentSlideIndex + 1}
        totalSlides={totalSlides}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={currentSlideIndex > 0}
        canGoNext={currentSlideIndex < totalSlides - 1}
      />
    </div>
  );
}

