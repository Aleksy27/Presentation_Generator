export interface Slide {
  id: string;
  title: string;
  content: string[];
  slideNumber: number;
}

export interface Presentation {
  title: string;
  slides: Slide[];
}

export interface PresentationState {
  presentation: Presentation | null;
  currentSlideIndex: number;
  isLoading: boolean;
  error: string | null;
}

