const HINGLISH_MAP = {
  sasta: "cheap",
  sastaa: "cheap",
  saste: "cheap",
  budget: "cheap",
  kam: "low",
  kamm: "low",
  seedha: "basic",
  seedhi: "basic",
  mehnga: "expensive",
  mehenga: "expensive",
  premium: "premium",
  badiya: "best",
  badhiya: "best",
  accha: "good",
  achha: "good",
  latest: "latest",
  naya: "new",
  naye: "new",
  mobile: "phone",
  phone: "phone",
  fone: "phone",
  tablet: "tablet",
  laptop: "laptop",
  lappy: "laptop",
  earphone: "earphones",
  headphone: "headphones",
  charger: "charger",
  cover: "case",
  case: "case",
};

const SPELLING_CORRECTIONS = {
  ifone: "iphone",
  iphon: "iphone",
  ipone: "iphone",
  ifonee: "iphone",
  aphone: "iphone",
  aiphone: "iphone",
  iphonee: "iphone",
  "i phone": "iphone",
  appel: "apple",
  aple: "apple",
  samsng: "samsung",
  sumsung: "samsung",
  samsang: "samsung",
  samung: "samsung",
  galxy: "galaxy",
  galaxi: "galaxy",
  galxey: "galaxy",
  oneplus: "oneplus",
  "one plus": "oneplus",
  "1plus": "oneplus",
  onplus: "oneplus",
  xiaome: "xiaomi",
  xiomi: "xiaomi",
  xioami: "xiaomi",
  radmi: "redmi",
  redme: "redmi",
  realmi: "realme",
  reelme: "realme",
  vevo: "vivo",
  vivoo: "vivo",
  opo: "oppo",
  opoo: "oppo",
  macboook: "macbook",
  mackbook: "macbook",
  macbok: "macbook",
  airpod: "airpods",
  airpodss: "airpods",
};

const BRANDS = {
  apple: "Apple",
  iphone: "Apple",
  ipad: "Apple",
  macbook: "Apple",
  airpods: "Apple",
  samsung: "Samsung",
  galaxy: "Samsung",
  oneplus: "OnePlus",
  xiaomi: "Xiaomi",
  redmi: "Xiaomi",
  poco: "Xiaomi",
  realme: "Realme",
  oppo: "Oppo",
  vivo: "Vivo",
  motorola: "Motorola",
  moto: "Motorola",
  nokia: "Nokia",
  google: "Google",
  pixel: "Google",
  asus: "Asus",
  lenovo: "Lenovo",
  hp: "HP",
  dell: "Dell",
  sony: "Sony",
  lg: "LG",
  boat: "boAt",
  jbl: "JBL",
  bose: "Bose",
};

const COLORS = [
  "black", "white", "red", "blue", "green", "yellow", "purple", "pink",
  "gold", "silver", "grey", "gray", "titanium", "midnight", "starlight",
  "graphite", "sierra", "alpine", "desert", "natural", "coral", "lavender",
  "cream", "mint", "orange", "violet",
];

const extractPriceIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  let priceRange = null;
  let isPriceQuery = false;

  const kPattern = /(\d+)\s*k\b/gi;
  const kMatch = kPattern.exec(lowerQuery);
  
  if (kMatch) {
    const price = Number(kMatch[1]) * 1000;
    const minPrice = Math.floor(price * 0.8);
    const maxPrice = Math.ceil(price * 1.2);
    priceRange = { min: minPrice, max: maxPrice };
    isPriceQuery = true;
  }

  if (!priceRange) {
    const numPattern = /\b(\d{4,6})\b/g;
    const numMatch = numPattern.exec(lowerQuery);
    
    if (numMatch) {
      const price = Number(numMatch[1]);
      
      if (price >= 1000) {
        const minPrice = Math.floor(price * 0.8);
        const maxPrice = Math.ceil(price * 1.2);
        priceRange = { min: minPrice, max: maxPrice };
        isPriceQuery = true;
      }
    }
  }

  const underPattern = /(?:under|below|less than|upto|max)\s*(?:rs\.?|₹)?\s*(\d+)\s*k?/i;
  const underMatch = underPattern.exec(lowerQuery);
  
  if (underMatch) {
    let price = Number(underMatch[1]);
    const matchText = underMatch[0].toLowerCase();
    
    if (matchText.includes("k")) {
      price = price * 1000;
    } else if (price < 1000) {
      price = price * 1000;
    }
    
    priceRange = { min: 0, max: price };
    isPriceQuery = true;
  }

  const abovePattern = /(?:above|over|more than|min|starting)\s*(?:rs\.?|₹)?\s*(\d+)\s*k?/i;
  const aboveMatch = abovePattern.exec(lowerQuery);
  
  if (aboveMatch) {
    let price = Number(aboveMatch[1]);
    const matchText = aboveMatch[0].toLowerCase();
    
    if (matchText.includes("k")) {
      price = price * 1000;
    } else if (price < 1000) {
      price = price * 1000;
    }
    
    priceRange = { min: price, max: 500000 };
    isPriceQuery = true;
  }

  return { priceRange: priceRange, isPriceQuery: isPriceQuery };
};

const detectPriceIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery.split(/\s+/);

  const budgetKeywords = [
    "sasta", "sastaa", "saste", "cheap", "budget", "affordable", "low", "kam",
  ];
  
  const premiumKeywords = [
    "mehnga", "mehenga", "premium", "expensive", "flagship", "best", "pro", "max", "ultra",
  ];

  let isBudgetQuery = false;
  let isPremiumQuery = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    for (let j = 0; j < budgetKeywords.length; j++) {
      if (token === budgetKeywords[j]) {
        isBudgetQuery = true;
        break;
      }
    }
    
    for (let k = 0; k < premiumKeywords.length; k++) {
      if (token === premiumKeywords[k]) {
        isPremiumQuery = true;
        break;
      }
    }
  }

  return { isBudgetQuery: isBudgetQuery, isPremiumQuery: isPremiumQuery };
};

const correctSpelling = (query) => {
  let corrected = query.toLowerCase();

  const corrections = Object.keys(SPELLING_CORRECTIONS);
  
  for (let i = 0; i < corrections.length; i++) {
    const wrong = corrections[i];
    const right = SPELLING_CORRECTIONS[wrong];
    const pattern = new RegExp("\\b" + wrong + "\\b", "gi");
    corrected = corrected.replace(pattern, right);
  }

  return corrected;
};

const translateHinglish = (query) => {
  let translated = query.toLowerCase();

  const hinglishWords = Object.keys(HINGLISH_MAP);
  
  for (let i = 0; i < hinglishWords.length; i++) {
    const hindi = hinglishWords[i];
    const english = HINGLISH_MAP[hindi];
    const pattern = new RegExp("\\b" + hindi + "\\b", "gi");
    translated = translated.replace(pattern, english);
  }

  return translated;
};

const detectBrand = (query) => {
  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery.split(/\s+/);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (BRANDS[token]) {
      return BRANDS[token];
    }
  }

  return null;
};

const detectColor = (query) => {
  const lowerQuery = query.toLowerCase();

  for (let i = 0; i < COLORS.length; i++) {
    const color = COLORS[i];
    
    if (lowerQuery.includes(color)) {
      return color;
    }
  }

  return null;
};

const detectStorage = (query) => {
  const gbPattern = /(\d+)\s*gb/i;
  const tbPattern = /(\d+)\s*tb/i;
  
  const gbMatch = gbPattern.exec(query);
  if (gbMatch) {
    const size = gbMatch[1];
    return size + "GB";
  }
  
  const tbMatch = tbPattern.exec(query);
  if (tbMatch) {
    const size = tbMatch[1];
    return size + "TB";
  }
  
  return null;
};

const cleanQuery = (query) => {
  let cleaned = query.toLowerCase();

  cleaned = cleaned.replace(/(\d+)\s*k\b/gi, "");
  cleaned = cleaned.replace(/\b(\d{4,6})\b/g, "");
  cleaned = cleaned.replace(/(?:under|below|above|over|less than|more than|upto|max|min|starting)\s*(?:rs\.?|₹)?\s*\d+\s*k?/gi, "");

  const hinglishWords = Object.keys(HINGLISH_MAP);
  for (let i = 0; i < hinglishWords.length; i++) {
    const word = hinglishWords[i];
    const pattern = new RegExp("\\b" + word + "\\b", "gi");
    cleaned = cleaned.replace(pattern, "");
  }

  for (let i = 0; i < COLORS.length; i++) {
    const color = COLORS[i];
    const pattern = new RegExp("\\b" + color + "\\b", "gi");
    cleaned = cleaned.replace(pattern, "");
  }

  cleaned = cleaned.replace(/\d+\s*(gb|tb)/gi, "");
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.trim();

  return cleaned;
};

const parse = (rawQuery) => {
  let query = rawQuery.trim();

  query = correctSpelling(query);
  query = translateHinglish(query);

  const priceInfo = extractPriceIntent(rawQuery);
  const intentInfo = detectPriceIntent(rawQuery);

  const brand = detectBrand(query);
  const color = detectColor(rawQuery);
  const storage = detectStorage(rawQuery);

  const cleanedQuery = cleanQuery(query);

  const tokens = cleanedQuery.split(/\s+/);
  const filteredTokens = [];
  
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].length > 1) {
      filteredTokens.push(tokens[i]);
    }
  }

  return {
    originalQuery: rawQuery,
    correctedQuery: query,
    cleanedQuery: cleanedQuery || query,
    isBudgetQuery: intentInfo.isBudgetQuery,
    isPremiumQuery: intentInfo.isPremiumQuery,
    isPriceQuery: priceInfo.isPriceQuery,
    priceRange: priceInfo.priceRange,
    brand: brand,
    color: color,
    storage: storage,
    tokens: filteredTokens,
  };
};

module.exports = {
  parse: parse,
  correctSpelling: correctSpelling,
  translateHinglish: translateHinglish,
  detectBrand: detectBrand,
  detectColor: detectColor,
  extractPriceIntent: extractPriceIntent,
  BRANDS: BRANDS,
  COLORS: COLORS,
};
