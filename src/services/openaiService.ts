export interface Slide {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  emoji: string;
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  theme: string;
  createdAt: Date;
}

const OPENAI_API_BASE = 'https://api.openai.com/v1';

export const generatePresentation = async (
  apiKey: string,
  topics: string[],
  slideCount: number,
  theme: string
): Promise<Presentation> => {
  try {
    const presentationTitle = await generatePresentationTitle(apiKey, topics);
    const slides = await generateSlides(apiKey, topics, slideCount, theme, presentationTitle);
    
    return {
      id: Date.now().toString(),
      title: presentationTitle,
      slides,
      theme,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('Failed to generate presentation. Please check your API key and try again.');
  }
};

const generatePresentationTitle = async (apiKey: string, topics: string[]): Promise<string> => {
  const topicsText = topics.length > 0 
    ? `incorporating these topics: ${topics.join(', ')}` 
    : 'with completely random topics';

  const prompt = `Generate a fun, catchy title for a party presentation ${topicsText}. 
    The title should be entertaining, memorable, and suitable for a party or icebreaker game. 
    Return only the title, nothing else.`;

  const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 30,
      temperature: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || 'Amazing Party Presentation';
};

const generateSlides = async (
  apiKey: string,
  topics: string[],
  slideCount: number,
  theme: string,
  presentationTitle: string
): Promise<Slide[]> => {
  const slides: Slide[] = [];
  
  for (let i = 0; i < slideCount; i++) {
    const slide = await generateSingleSlide(apiKey, topics, i + 1, slideCount, theme, presentationTitle);
    slides.push(slide);
  }
  
  return slides;
};

const generateSingleSlide = async (
  apiKey: string,
  topics: string[],
  slideNumber: number,
  totalSlides: number,
  theme: string,
  presentationTitle: string
): Promise<Slide> => {
  const topicsContext = topics.length > 0 
    ? `The presentation should incorporate these topics: ${topics.join(', ')}` 
    : 'The presentation should be completely random and entertaining';

  const isImageOnly = Math.random() < 0.7;
  
  let prompt: string;
  if (isImageOnly) {
    prompt = `Create slide ${slideNumber} of ${totalSlides} for a party presentation titled "${presentationTitle}".
      
      ${topicsContext}
      
      This slide should be IMAGE-ONLY with no text content - just a powerful visual.
      
      Generate:
      1. A single word or very short phrase (1-3 words max) that will be the visual focus
      2. One relevant emoji
      
      Make it visually striking and perfect for party entertainment!
      
      Format your response as JSON:
      {
        "title": "single word or short phrase",
        "content": "",
        "emoji": "single emoji here"
      }`;
  } else {
    prompt = `Create slide ${slideNumber} of ${totalSlides} for a party presentation titled "${presentationTitle}".
      
      ${topicsContext}
      
      This slide can have minimal text with an image.
      
      Generate:
      1. A single word or very short phrase (1-3 words max)
      2. One short sentence or phrase (max 8 words)
      3. One relevant emoji
      
      Keep it minimal and visually focused!
      
      Format your response as JSON:
      {
        "title": "single word or short phrase",
        "content": "one short sentence max 8 words",
        "emoji": "single emoji here"
      }`;
  }

  const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();
  
  try {
    const slideData = JSON.parse(content);
    const imageUrl = await generateSlideImage(apiKey, slideData.title, slideData.content || slideData.title, theme);
    
    return {
      id: slideNumber,
      title: slideData.title || `Slide ${slideNumber}`,
      content: slideData.content || '',
      emoji: slideData.emoji || '🎉',
      imageUrl
    };
  } catch (parseError) {
    console.warn('Failed to parse slide JSON, using fallback:', parseError);
    const imageUrl = await generateSlideImage(apiKey, 'Party Time', 'Amazing', theme);
    return {
      id: slideNumber,
      title: isImageOnly ? 'Party!' : 'Amazing',
      content: isImageOnly ? '' : 'Get ready for fun!',
      emoji: '🎉',
      imageUrl
    };
  }
};

const generateSlideImage = async (
  apiKey: string,
  title: string,
  content: string,
  theme: string
): Promise<string | undefined> => {
  try {
    const imagePrompt = `Create a vibrant, party-themed image for a presentation slide titled "${title}". 
      Content context: ${content}
      Theme: ${theme}
      Style: Colorful, fun, party atmosphere, suitable for entertainment and icebreaker games.
      Make it visually appealing and engaging for a party presentation.`;

    const response = await fetch(`${OPENAI_API_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '512x512',
        quality: 'standard'
      })
    });

    if (!response.ok) {
      console.warn('Image generation failed:', response.status);
      return undefined;
    }

    const data = await response.json();
    return data.data[0]?.url;
  } catch (error) {
    console.warn('Error generating image:', error);
    return undefined;
  }
};
