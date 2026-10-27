import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Product {
  id: string;
  serialNumber: number;
  title: string;
  subject: string;
  category: string;
  description: string;
  pageCount: number;
  originalPriceINR: number;
  discountPriceINR: number;
  finalPriceINR: number;
  storageKey: string; // e.g. "civil_engineering_complete_notes.pdf"
  fileSizeBytes: number;
  coverGradient: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  productId: string;
  productTitle: string;
  amountPaise: number;
  amountINR: number;
  currency: string;
  status: 'created' | 'authorized' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  orderId: string;
  status: 'active' | 'revoked';
  grantedAt: string;
  revokedAt?: string;
}

export interface WebhookLog {
  eventId: string;
  eventType: string;
  orderId?: string;
  processedAt: string;
  payloadSummary?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  targetId?: string;
  details: string;
}

interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  entitlements: Entitlement[];
  webhookLogs: WebhookLog[];
  auditLogs: AuditLog[];
}

const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
const DB_FILE = path.join(STORAGE_DIR, 'data.json');
export const PRIVATE_PDF_DIR = path.join(STORAGE_DIR, 'private_pdfs');

// Ensure storage directories exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(PRIVATE_PDF_DIR)) {
  fs.mkdirSync(PRIVATE_PDF_DIR, { recursive: true });
}

let dbCache: DatabaseSchema | null = null;

export function loadDatabase(): DatabaseSchema {
  if (dbCache) {
    return dbCache;
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(data);
      return dbCache!;
    } catch (err) {
      console.error('Failed to parse database file, initializing empty schema:', err);
    }
  }
  dbCache = {
    users: [],
    products: [],
    orders: [],
    entitlements: [],
    webhookLogs: [],
    auditLogs: [],
  };
  saveDatabase(dbCache);
  return dbCache;
}

export function saveDatabase(data: DatabaseSchema): void {
  dbCache = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// User helpers
export function findUserByEmail(email: string): User | undefined {
  const db = loadDatabase();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
}

export function findUserById(id: string): User | undefined {
  const db = loadDatabase();
  return db.users.find(u => u.id === id);
}

export function addUser(user: User): User {
  const db = loadDatabase();
  db.users.push(user);
  saveDatabase(db);
  return user;
}

// Product helpers
export function getAllProducts(): Product[] {
  const db = loadDatabase();
  return [...db.products].sort((a, b) => a.serialNumber - b.serialNumber);
}

export function getProductById(id: string): Product | undefined {
  const db = loadDatabase();
  return db.products.find(p => p.id === id);
}

export function addProduct(product: Product): Product {
  const db = loadDatabase();
  db.products.push(product);
  saveDatabase(db);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  // Recalculate finalPriceINR if originalPriceINR or discountPriceINR changed
  const p = db.products[index];
  p.finalPriceINR = Math.max(0, p.originalPriceINR - p.discountPriceINR);
  saveDatabase(db);
  return p;
}

export function deleteProduct(id: string): boolean {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return false;
  db.products.splice(index, 1);
  saveDatabase(db);
  return true;
}

// Order helpers
export function createOrder(order: Order): Order {
  const db = loadDatabase();
  db.orders.push(order);
  saveDatabase(db);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  const db = loadDatabase();
  return db.orders.find(o => o.id === id);
}

export function getOrderByRazorpayOrderId(rpOrderId: string): Order | undefined {
  const db = loadDatabase();
  return db.orders.find(o => o.razorpayOrderId === rpOrderId);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
  const db = loadDatabase();
  const index = db.orders.findIndex(o => o.id === id);
  if (index === -1) return undefined;
  db.orders[index] = { ...db.orders[index], ...updates };
  saveDatabase(db);
  return db.orders[index];
}

export function getOrdersByUserId(userId: string): Order[] {
  const db = loadDatabase();
  return db.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllOrders(): Order[] {
  const db = loadDatabase();
  return [...db.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Entitlement helpers
export function hasUserEntitlement(userId: string, productId: string): boolean {
  const db = loadDatabase();
  return db.entitlements.some(
    e => e.userId === userId && e.productId === productId && e.status === 'active'
  );
}

export function getUserEntitlements(userId: string): Entitlement[] {
  const db = loadDatabase();
  return db.entitlements.filter(e => e.userId === userId && e.status === 'active');
}

export function grantEntitlement(userId: string, userEmail: string, productId: string, orderId: string): Entitlement {
  const db = loadDatabase();
  // Prevent duplicate entitlements
  const existing = db.entitlements.find(
    e => e.userId === userId && e.productId === productId && e.status === 'active'
  );
  if (existing) {
    return existing;
  }
  const entitlement: Entitlement = {
    id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    userEmail,
    productId,
    orderId,
    status: 'active',
    grantedAt: new Date().toISOString(),
  };
  db.entitlements.push(entitlement);
  saveDatabase(db);
  return entitlement;
}

export function revokeEntitlement(orderId: string): boolean {
  const db = loadDatabase();
  let changed = false;
  for (const ent of db.entitlements) {
    if (ent.orderId === orderId && ent.status === 'active') {
      ent.status = 'revoked';
      ent.revokedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) {
    saveDatabase(db);
  }
  return changed;
}

export function getAllEntitlements(): Entitlement[] {
  const db = loadDatabase();
  return [...db.entitlements].sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime());
}

// Webhook log (idempotency check)
export function isWebhookProcessed(eventId: string): boolean {
  const db = loadDatabase();
  return db.webhookLogs.some(w => w.eventId === eventId);
}

export function recordWebhookEvent(eventId: string, eventType: string, orderId?: string, payloadSummary?: string): void {
  const db = loadDatabase();
  if (db.webhookLogs.some(w => w.eventId === eventId)) return;
  db.webhookLogs.push({
    eventId,
    eventType,
    orderId,
    processedAt: new Date().toISOString(),
    payloadSummary,
  });
  saveDatabase(db);
}

// Audit logging
export function addAuditLog(action: string, actorEmail: string, details: string, targetId?: string): void {
  const db = loadDatabase();
  db.auditLogs.push({
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    actorEmail,
    targetId,
    details,
  });
  saveDatabase(db);
}

export function getAuditLogs(): AuditLog[] {
  const db = loadDatabase();
  return [...db.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
