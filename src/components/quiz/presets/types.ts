
export interface GamePresetType {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  description: string;
  customizeInstruction: string;
  inputPlaceholder: string;
  inputHelper: string;
  tags: string[];
  promptTemplate: string;
}

export interface PresetGameConfig {
  preset: string;
  content: string;
}
