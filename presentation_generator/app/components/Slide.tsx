import { Slide as SlideType } from '../types/presentation';
import React from 'react';

interface SlideProps {
  slide: SlideType;
  isActive?: boolean;
}

function parseBoldText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    parts.push(
      <strong key={key++} className="font-bold">
        {match[1]}
      </strong>
    );
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function Slide({ slide, isActive = false }: SlideProps) {
  return (
    <div
      className={`
        w-full h-full min-h-[600px] p-12 bg-white rounded-lg shadow-xl
        flex flex-col justify-center items-start
        transition-all duration-300
        ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}
      `}
    >
      <div className="mb-8">
        <span className="text-sm text-gray-500 font-mono">
          Slajd {slide.slideNumber} / 
        </span>
      </div>
      
      <h2 className="text-4xl font-bold text-gray-900 mb-8">
        {parseBoldText(slide.title)}
      </h2>
      
      <ul className="space-y-4 text-xl text-gray-700 list-disc list-inside">
        {slide.content.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {parseBoldText(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

