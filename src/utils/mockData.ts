import { Presentation, Slide } from '../services/openaiService';

export const generateMockPresentation = (
  slideCount: number = 5,
  theme: string = 'party'
): Presentation => {
  const slides = generateMockSlides(slideCount);
  
  return {
    id: `mock-${Date.now()}`,
    title: getMockPresentationTitle(),
    slides,
    theme,
    createdAt: new Date()
  };
};

export const generateMockSlides = (count: number): Slide[] => {
  const mockSlideTemplates = [
    {
      title: 'Welcome!',
      content: 'Let the party begin!',
      emoji: '🎉',
      hasImage: false
    },
    {
      title: 'Fun Facts',
      content: 'Did you know penguins can jump 6 feet high?',
      emoji: '🐧',
      hasImage: true
    },
    {
      title: 'Mystery',
      content: '',
      emoji: '🔍',
      hasImage: true
    },
    {
      title: 'Dance Time',
      content: 'Show us your best moves!',
      emoji: '💃',
      hasImage: false
    },
    {
      title: 'Surprise',
      content: 'Plot twist incoming...',
      emoji: '😱',
      hasImage: true
    },
    {
      title: 'Adventure',
      content: '',
      emoji: '🗺️',
      hasImage: true
    },
    {
      title: 'Celebration',
      content: 'You made it to the end!',
      emoji: '🏆',
      hasImage: false
    },
    {
      title: 'Magic',
      content: 'Abracadabra!',
      emoji: '✨',
      hasImage: true
    },
    {
      title: 'Journey',
      content: '',
      emoji: '🚀',
      hasImage: true
    },
    {
      title: 'Victory',
      content: 'Champions never quit!',
      emoji: '🎯',
      hasImage: false
    }
  ];

  const slides: Slide[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = mockSlideTemplates[i % mockSlideTemplates.length];
    const slide: Slide = {
      id: i + 1,
      title: template.title,
      content: template.content,
      emoji: template.emoji,
      imageUrl: template.hasImage ? getMockImageUrl(template.title) : undefined
    };
    slides.push(slide);
  }
  
  return slides;
};

const getMockPresentationTitle = (): string => {
  const titles = [
    '🎪 Amazing Party Adventures',
    '🌟 Epic Fun Journey',
    '🎭 Spectacular Entertainment Show',
    '🎨 Creative Party Experience',
    '🎵 Musical Mystery Tour',
    '🎲 Random Fun Generator',
    '🎊 Celebration Spectacular',
    '🎈 Party Time Extravaganza'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

const getMockImageUrl = (title: string): string => {
  const imageMap: { [key: string]: string } = {
    'Fun Facts': 'https://picsum.photos/400/300?random=1',
    'Mystery': 'https://picsum.photos/400/300?random=2',
    'Surprise': 'https://picsum.photos/400/300?random=3',
    'Adventure': 'https://picsum.photos/400/300?random=4',
    'Magic': 'https://picsum.photos/400/300?random=5',
    'Journey': 'https://picsum.photos/400/300?random=6'
  };
  
  return imageMap[title] || `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`;
};

export const getMockPresentations = () => {
  return {
    short: generateMockPresentation(3, 'party'),
    medium: generateMockPresentation(5, 'neon'),
    long: generateMockPresentation(8, 'sunset'),
    imageHeavy: {
      ...generateMockPresentation(4, 'ocean'),
      slides: generateMockSlides(4).map(slide => ({
        ...slide,
        imageUrl: getMockImageUrl(slide.title)
      }))
    },
    textOnly: {
      ...generateMockPresentation(4, 'forest'),
      slides: generateMockSlides(4).map(slide => ({
        ...slide,
        imageUrl: undefined
      }))
    }
  };
};

export const mockPresentationScenarios = {
  'Quick Demo (3 slides)': () => getMockPresentations().short,
  'Standard Party (5 slides)': () => getMockPresentations().medium,
  'Extended Show (8 slides)': () => getMockPresentations().long,
  'Image Heavy': () => getMockPresentations().imageHeavy,
  'Text Only': () => getMockPresentations().textOnly,
  'Random Mix': () => generateMockPresentation(
    Math.floor(Math.random() * 6) + 3, // 3-8 slides
    ['party', 'neon', 'sunset', 'ocean', 'forest'][Math.floor(Math.random() * 5)]
  )
};
