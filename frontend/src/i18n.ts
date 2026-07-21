export type TranslationKeys = 
  | 'original_inscription'
  | 'detected_script'
  | 'ancient_language'
  | 'period'
  | 'transliteration'
  | 'literal_translation'
  | 'translation'
  | 'historical_analysis'
  | 'historical_context'
  | 'archaeological_notes'
  | 'alternative_interpretations'
  | 'region'
  | 'dynasty'
  | 'confidence'
  | 'copy'
  | 'copy_translation'
  | 'copy_full_analysis'
  | 'download'
  | 'download_txt'
  | 'download_pdf'
  | 'share'
  | 'new_analysis'
  | 'references'
  | 'ai_notice_title'
  | 'ai_notice_desc'
  | 'ai_notice_details';

type TranslationDictionary = {
  [key in TranslationKeys]: string;
};

const en: TranslationDictionary = {
  original_inscription: "Original Inscription",
  detected_script: "Detected Script",
  ancient_language: "Ancient Language",
  period: "Period",
  transliteration: "Transliteration",
  literal_translation: "Literal Translation",
  translation: "Translation",
  historical_analysis: "Historical Analysis",
  historical_context: "Historical Context",
  archaeological_notes: "Archaeological Notes",
  alternative_interpretations: "Alternative Interpretations",
  region: "Region",
  dynasty: "Dynasty",
  confidence: "Confidence",
  copy: "Copy Text",
  copy_translation: "Copy Translation Only",
  copy_full_analysis: "Copy Full Analysis",
  download: "Download",
  download_txt: "Download TXT",
  download_pdf: "Download PDF",
  share: "Share",
  new_analysis: "New Analysis",
  references: "References",
  ai_notice_title: "AI-assisted interpretation",
  ai_notice_desc: "Some results may contain uncertainty.",
  ai_notice_details: "Show Details >"
};

const ta: Partial<TranslationDictionary> = {
  original_inscription: "மூல கல்வெட்டு",
  detected_script: "கண்டறியப்பட்ட எழுத்து",
  ancient_language: "பண்டைய மொழி",
  period: "காலப்பகுதி",
  transliteration: "ஒலிபெயர்ப்பு",
  literal_translation: "நேரடி மொழிபெயர்ப்பு",
  translation: "மொழிபெயர்ப்பு",
  historical_analysis: "வரலாற்றுப் பகுப்பாய்வு",
  historical_context: "வரலாற்று பின்னணி",
  archaeological_notes: "தொல்லியல் குறிப்புகள்",
  alternative_interpretations: "மாற்று விளக்கங்கள்",
  region: "பகுதி",
  dynasty: "வம்சம்",
  confidence: "நம்பகத்தன்மை",
  copy: "நகலெடு",
  download: "பதிவிறக்கு",
  share: "பகிர்",
  new_analysis: "புதிய பகுப்பாய்வு",
  references: "மேற்கோள்கள்",
  ai_notice_title: "AI உதவியுடன் விளக்கம்",
  ai_notice_desc: "சில முடிவுகளில் நிச்சயமற்ற தன்மை இருக்கலாம்.",
  ai_notice_details: "விவரங்களைக் காட்டு >"
};

const hi: Partial<TranslationDictionary> = {
  original_inscription: "मूल शिलालेख",
  detected_script: "पहचानी गई लिपि",
  ancient_language: "प्राचीन भाषा",
  period: "अवधि",
  transliteration: "लिप्यंतरण",
  literal_translation: "शाब्दिक अनुवाद",
  translation: "अनुवाद",
  historical_analysis: "ऐतिहासिक विश्लेषण",
  historical_context: "ऐतिहासिक संदर्भ",
  archaeological_notes: "पुरातात्विक नोट्स",
  alternative_interpretations: "वैकल्पिक व्याख्याएं",
  region: "क्षेत्र",
  dynasty: "राजवंश",
  confidence: "आत्मविश्वास",
  copy: "प्रतिलिपि बनाएँ",
  download: "डाउनलोड",
  share: "साझा करें",
  new_analysis: "नया विश्लेषण",
  references: "संदर्भ",
  ai_notice_title: "AI-सहायता प्राप्त व्याख्या",
  ai_notice_desc: "कुछ परिणामों में अनिश्चितता हो सकती है।",
  ai_notice_details: "विवरण दिखाएं >"
};

const dictionaries: Record<string, Partial<TranslationDictionary>> = {
  "English": en,
  "Tamil": ta,
  "Hindi": hi,
  // Add other languages here as needed, falling back to English
};

export function t(key: TranslationKeys, lang: string): string {
  const dictionary = dictionaries[lang] || dictionaries["English"];
  return dictionary[key] || en[key] || key;
}
