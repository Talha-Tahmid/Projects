export type ContentType =
  | "blog"
  | "caption"
  | "script"
  | "email"
  | "productDescription"
  | "essay"
  | "adCopy";

export interface ContentTypeInfo {
  id: ContentType;
  label: string;
  icon: string;
  placeholder: string;
  description: string;
}

export type ToneType =
  | "Formal"
  | "Casual"
  | "Professional"
  | "Emotional"
  | "Persuasive"
  | "Bold"
  | "Inspiring"
  | "Technical";

export interface ToneInfo {
  id: ToneType;
  label: string;
  description: string;
  emoji: string;
}

export type LengthType = "short" | "medium" | "long";

export interface BrandProfile {
  id: string;
  name: string;
  audience: string;
  toneNotes: string;
  rules: string; // write in 1st person, active voice...
  wordsToAvoid?: string; // commas separated list of jargon words to skip
}

export interface SeoKeyword {
  keyword: string;
  difficulty: "Low" | "Medium" | "High" | string;
  intent: string;
}

export interface GenerationMetadata {
  wordCount: number;
  readingTimeMinutes: number;
  readabilityGrade: string;
  toneSentiment: string;
}

export interface GeneratedPiece {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: ToneType;
  brandProfileName?: string;
  brandProfileId?: string;
  length: LengthType;
  generatedContent: string;
  improvedTitles: string[];
  improvedHooks: string[];
  seoKeywords: SeoKeyword[];
  metadata: GenerationMetadata;
  timestamp: string;
}
