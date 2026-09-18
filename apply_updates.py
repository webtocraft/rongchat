import sys

# Read Index.html
with open('Index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS for Snap scroll, floating emojis and animations
custom_css = """
  <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Instagram-like Vertical Reels Snap Scroll */
    .snap-y-mandatory {
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
    }
    .snap-item {
      scroll-snap-align: start;
      scroll-snap-stop: always;
    }
    
    /* Floating Emojis Animation */
    @keyframes floatReactUp {
      0% { transform: translateY(0) scale(0.6); opacity: 1; }
      50% { transform: translateY(-110px) scale(1.3); opacity: 0.9; }
      100% { transform: translateY(-240px) scale(1.6); opacity: 0; }
    }
    .floating-reaction {
      position: absolute;
      animation: floatReactUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      pointer-events: none;
      z-index: 50;
    }

    /* Spinning Music Disc Animation */
    @keyframes spinDisc {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin-disc {
      animation: spinDisc 4s linear infinite;
    }

    /* Equalizer wave */
    @keyframes eqBar {
      0%, 100% { height: 4px; }
      50% { height: 20px; }
    }
    .eq-bar-1 { animation: eqBar 0.8s ease-in-out infinite; }
    .eq-bar-2 { animation: eqBar 0.6s ease-in-out infinite 0.2s; }
    .eq-bar-3 { animation: eqBar 0.9s ease-in-out infinite 0.4s; }
    .eq-bar-4 { animation: eqBar 0.7s ease-in-out infinite 0.1s; }
  </style>
"""

# Replace existing style or insert
if '</style>' in html:
    html = html.replace('</style>', custom_css + '\n  </style>', 1)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("CSS updated successfully")
