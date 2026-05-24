import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_WINDOW_MS = 3600_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map();

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

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados mensajes. Intenta más tarde.' });
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (name.length < 2 || !emailRegex.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'Campos demasiado cortos.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ExeSistemasWEB <onboarding@resend.dev>',
      to: ['exeme@live.com.ar'], // Tu correo de destino
      subject: `🚀 Nuevo contacto: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Has recibido un nuevo mensaje</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f4f4f4; padding: 15px; border-left: 4px solid #00cfd5;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('[contact] Error de Resend:', error);
      return res.status(500).json({ error: 'Error al enviar el email.' });
    }

    console.log(`[contact] Mensaje de ${name} enviado con éxito. ID: ${data.id}`);
    return res.status(200).json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('[contact] Excepción:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
