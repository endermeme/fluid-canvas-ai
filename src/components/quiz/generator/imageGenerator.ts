
/**
 * Image generation and management utilities for games
 * Provides local image generation without relying on external APIs
 */

// Color palette for generated images
const COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f97316', // Orange
  '#84cc16', // Lime
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#fbbf24', // Amber
  '#22c55e'  // Green
];

/**
 * Generates a placeholder image as a data URL
 * @param width Image width
 * @param height Image height
 * @param text Optional text to display on the image
 * @param seed Optional seed for consistent generation
 * @returns Data URL for the generated image
 */
export const generateImageDataUrl = (
  width: number = 200, 
  height: number = 200, 
  text?: string, 
  seed?: number
): string => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Use seed for deterministic generation if provided
  const randomSeed = seed || Math.floor(Math.random() * 10000);
  const randomFn = seedRandom(randomSeed);
  
  // Fill background
  const bgColor = COLORS[Math.floor(randomFn() * COLORS.length)];
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add some shapes
  const shapeCount = Math.floor(randomFn() * 5) + 3;
  for (let i = 0; i < shapeCount; i++) {
    const shapeType = Math.floor(randomFn() * 3);
    const shapeColor = COLORS[Math.floor(randomFn() * COLORS.length)];
    ctx.fillStyle = shapeColor;
    
    // Make sure shape color is different from background
    if (shapeColor === bgColor) {
      ctx.fillStyle = COLORS[(COLORS.indexOf(bgColor) + 1) % COLORS.length];
    }
    
    const x = randomFn() * width;
    const y = randomFn() * height;
    const size = (randomFn() * 50) + 20;
    
    switch (shapeType) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // Square
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
      case 2: // Triangle
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }
  
  // Add text if provided
  if (text) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Wrap text if it's too long
    const words = text.split(' ');
    let line = '';
    let lines = [];
    const maxWidth = width - 20;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // Draw each line
    const lineHeight = 30;
    const y = height / 2 - (lines.length - 1) * lineHeight / 2;
    
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], width / 2, y + i * lineHeight);
    }
  }
  
  // Return as data URL
  return canvas.toDataURL('image/png');
};

/**
 * Simple seeded random number generator
 * @param seed Initial seed
 * @returns Function that returns pseudorandom numbers
 */
function seedRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Generates a game sprite sheet as a data URL
 * @param columns Number of columns in the sprite sheet
 * @param rows Number of rows in the sprite sheet
 * @param spriteSize Size of each sprite
 * @returns Data URL for the generated sprite sheet
 */
export const generateSpriteSheet = (
  columns: number = 4, 
  rows: number = 4, 
  spriteSize: number = 50
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = columns * spriteSize;
  canvas.height = rows * spriteSize;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Generate unique sprites
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const index = y * columns + x;
      const seed = index * 1000;
      
      // Draw background
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fillRect(x * spriteSize, y * spriteSize, spriteSize, spriteSize);
      
      // Draw a simple shape
      ctx.fillStyle = '#ffffff';
      const shapeType = index % 3;
      const margin = spriteSize * 0.2;
      const size = spriteSize - margin * 2;
      const centerX = x * spriteSize + spriteSize / 2;
      const centerY = y * spriteSize + spriteSize / 2;
      
      switch (shapeType) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Square
          ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
          break;
        case 2: // Star
          drawStar(ctx, centerX, centerY, 5, size / 2, size / 4);
          break;
      }
    }
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Draw a star shape
 */
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

/**
 * Injects image generation utilities into game HTML
 * @param html Original HTML content
 * @returns Updated HTML with image generation utilities
 */
export const injectImageUtils = (html: string): string => {
  // Check if the HTML already contains image generation utilities
  if (html.includes('generateImageDataUrl')) {
    return html;
  }
  
  // Create the utility script
  const imageUtils = `
    <script>
      // Local image generation utilities
      const COLORS = [
        '#4f46e5', '#06b6d4', '#ec4899', '#f97316', '#84cc16',
        '#8b5cf6', '#14b8a6', '#f43f5e', '#fbbf24', '#22c55e'
      ];

      function seedRandom(seed) {
        return function() {
          seed = (seed * 9301 + 49297) % 233280;
          return seed / 233280;
        };
      }

      function generateImageDataUrl(width = 200, height = 200, text, seed) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        
        const randomSeed = seed || Math.floor(Math.random() * 10000);
        const randomFn = seedRandom(randomSeed);
        
        // Background
        const bgIndex = Math.floor(randomFn() * COLORS.length);
        ctx.fillStyle = COLORS[bgIndex];
        ctx.fillRect(0, 0, width, height);
        
        // Shapes
        const shapeCount = Math.floor(randomFn() * 5) + 3;
        for (let i = 0; i < shapeCount; i++) {
          const shapeType = Math.floor(randomFn() * 3);
          const colorIndex = (bgIndex + 1 + Math.floor(randomFn() * (COLORS.length - 1))) % COLORS.length;
          ctx.fillStyle = COLORS[colorIndex];
          
          const x = randomFn() * width;
          const y = randomFn() * height;
          const size = (randomFn() * 50) + 20;
          
          if (shapeType === 0) {
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (shapeType === 1) {
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          } else {
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.closePath();
            ctx.fill();
          }
        }
        
        // Text
        if (text) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(text.substring(0, 20), width / 2, height / 2);
        }
        
        return canvas.toDataURL('image/png');
      }

      // Create sprite sheet for games
      function generateSpriteSheet(columns = 4, rows = 4, spriteSize = 50) {
        const canvas = document.createElement('canvas');
        canvas.width = columns * spriteSize;
        canvas.height = rows * spriteSize;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            const index = y * columns + x;
            ctx.fillStyle = COLORS[index % COLORS.length];
            ctx.fillRect(x * spriteSize, y * spriteSize, spriteSize, spriteSize);
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(
              x * spriteSize + spriteSize / 2,
              y * spriteSize + spriteSize / 2,
              spriteSize / 3,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
        
        return canvas.toDataURL('image/png');
      }

      // Generate random emoji for game objects
      function getRandomEmoji() {
        const emojis = ['🎮', '🎯', '🎪', '🎭', '🎨', '🎲', '🎤', '🎧', '🎬', '🎵', 
                       '🏆', '⚽', '🏀', '🏈', '⚾', '🎾', '🎱', '🎳', '🏓', '🏸',
                       '🦄', '🐼', '🦊', '🐶', '🐱', '🦁', '🐯', '🐮', '🐷', '🐻'];
        return emojis[Math.floor(Math.random() * emojis.length)];
      }

      // Replace missing image sources with generated ones
      function fixMissingImages() {
        document.querySelectorAll('img').forEach((img, index) => {
          if (!img.src || img.src.includes('wikipedia.org') || img.src.includes('pixabay.com')) {
            img.src = generateImageDataUrl(
              img.width || 200,
              img.height || 200,
              img.alt || 'Game image ' + (index + 1),
              index * 1000
            );
          }
          
          // Add error handler for all images
          img.onerror = function() {
            this.src = generateImageDataUrl(
              this.width || 200,
              this.height || 200,
              this.alt || 'Image',
              index * 1000
            );
          };
        });
      }

      // Call once DOM is loaded
      document.addEventListener('DOMContentLoaded', fixMissingImages);
    </script>
  `;
  
  // Insert the script before the closing body tag
  return html.replace('</body>', `${imageUtils}\n</body>`);
};
