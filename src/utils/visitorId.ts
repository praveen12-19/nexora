/**
 * Anonymous Visitor Identifier Utility
 * Generates an anonymous random UUID and persists it in LocalStorage.
 * No personal data, IP addresses, or hardware fingerprinting is ever collected.
 */

const VISITOR_ID_STORAGE_KEY = 'nexora_visitor_id';

function generateRandomUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateVisitorId(): { visitorId: string; isNewVisitor: boolean } {
  try {
    const existing = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (existing && existing.trim().length > 0) {
      return { visitorId: existing, isNewVisitor: false };
    }

    const newId = generateRandomUUID();
    localStorage.setItem(VISITOR_ID_STORAGE_KEY, newId);
    return { visitorId: newId, isNewVisitor: true };
  } catch (err) {
    // If storage is disabled/blocked in private mode, generate ephemeral session id
    return { visitorId: generateRandomUUID(), isNewVisitor: true };
  }
}

export function getVisitorId(): string {
  return getOrCreateVisitorId().visitorId;
}
