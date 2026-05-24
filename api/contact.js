import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const RATE_LIMIT_WINDOW_MS = 3600_000; // 1 hora
const RATE_LIMIT_MAX_REQUESTS = 5; // Máximo 5 consultas por hora por IP

const requestLog = new Map();
const MESSAGES_FILE = path.join(process.cwd(), 'messages-local.json');

// Schema de validación con Zod
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000)
});

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const previous = requestLog.get(ip) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

function setCorsHeaders(res) {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function saveMessageLocally(contactData) {
  try {
    if (process.env.NODE_ENV === 'production') return false;
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
    messages.push({ ...contactData, receivedAt: new Date().toISOString() });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    return true;
  } catch (err) {
    console.error('[contact] Error local save:', err);
    return false;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados mensajes de contacto. Intente más tarde.' });
  }

  // Validación con Zod
  const validation = ContactSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Datos de contacto inválidos.', details: validation.error.format() });
  }

  const { name, email, message } = validation.data;

  const saved = saveMessageLocally({ name, email, message });
  return saved 
    ? res.status(200).json({ ok: true, savedLocally: true, message: 'Mensaje recibido y registrado localmente.' })
    : res.status(500).json({ error: 'Error al procesar el registro local del mensaje.' });
}
