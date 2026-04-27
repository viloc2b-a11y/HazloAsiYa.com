import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'hazloasiya@gmail.com'

export async function sendPurchaseConfirmation({
  to, name, funnel, productName, pdfUrl,
}: { to: string; name: string; funnel: string; productName: string; pdfUrl?: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `✅ Tu guía "${funnel}" está lista — HazloAsíYa`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:#08213A;padding:32px 40px;text-align:center">
          <div style="color:#0A9E52;font-size:28px;font-weight:900;letter-spacing:-1px">HazloAsíYa</div>
          <div style="color:rgba(255,255,255,.6);font-size:13px;margin-top:6px">hazloasiya.com</div>
        </div>
        <div style="padding:40px">
          <h2 style="color:#08213A;margin:0 0 16px">¡Hola, ${name}!</h2>
          <p style="color:#374151;line-height:1.6">Tu pago fue procesado exitosamente. Aquí está lo que compraste:</p>
          <div style="background:#F5F1EB;border-radius:12px;padding:20px 24px;margin:24px 0">
            <div style="font-weight:700;color:#08213A;font-size:16px">${productName}</div>
            <div style="color:#6B7280;font-size:14px;margin-top:4px">Trámite: ${funnel}</div>
          </div>
          ${pdfUrl ? `
          <a href="${pdfUrl}" style="display:block;background:#0A9E52;color:#fff;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;margin:24px 0">
            ⬇️ Descargar mi guía PDF
          </a>` : ''}
          <p style="color:#374151;line-height:1.6;font-size:14px">
            ¿Necesitas ayuda? Escríbenos por WhatsApp:
            <a href="https://wa.me/13468761439" style="color:#0A9E52">
              wa.me/13468761439
            </a>
          </p>
        </div>
        <div style="background:#F5F1EB;padding:20px 40px;text-align:center;color:#9CA3AF;font-size:12px">
          HazloAsíYa · Houston, Texas · No es asesoría legal
        </div>
      </div>
    `,
  })
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Bienvenido/a a HazloAsíYa, ${name} 👋`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#08213A;padding:32px 40px;text-align:center">
          <div style="color:#0A9E52;font-size:28px;font-weight:900">HazloAsíYa</div>
        </div>
        <div style="padding:40px">
          <h2 style="color:#08213A">¡Hola, ${name}!</h2>
          <p style="color:#374151;line-height:1.6">
            Ya tienes acceso a HazloAsíYa — la plataforma que te dice exactamente 
            qué hacer para completar tus trámites en EE.UU. sin errores.
          </p>
          <div style="background:#F5F1EB;border-radius:12px;padding:20px 24px;margin:24px 0">
            <div style="font-weight:700;color:#08213A;margin-bottom:12px">Qué puedes hacer gratis:</div>
            <div style="color:#374151;font-size:14px;line-height:1.8">
              ✅ Completar cualquier cuestionario<br>
              ✅ Ver si calificas para cada trámite<br>
              ✅ Ver los primeros 3 pasos de tu plan<br>
              ✅ Conectar con ayuda local en tu área
            </div>
          </div>
          <p style="color:#374151;font-size:14px">
            Para ver el plan completo con todos los pasos, formularios de ejemplo 
            y errores a evitar, puedes desbloquear la guía por $19 o el acceso 
            anual por $49.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
             style="display:block;background:#0A9E52;color:#fff;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">
            Ir a HazloAsíYa →
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendLeadNotification({
  name, phone, zip, funnel,
}: { name: string; phone: string; zip: string; funnel: string }) {
  return resend.emails.send({
    from: FROM,
    to: 'hazloasiya@gmail.com',
    subject: `🔔 Nuevo lead: ${name} — ${funnel}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px">
        <h3>Nuevo lead recibido</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>ZIP:</strong> ${zip}</p>
        <p><strong>Trámite:</strong> ${funnel}</p>
        <p><strong>Hora:</strong> ${new Date().toLocaleString('es-US', { timeZone: 'America/Chicago' })}</p>
        <a href="https://wa.me/1${phone.replace(/\D/g,'')}?text=Hola+${encodeURIComponent(name)},+te+contactamos+de+HazloAsíYa+sobre+tu+consulta+de+${encodeURIComponent(funnel)}"
           style="background:#25D366;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">
          Contactar por WhatsApp
        </a>
      </div>
    `,
  })
}
