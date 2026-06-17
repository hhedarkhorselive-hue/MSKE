/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates a beautiful SVG data URI representing a premium, high-fidelity avatar 
 * themed around shipping / marine investment based on the user's Alphanumeric ID.
 */
export function generateIdAvatar(uid: string): string {
  // Use character codes to drive deterministic gradient colors & designs
  const cleanId = uid || "MEMBERNNGVHXSX";
  const charCodes = Array.from(cleanId).map(c => c.charCodeAt(0));
  const sum = charCodes.reduce((acc, val) => acc + val, 0);
  
  // Deterministic colors based on the ID hash
  const color1 = `hsl(${sum % 360}, 85%, 20%)`;
  const color2 = `hsl(${(sum + 120) % 360}, 90%, 12%)`;
  const borderHue = (sum + 60) % 360;
  
  // Extract up to 3 uppercase/lowercase characters from the ID as high-contrast initials
  const initials = cleanId.length > 6 
    ? cleanId.substring(6, 9) // Get "NNG" style
    : cleanId.slice(0, 3);
    
  // Marine thematic details matching navigation instruments/compasses of shipping
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(${borderHue}, 80%, 65%)" />
          <stop offset="50%" stop-color="hsl(${(borderHue + 180) % 360}, 90%, 75%)" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <!-- Background Circle with deep premium marine gradient -->
      <circle cx="50" cy="50" r="46" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="2" />
      
      <!-- Compass / Ship Wheel abstract elements to represent Marine Navigation -->
      <g stroke="rgba(255, 255, 255, 0.08)" stroke-width="0.75" fill="none">
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="26" />
        <!-- Steering handles / lines -->
        <line x1="50" y1="5" x2="50" y2="95" />
        <line x1="5" y1="50" x2="95" y2="50" />
        <line x1="18.18" y1="18.18" x2="81.82" y2="81.82" />
        <line x1="18.18" y1="81.82" x2="81.82" y2="18.18" />
      </g>
      
      <!-- Centered Anchor or Fleet Symbol in ambient opacity -->
      <path d="M50,22 L50,56 M44,48 L56,48 M42,56 Q36,54 36,46 M58,56 Q64,54 64,46 M32,46 Q32,68 50,68 Q68,68 68,46" 
            stroke="hsla(${borderHue}, 100%, 55%, 0.15)" stroke-width="2.5" fill="none" stroke-linecap="round" />
            
      <!-- Compass North Arrow Indicator -->
      <polygon points="50,6 53,15 47,15" fill="#f59e0b" opacity="0.6" />
      
      <!-- Initials of User ID with premium uppercase styling -->
      <text x="50" y="55" font-family="'JetBrains Mono', 'Segoe UI', monospace" font-size="14" font-weight="900" 
            fill="#ffffff" text-anchor="middle" letter-spacing="1" filter="url(#glow)">${initials}</text>
            
      <!-- Overlay glowing rings representing VIP Account -->
      <circle cx="50" cy="50" r="43" stroke="rgba(245, 158, 11, 0.12)" stroke-width="1.5" fill="none" />
    </svg>
  `.trim();
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
