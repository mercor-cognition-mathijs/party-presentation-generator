import { Presentation } from '../services/openaiService';

export const openPresentationWindow = (presentation: Presentation, theme: string): void => {
  const presentationWindow = window.open('', '_blank', 'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no');
  
  if (!presentationWindow) {
    alert('Please allow popups to open the presentation window');
    return;
  }

  const html = generatePresentationHTML(presentation, theme);
  presentationWindow.document.write(html);
  presentationWindow.document.close();
  
  presentationWindow.focus();
  
  try {
    if (presentationWindow.document.documentElement.requestFullscreen) {
      presentationWindow.document.documentElement.requestFullscreen().catch(console.warn);
    }
  } catch (error) {
    console.warn('Fullscreen not supported:', error);
  }
};

const generatePresentationHTML = (presentation: Presentation, theme: string): string => {
  const themeStyles = getThemeStyles(theme);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: ${themeStyles.background};
            color: ${themeStyles.color};
            overflow: hidden;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .presentation-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .slide {
            display: none;
            width: 90%;
            max-width: 1200px;
            text-align: center;
            padding: 60px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .slide.active {
            display: block;
            animation: slideIn 0.5s ease-in-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .slide-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slide-emoji {
            font-size: 6rem;
            margin-bottom: 30px;
            display: block;
        }
        
        .slide-content {
            font-size: 2rem;
            line-height: 1.6;
            margin-bottom: 40px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .slide-with-background {
            background-color: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(5px);
        }
        
        .slide-with-background .slide-title {
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
            background: rgba(0, 0, 0, 0.3);
            padding: 10px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .slide-with-background .slide-content {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            background: rgba(0, 0, 0, 0.3);
            padding: 15px 25px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .slide-with-background .slide-emoji {
            display: none;
        }
        
        .navigation {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 1000;
        }
        
        .nav-button {
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        
        .nav-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .nav-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .slide-counter {
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 18px;
            backdrop-filter: blur(10px);
        }
        
        .presentation-title {
            position: fixed;
            top: 30px;
            left: 30px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 18px;
            backdrop-filter: blur(10px);
            max-width: 400px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .keyboard-hint {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <div class="presentation-title">${presentation.title}</div>
        <div class="slide-counter">
            <span id="current-slide">1</span> / ${presentation.slides.length}
        </div>
        
        ${presentation.slides.map((slide, index) => `
            <div class="slide ${slide.imageUrl ? 'slide-with-background' : ''} ${index === 0 ? 'active' : ''}" 
                 data-slide="${index}">
                <div class="slide-emoji">${slide.emoji}</div>
                <h1 class="slide-title">${slide.title}</h1>
                <div class="slide-content">${slide.content}</div>
            </div>
        `).join('')}
        
        <div class="navigation">
            <button class="nav-button" id="prev-btn" onclick="previousSlide()">← Previous</button>
            <button class="nav-button" id="next-btn" onclick="nextSlide()">Next →</button>
        </div>
        
        <div class="keyboard-hint">
            Use arrow keys or buttons to navigate • Press F11 for fullscreen • Press Esc to exit
        </div>
    </div>
    
    <script>
        const slidesData = ${JSON.stringify(presentation.slides)};
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        function showSlide(n) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (n + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
            
            const slideData = slidesData[currentSlide];
            if (slideData.imageUrl) {
                document.body.style.backgroundImage = "url('" + slideData.imageUrl + "')";
            } else {
                document.body.style.backgroundImage = 'none';
            }
            
            document.getElementById('current-slide').textContent = currentSlide + 1;
            document.getElementById('prev-btn').disabled = currentSlide === 0;
            document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
        }
        
        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                showSlide(currentSlide + 1);
            }
        }
        
        function previousSlide() {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }
        
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
                case 'F11':
                    e.preventDefault();
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
        
        showSlide(0);
        
        window.focus();
    </script>
</body>
</html>`;
};

const getThemeStyles = (theme: string) => {
  const themes = {
    party: {
      background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      color: '#ffffff'
    },
    neon: {
      background: 'linear-gradient(135deg, #00d2ff, #3a7bd5, #00f2fe, #4facfe)',
      color: '#ffffff'
    },
    sunset: {
      background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffecd2, #fcb69f)',
      color: '#333333'
    },
    ocean: {
      background: 'linear-gradient(135deg, #667eea, #764ba2, #89f7fe, #66a6ff)',
      color: '#ffffff'
    },
    forest: {
      background: 'linear-gradient(135deg, #11998e, #38ef7d, #56ab2f, #a8edea)',
      color: '#ffffff'
    }
  };
  
  return themes[theme as keyof typeof themes] || themes.party;
};
