/**
 * Session Tracking Utility
 * Manages active sessions with a 30-minute inactivity sliding window.
 * Ensures page refreshes don't inflate session counts.
 */

const SESSION_STORAGE_KEY = 'nexora_session_id';
const LAST_ACTIVITY_KEY = 'nexora_last_activity';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export interface SessionInfo {
  sessionId: string;
  isNewSession: boolean;
}

export function getOrCreateSession(): SessionInfo {
  const now = Date.now();
  let sessionId = '';
  let isNewSession = false;

  try {
    const existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    const lastActivityTime = lastActivity ? parseInt(lastActivity, 10) : 0;

    const isExpired = !lastActivityTime || now - lastActivityTime > SESSION_TIMEOUT_MS;

    if (existingSessionId && !isExpired) {
      sessionId = existingSessionId;
      isNewSession = false;
    } else {
      // Start a brand new session
      sessionId = generateSessionId();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      isNewSession = true;
    }

    // Refresh last activity timestamp
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  } catch (err) {
    sessionId = generateSessionId();
    isNewSession = true;
  }

  return { sessionId, isNewSession };
}

export function updateSessionActivity(): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (err) {
    // Ignore storage errors in restricted contexts
  }
}
