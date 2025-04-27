
/**
 * Helper functions for wheel-based games
 */

export const wheelHelpers = {
  // Position text elements within wheel segments
  positionWheelTexts: function() {
    try {
      // Find all segment texts
      const segmentTexts = document.querySelectorAll('.segment-text');
      if (segmentTexts.length === 0) return false;

      console.log('Repositioning text for ' + segmentTexts.length + ' segments');
      
      // Find wheel element
      const wheelElement = document.querySelector('.wheel') || document.querySelector('#wheel');
      if (!wheelElement) return false;
      
      // Get wheel dimensions
      const wheelRect = wheelElement.getBoundingClientRect();
      const centerX = wheelRect.width / 2;
      const centerY = wheelRect.height / 2;
      const radius = Math.min(centerX, centerY) * 0.7;
      
      // Calculate angles
      const segmentCount = segmentTexts.length;
      const anglePerSegment = (2 * Math.PI) / segmentCount;
      
      // Update each text position
      segmentTexts.forEach((text, index) => {
        if (!(text instanceof SVGTextElement)) return;
        
        const midAngle = index * anglePerSegment + (anglePerSegment / 2);
        
        const x = centerX + Math.cos(midAngle) * (radius * 0.7);
        const y = centerY + Math.sin(midAngle) * (radius * 0.7);
        
        text.setAttribute('x', x.toString());
        text.setAttribute('y', y.toString());
        
        let rotationAngle = (midAngle * 180 / Math.PI) + 90;
        if (rotationAngle > 180) rotationAngle -= 180;
        
        text.setAttribute('transform', `rotate(${rotationAngle} ${x} ${y})`);
        text.style.fontSize = (radius / 12) + 'px';
        
        console.log(`Segment #${index} - Angle: ${(midAngle * 180 / Math.PI).toFixed(1)}°, Text: ${text.textContent}`);
      });
      
      return true;
    } catch (err) {
      console.error('Error positioning wheel texts:', err);
      return false;
    }
  },

  // Determine final result based on wheel position
  determineWheelResult: function(finalAngle: number, segments: any[]) {
    try {
      let normalizedAngle = finalAngle % (2 * Math.PI);
      if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
      
      console.log('Final angle:', finalAngle.toFixed(2), 'rad');
      console.log('Normalized angle:', normalizedAngle.toFixed(2), 'rad');
      
      const segmentAngle = (2 * Math.PI) / segments.length;
      console.log('Segment angle:', segmentAngle.toFixed(2), 'rad');
      
      const pointerAngle = 1.5 * Math.PI;
      console.log('Pointer angle:', pointerAngle.toFixed(2), 'rad');
      
      let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
      if (relativeAngle < 0) relativeAngle += 2 * Math.PI;
      console.log('Relative angle:', relativeAngle.toFixed(2), 'rad');
      
      const segmentIndex = Math.floor(relativeAngle / segmentAngle);
      console.log('Winning segment index:', segmentIndex);
      
      if (segmentIndex >= 0 && segmentIndex < segments.length) {
        console.log('Result:', segments[segmentIndex]);
        return segments[segmentIndex];
      }
      
      console.warn('Could not determine result, defaulting to first segment');
      return segments[0];
    } catch (err) {
      console.error('Error determining wheel result:', err);
      return segments[0];
    }
  }
};
