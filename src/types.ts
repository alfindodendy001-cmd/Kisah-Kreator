export interface TitleOption {
  title: string;
  angle: string;
  type?: string;
}

export interface ThumbnailConcept {
  mainSubject: string;
  facialExpressionOrMood: string;
  shortOverlayText: string;
  backgroundAndColors: string;
  visualHookRationale?: string;
}

export interface ScriptMetadata {
  description: string;
  tags: string[];
  hashtags?: string[];
  hookFormulaUsed?: string;
}

export interface StoryboardRow {
  timestamp: string;
  stage: string;
  visualAndAudioEffect: string;
  narrationText: string;
  toneDeliveryCue?: string;
}

export interface ScriptPackage {
  id?: string;
  createdAt?: string;
  topicSummary: string;
  estimatedTotalDuration: string;
  estimatedWordCount?: number;
  titles: TitleOption[];
  thumbnailConcept: ThumbnailConcept;
  metadata: ScriptMetadata;
  storyboardTable: StoryboardRow[];
  closingDiscussionQuestion: string;
  originalTopic?: string;
  targetDuration?: 'shorts' | 'medium' | 'deep';
  toneStyle?: string;
}

export interface PresetTopic {
  id: string;
  category: string;
  title: string;
  roughPrompt: string;
  hookPremise: string;
  iconName: string;
}
