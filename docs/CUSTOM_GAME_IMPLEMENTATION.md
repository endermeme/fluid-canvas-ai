
# Custom Game Implementation Documentation

## Overview

This document explains how the custom game system works, from API integration to code parsing and rendering.

## Key Components

### 1. Game Generation (AIGameGenerator.ts)

The game generation process is handled by the `AIGameGenerator` class which:
- Initializes connection with Google's Generative AI (Gemini)
- Handles game content generation requests
- Processes API responses

```typescript
class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI('API_KEY');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  
  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null>
}
```

### 2. Response Parsing (responseParser.ts)

The response parser handles different formats of code responses:

#### Code Extraction Methods:
1. **Markdown Format**:
```typescript
extractCodeFromMarkdown(text: string): { 
  html: string, 
  css: string, 
  js: string 
}
```

2. **Complete HTML Format**:
```typescript
extractCodeFromFullHtml(html: string): {
  html: string,
  css: string,
  js: string
}
```

3. **Mixed Format**:
```typescript
extractCodeFromMixedFormat(text: string): {
  html: string,
  css: string,
  js: string
}
```

### 3. Code Formatting (html-formatter.ts)

The formatter ensures consistent code structure and adds necessary features:

#### Key Functions:
- `createFormattedHtml`: Combines HTML, CSS, and JS into a complete document
- `formatStyles`: Adds responsive base styles
- `formatGameScript`: Injects game communication utilities

### 4. Content Processing Flow

1. **API Request**:
   - Send topic and settings to Gemini API
   - Receive generated game code

2. **Parse Response**:
   - Detect format (markdown/HTML/mixed)
   - Extract code sections
   - Format and validate code

3. **Enhance Content**:
   - Add responsive styles
   - Inject communication utilities
   - Add game reporting features

### 5. Game Structure (types.ts)

The core game structure is defined by the `MiniGame` interface:

```typescript
interface MiniGame {
  title: string;
  description?: string;
  content?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  isSeparatedFiles?: boolean;
  gameStructure?: {
    html: string;
    css: string;
    javascript: string;
    meta?: {
      title?: string;
      description?: string;
      viewport?: string;
    }
  };
}
```

## Code Processing Steps

1. **Initial Processing**:
   - Receive raw API response
   - Detect format type
   - Extract code sections

2. **Code Enhancement**:
   - Format HTML, CSS, and JavaScript
   - Add responsive design features
   - Inject game communication utilities

3. **Final Assembly**:
   - Combine processed code sections
   - Add metadata and viewport settings
   - Create complete game document

## Game Communication

Games communicate with the parent application through:

```javascript
window.sendGameStats({
  completed: boolean;
  score?: number;
  completedAt?: string;
});
```

## Error Handling

The system includes multiple layers of error handling:

1. **API Level**:
   - Network error handling
   - Response validation

2. **Parsing Level**:
   - Format detection fallbacks
   - Code extraction error handling

3. **Rendering Level**:
   - Content validation
   - iframe error handling

## Best Practices

1. **Code Generation**:
   - Always include viewport meta tag
   - Use responsive design
   - Include game completion handlers

2. **Error Handling**:
   - Implement fallback content
   - Provide user feedback
   - Log errors for debugging

3. **Performance**:
   - Optimize animations
   - Minimize DOM operations
   - Use efficient event handlers

