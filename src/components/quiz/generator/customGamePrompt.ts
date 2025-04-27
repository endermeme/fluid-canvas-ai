
export const generateCustomGamePrompt = (userPrompt: string): string => {
  return `
Create an interactive HTML5 game based on this description: "${userPrompt}"

REQUIREMENTS:
1. Return code in THREE SEPARATE SECTIONS using these EXACT tags:
<HTML>
// Pure HTML only (no style/script tags)
</HTML>

<CSS>
// All styles here
</CSS>

<JAVASCRIPT>
// All game logic here
</JAVASCRIPT>

2. OPTIMIZATION RULES:
- Use pure HTML5, CSS3, and vanilla JavaScript only
- NO external libraries or frameworks
- All code must be cross-browser compatible
- Optimize for mobile devices (touch events)
- Keep code simple and well-commented
- Must work in an iframe sandbox

3. TEXT RENDERING AND LAYOUT RULES:
- All text elements must use standard CSS text alignment
- For SVG or canvas text:
  * Use text-anchor: middle for centered text
  * Use dominant-baseline: middle for vertical alignment
  * Set proper transform-origin for rotating elements
- Ensure text is properly wrapped and responsive
- Use flexbox or grid for layouts when possible
- Maintain consistent spacing and alignment

4. RESPONSIVE DESIGN:
- Use responsive units (vh, vw, %, rem)
- Support both portrait and landscape
- Min touch target size: 44px
- Prevent unwanted scrolling/zooming
- Adapt text size for different screen sizes

5. GAME MECHANICS:
- Clear objectives and win conditions
- Simple, intuitive controls
- Visual feedback for actions
- Score tracking if applicable
- Restart functionality

6. PERFORMANCE:
- Minimal DOM operations
- Use requestAnimationFrame for animations
- Optimize event listeners
- Clean up resources properly

7. WHEEL GAMES SPECIAL RULES:
- Use SVG for the wheel (not Canvas) for better text handling
- Create wheel as a group/wrapper element with ID "wheel" or class "wheel"
- Create wheel segments as separate SVG path elements with unique IDs or classes
- Position segment text in center of each segment using a consistent pattern:
  * Each segment text MUST BE a separate SVG text element
  * Add class "segment-text" to ALL text elements
  * Set text-anchor="middle" and dominant-baseline="central" attributes
  * Properly rotate text to be readable (perpendicular to the radius)
  * Set font-size proportional to wheel size (e.g., radius/10)
- Add a fixed pointer/indicator element outside the wheel
- Implement smooth rotation with CSS transitions or JS animations
- Make a GLOBAL variable called segments that stores all segment values
- When displaying results, use clear text notifications
- Store final rotation angle in a variable for accurate result determination
- Include a function determineResult() that calculates which segment is at the pointer
- Add a clear visual indicator when a segment is selected

8. COMMON ISSUES TO AVOID:
- Text displaying incorrectly or unreadable in wheel segments
- Incorrect calculation of winning segment
- Wheel pointer misalignment
- Text not being centered in segments
- Results showing wrong values

CODE MUST BE COMPLETE AND FUNCTIONAL WITH NO EXTERNAL DEPENDENCIES.
RETURN ONLY THE CODE INSIDE THE SPECIFIED TAGS.
`;
};
