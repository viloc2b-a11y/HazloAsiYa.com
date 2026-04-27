type SendWelcomeEmailArgs = { to: string; name: string }
type SendPurchaseConfirmationArgs = {
  to: string
  name: string
  funnel: string
  productName: string
  pdfUrl?: string
}
type SendLeadNotificationArgs = { name: string; phone: string; zip: string; funnel: string }

async function sendEmailDisabled(kind: string, payload: unknown) {
  console.log(`Email sending disabled (${kind})`, payload)
}

export async function sendWelcomeEmail(args: SendWelcomeEmailArgs) {
  await sendEmailDisabled('welcome', args)
}

export async function sendPurchaseConfirmation(args: SendPurchaseConfirmationArgs) {
  await sendEmailDisabled('purchase_confirmation', args)
}

export async function sendLeadNotification(args: SendLeadNotificationArgs) {
  await sendEmailDisabled('lead_notification', args)
}

