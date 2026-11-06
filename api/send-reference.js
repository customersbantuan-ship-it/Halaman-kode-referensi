const TELEGRAM_API = 'https://api.telegram.org';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method tidak diizinkan.' });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return response.status(500).json({ error: 'Konfigurasi Telegram belum tersedia.' });
  }

  const code = typeof request.body?.code === 'string'
    ? request.body.code.replace(/[^0-9]/g, '').slice(0, 6)
    : '';

  if (!code) {
    return response.status(400).json({ error: 'Masukkan kode referensi terlebih dahulu.' });
  }

  const telegramResponse = await fetch(
    `${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `Kode referensi baru: ${code}`
      })
    }
  );

  if (!telegramResponse.ok) {
    return response.status(502).json({ error: 'Telegram tidak dapat menerima pesan.' });
  }

  return response.status(200).json({ ok: true });
}
