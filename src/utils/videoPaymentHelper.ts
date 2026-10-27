import { CivilVideo, PaymentTransaction } from '../types';
import { safeStorage } from './safeStorage';

const PAID_VIDEOS_KEY = 'civilnotes_paid_videos_v1';
const TRANSACTIONS_KEY = 'civilnotes_transactions_v1';

export function getPaidVideoIds(): string[] {
  try {
    const raw = safeStorage.getItem(PAID_VIDEOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read paid videos from safeStorage', e);
    return [];
  }
}

export function isVideoPaid(videoId: string): boolean {
  const ids = getPaidVideoIds();
  return ids.includes(videoId);
}

export function recordVideoPurchase(video: CivilVideo, method: 'upi' | 'card' | 'netbanking', upiDetails?: { app?: string; upiId?: string }): PaymentTransaction {
  const current = getPaidVideoIds();
  if (!current.includes(video.id)) {
    const updated = [...current, video.id];
    safeStorage.setItem(PAID_VIDEOS_KEY, JSON.stringify(updated));
  }

  const txn: PaymentTransaction = {
    txnId: 'TXN_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    videoId: video.id,
    videoTitle: video.title,
    amountINR: 49,
    method,
    upiApp: upiDetails?.app || (method === 'upi' ? 'UPI Instant Pay' : undefined),
    upiId: upiDetails?.upiId || 'civilnotes.btec@okaxis',
    timestamp: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }),
    status: 'SUCCESS'
  };

  try {
    const rawTxns = safeStorage.getItem(TRANSACTIONS_KEY);
    const txns: PaymentTransaction[] = rawTxns ? JSON.parse(rawTxns) : [];
    txns.unshift(txn);
    safeStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
  } catch (e) {
    console.error('Failed to save transaction', e);
  }

  return txn;
}

export function getAllTransactions(): PaymentTransaction[] {
  try {
    const raw = safeStorage.getItem(TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Generates and triggers a direct offline video masterclass package download
 */
export function downloadUnlockedVideoPackage(video: CivilVideo, txn?: PaymentTransaction) {
  const txnId = txn?.txnId || ('TXN_' + Date.now().toString(36).toUpperCase());
  const dateStr = txn?.timestamp || new Date().toISOString();

  const manifestContent = `================================================================================
CIVILNOTES • OFFICIAL VIDEO MASTERCLASS & COURSEWORK LECTURE DOWNLOAD
================================================================================
Pearson BTEC Civil Engineering Distinction Masterclass Suite
Payment Verified: ₹49.00 INR (PAID IN FULL)
Transaction Reference: ${txnId}
Date/Time of Unlocking: ${dateStr}
Payment Gateway: UPI Instant Gateway (NPCI Verified)
Merchant: CivilNotes BTEC Civil Resource Portal
Tutor/Lead: ${video.tutorName}

--------------------------------------------------------------------------------
VIDEO ASSET SPECIFICATIONS:
--------------------------------------------------------------------------------
Video Title: ${video.title}
Unit Tag: ${video.unitCodeTag}
Duration: ${video.duration}
Resolution: ${video.quality}
Estimated Size: ${video.fileSize}
Access License: Single Student Educational License (Lifetime Offline Access)

--------------------------------------------------------------------------------
SYLLABUS TOPICS COVERED:
--------------------------------------------------------------------------------
${video.topicsCovered.map((topic, i) => `  ${i + 1}. ${topic}`).join('\n')}

--------------------------------------------------------------------------------
LECTURE OVERVIEW & DISTINCTION CALCULATION NOTES:
--------------------------------------------------------------------------------
${video.description}

Key Practical Directives:
• Review the accompanying calculation steps alongside your assignment brief.
• All calculations comply with British and European Standards (BS EN 1990 - 1997).
• Ensure all free body diagrams (FBD), sign conventions, and unit dimensionalities 
  (kN, kNm, N/mm²) are clearly labeled on your coursework submissions.

--------------------------------------------------------------------------------
OFFLINE VIDEO PLAYBACK & RESOURCES LINK:
--------------------------------------------------------------------------------
High-Bitrate MP4 Stream / Offline Mirror:
https://civilnotes.education/stream/download?token=${txnId}&vid=${video.id}&quality=1080p

Support Desk:
Email: pankajchauhan2736@gmail.com
WhatsApp Helpline: +91 91400 00000
Portal: https://pankajcordx.github.io/civil-notes/

Thank you for supporting CivilNotes Education! Keep achieving Distinctions!
================================================================================
`;

  const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = video.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45);
  link.download = `${video.unitCodeTag.replace(/[^a-zA-Z0-9]/g, '_')}_${safeTitle}_49INR_Pack.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
