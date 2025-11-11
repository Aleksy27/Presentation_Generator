import { Presentation, Slide } from '../types/presentation';

export function parsePresentationFromText(text: string, title: string): Presentation {
  const slides: Slide[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentSlide: Partial<Slide> | null = null;
  let slideNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const slideMatch = line.match(/^(?:SLIDE|SLajd|Slajd|Slide)\s*(\d+)[:\-\.]?\s*(.+)?/i) || 
                       line.match(/^#+\s+(.+)/) ||
                       line.match(/^(?:Slajd|Slide)\s+(\d+)[:\-\.]?\s*(.+)?/i);
    
    if (slideMatch) {
      if (currentSlide && currentSlide.title) {
        slides.push({
          id: `slide-${slideNumber}`,
          title: currentSlide.title,
          content: currentSlide.content || [],
          slideNumber: slideNumber++,
        });
      }
      
      const slideNum = slideMatch[1] ? parseInt(slideMatch[1]) : slideNumber;
      const slideTitle = slideMatch[2] || slideMatch[1] || '';
      
      if (!slideTitle && i + 1 < lines.length && !lines[i + 1].match(/^[-*•\d]/)) {
        currentSlide = {
          title: lines[i + 1].trim(),
          content: [],
        };
        i++;
      } else {
        currentSlide = {
          title: slideTitle.trim() || `Slajd ${slideNum}`,
          content: [],
        };
      }
    }
    else if (line.match(/^[-*•]\s+/) || line.match(/^\d+[\.\)]\s+/) || line.match(/^[\u2022\u2023\u25E6\u2043\u2219]\s+/)) {
      if (currentSlide) {
        const content = line.replace(/^[-*•\u2022\u2023\u25E6\u2043\u2219]\s+/, '')
                            .replace(/^\d+[\.\)]\s+/, '')
                            .trim();
        if (content && !currentSlide.content) {
          currentSlide.content = [];
        }
        if (content) {
          currentSlide.content!.push(content);
        }
      } else {
        currentSlide = {
          title: title || 'Slajd 1',
          content: [line.replace(/^[-*•\u2022\u2023\u25E6\u2043\u2219]\s+/, '').replace(/^\d+[\.\)]\s+/, '').trim()],
        };
      }
    }
    else if (!currentSlide && line.length > 0 && line.length < 100 && !line.match(/^[a-z]/)) {
      currentSlide = {
        title: line,
        content: [],
      };
    }
    else if (currentSlide && !currentSlide.title && line.length > 0) {
      currentSlide.title = line;
    }
    else if (currentSlide && line.length > 0 && !line.match(/^(SLIDE|SLajd|Slajd|Slide)\s*\d+/i)) {
      if (!currentSlide.content) {
        currentSlide.content = [];
      }
      if (line.length < 200) {
        currentSlide.content.push(line);
      }
    }
  }

  if (currentSlide && currentSlide.title) {
    slides.push({
      id: `slide-${slideNumber}`,
      title: currentSlide.title,
      content: currentSlide.content || [],
      slideNumber: slideNumber,
    });
  }

  if (slides.length === 0) {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    slides.push({
      id: 'slide-1',
      title: title || 'Prezentacja',
      content: paragraphs.slice(0, 5),
      slideNumber: 1,
    });
  }

  return {
    title: title || 'Prezentacja',
    slides: slides.length > 0 ? slides : [
      {
        id: 'slide-1',
        title: 'Slajd 1',
        content: ['Brak zawartości'],
        slideNumber: 1,
      },
    ],
  };
}

export function parsePresentationFromJSON(jsonString: string): Presentation | null {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.slides && Array.isArray(data.slides)) {
      const slides: Slide[] = data.slides.map((slide: any, index: number) => ({
        id: slide.id || `slide-${index + 1}`,
        title: slide.title || `Slajd ${index + 1}`,
        content: Array.isArray(slide.content) ? slide.content : [slide.content || ''],
        slideNumber: index + 1,
      }));

      return {
        title: data.title || 'Prezentacja',
        slides,
      };
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  return null;
}

