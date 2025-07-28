// Settings Processor for JSONB settings_data
export interface ProcessedSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
  singleParticipationOnly?: boolean;
}

export const processSettingsData = (settingsData: any): ProcessedSettings => {
  if (!settingsData || typeof settingsData !== 'object') {
    return {
      showLeaderboard: true,
      requireRegistration: false
    };
  }

  return {
    password: settingsData.password || undefined,
    maxParticipants: settingsData.maxParticipants || undefined,
    showLeaderboard: settingsData.showLeaderboard ?? true,
    requireRegistration: settingsData.requireRegistration ?? false,
    customDuration: settingsData.customDuration || undefined,
    singleParticipationOnly: settingsData.singleParticipationOnly ?? false
  };
};

export const createSettingsData = (settings: ProcessedSettings): object => {
  const cleanSettings: any = {};
  
  if (settings.password) cleanSettings.password = settings.password;
  if (settings.maxParticipants) cleanSettings.maxParticipants = settings.maxParticipants;
  if (settings.showLeaderboard !== undefined) cleanSettings.showLeaderboard = settings.showLeaderboard;
  if (settings.requireRegistration !== undefined) cleanSettings.requireRegistration = settings.requireRegistration;
  if (settings.customDuration) cleanSettings.customDuration = settings.customDuration;
  if (settings.singleParticipationOnly !== undefined) cleanSettings.singleParticipationOnly = settings.singleParticipationOnly;

  return cleanSettings;
};