
import { v4 as uuidv4 } from 'uuid';

export interface GameParticipant {
  id: string;
  name: string;
  ipAddress: string;
  timestamp: number;
  retryCount: number;
}

export interface GameSession {
  id: string;
  title: string;
  htmlContent: string;
  participants: GameParticipant[];
  createdAt: number;
  creatorId?: string;
}

// Function to save a new game session
export const createGameSession = (title: string, htmlContent: string): GameSession => {
  const id = uuidv4();
  const now = Date.now();
  
  const gameSession: GameSession = {
    id,
    title,
    htmlContent,
    participants: [],
    createdAt: now,
  };
  
  // Save to localStorage
  const sessionsJson = localStorage.getItem('game_sessions');
  const sessions: GameSession[] = sessionsJson ? JSON.parse(sessionsJson) : [];
  
  sessions.push(gameSession);
  localStorage.setItem('game_sessions', JSON.stringify(sessions));
  
  return gameSession;
};

// Function to get all game sessions
export const getAllGameSessions = (): GameSession[] => {
  const sessionsJson = localStorage.getItem('game_sessions');
  return sessionsJson ? JSON.parse(sessionsJson) : [];
};

// Function to get a specific game session
export const getGameSession = (id: string): GameSession | null => {
  const sessions = getAllGameSessions();
  return sessions.find(session => session.id === id) || null;
};

// Function to add a participant to a game session
export const addParticipant = (gameId: string, name: string, ipAddress: string): { success: boolean; participant?: GameParticipant; message?: string } => {
  const sessions = getAllGameSessions();
  const sessionIndex = sessions.findIndex(s => s.id === gameId);
  
  if (sessionIndex === -1) {
    return { success: false, message: "Game session not found" };
  }
  
  const session = sessions[sessionIndex];
  
  // Check if this IP has already participated
  const existingParticipant = session.participants.find(p => p.ipAddress === ipAddress);
  
  if (existingParticipant) {
    // Increment retry count
    existingParticipant.retryCount += 1;
    
    // Update the session with the incremented retry count
    sessions[sessionIndex] = {
      ...session,
      participants: [
        ...session.participants.filter(p => p.id !== existingParticipant.id),
        existingParticipant
      ]
    };
    
    localStorage.setItem('game_sessions', JSON.stringify(sessions));
    
    return { 
      success: false, 
      message: "You have already participated in this game session.",
      participant: existingParticipant
    };
  }
  
  // Add new participant
  const participant: GameParticipant = {
    id: uuidv4(),
    name,
    ipAddress,
    timestamp: Date.now(),
    retryCount: 0
  };
  
  session.participants.push(participant);
  sessions[sessionIndex] = session;
  
  localStorage.setItem('game_sessions', JSON.stringify(sessions));
  
  return { success: true, participant };
};

// Helper to get a random fake IP for demo purposes
export const getFakeIpAddress = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Export participant data to CSV
export const exportParticipantsToCSV = (gameId: string): string => {
  const session = getGameSession(gameId);
  
  if (!session) return '';
  
  const headers = ['Name', 'IP Address', 'Timestamp', 'Retry Count'];
  const rows = session.participants.map(p => [
    p.name,
    p.ipAddress,
    new Date(p.timestamp).toLocaleString(),
    p.retryCount.toString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Function to mask IP address for privacy
export const maskIpAddress = (ip: string): string => {
  const parts = ip.split('.');
  return `${parts[0]}.${parts[1]}.*.*`;
};

