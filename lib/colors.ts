export const COLOR_MAP: Record<string, string> = {
  // Basics
  black: "#000000",
  white: "#FFFFFF",
  "off white": "#FAF9F6",
  natural: "#EBE6DD",
  grey: "#808080",
  gray: "#808080",
  charcoal: "#36454F",
  silver: "#C0C0C0",
  
  // Blues
  navy: "#000080",
  blue: "#2443ED",
  "sky blue": "#87CEEB",
  "light blue": "#ADD8E6",
  indigo: "#4B0082",
  teal: "#008080",
  cyan: "#00FFFF",
  ocean: "#0077BE",
  
  // Reds & Pinks
  red: "#FF0000",
  maroon: "#800000",
  burgundy: "#800020",
  wine: "#722F37",
  pink: "#FFC0CB",
  "hot pink": "#FF69B4",
  salmon: "#FA8072",
  coral: "#FF7F50",
  
  // Greens
  green: "#008000",
  olive: "#808000",
  "forest green": "#228B22",
  sage: "#9C9F84",
  mint: "#98FF98",
  lime: "#00FF00",
  emerald: "#50C878",
  moss: "#8A9A5B",
  
  // Yellows & Oranges
  yellow: "#FFFF00",
  mustard: "#FFDB58",
  gold: "#FFD700",
  orange: "#FFA500",
  amber: "#FFBF00",
  rust: "#B7410E",
  
  // Browns & Neutrals
  brown: "#A52A2A",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  khaki: "#C3B091",
  camel: "#C19A6B",
  taupe: "#483C32",
  mocha: "#3C2F2F",
  chocolate: "#7B3F00",
  coffee: "#6F4E37",
  sand: "#C2B280",
  stone: "#877F7D",
  terracotta: "#E2725B",
  
  // Purples
  purple: "#800080",
  violet: "#8F00FF",
  lavender: "#E6E6FA",
  plum: "#8E4585",
  magenta: "#FF00FF",
  
  // Grey variants
  ash: "#B2BEB5",
  slate: "#708090",
  gunmetal: "#2C3539",
  fog: "#D5D6D2",
  cloud: "#C5C6D0",
  pebble: "#A19D94",
  lead: "#212121",
};

export const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  
  // Direct match
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  
  // Match substrings (longest first for better precision)
  const sortedKeys = Object.keys(COLOR_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (normalized.includes(key)) return COLOR_MAP[key];
  }
  
  return "#E2E2E2"; // Default fallback
};
