import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function PresentationControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: PresentationControlsProps) {
  return (
    <div className="flex justify-between items-center bg-[#0f0f0f] rounded-lg w-full mt-6 p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="inline-block size-5 mr-1" /> Poprzedni
        </button>
      </div>
      
      <div className="text-lg">
        Slajd {currentSlide} / {totalSlides}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Następny <ArrowRight className="inline-block size-5 ml-1" />
        </button>
      </div>
    </div>
  );
}

