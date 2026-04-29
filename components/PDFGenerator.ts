'use client'

interface PDFData {
  funnelName: string
  funnelIcon: string
  headline: string
  subheadline: string
  haveItems: string[]
  missingItems: string[]
  steps: string[]
  isPaid: boolean
  userName?: string
}

export async function generatePDF(data: PDFData): Promise<void> {
  // Dependencia declarada en package.json ("jspdf").
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' })

  const W = 612, M = 40
  const NAVY  = [8, 33, 58]   as [number,number,number]
  const GREEN = [10, 158, 82]  as [number,number,number]
  const GOLD  = [192, 122, 12] as [number,number,number]
  const CREAM = [245, 241, 235] as [number,number,number]
  const WHITE = [255, 255, 255] as [number,number,number]
  const GRAY  = [107, 114, 128] as [number,number,number]

  let y = 0

  // ── HEADER ─────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 96, 'F')
  doc.setFillColor(...GREEN)
  doc.rect(0, 93, W, 3, 'F')

  // Logo mark (arrow in rounded square)
  const LX = M, LY = 16, LS = 64, LR = 10
  doc.setFillColor(14, 201, 106)
  doc.roundedRect(LX, LY, LS, LS, LR, LR, 'F')
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(3.5)
  doc.setLineCap('round')
  doc.setLineJoin('round')
  doc.line(LX + 14, LY + 46, LX + 32, LY + 16)
  doc.line(LX + 32, LY + 16, LX + 50, LY + 46)
  doc.line(LX + 32, LY + 16, LX + 32, LY + 50)

  // Wordmark
  const TBX = LX + LS + 14
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('HazloAsiYa', TBX, 46)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 160, 155)
  doc.text('Te decimos exactamente que hacer y como hacerlo — sin errores', TBX, 59)
  doc.text('hazloasiya.com', TBX, 70)

  // Funnel name (right)
  doc.setTextColor(200, 230, 220)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  const today = new Date().toLocaleDateString('es-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const fnW = doc.getTextWidth(`${data.funnelIcon} ${data.funnelName}`)
  doc.text(`${data.funnelName}`, W - M - fnW, 44)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 140, 135)
  doc.text(today, W - M - doc.getTextWidth(today), 56)
  if (data.userName) doc.text(data.userName, W - M - doc.getTextWidth(data.userName), 68)

  y = 116

  // ── HEADLINE ───────────────────────────────────────
  doc.setFillColor(...(data.haveItems.length > 0 ? GREEN : GOLD))
  doc.roundedRect(M, y, W - M * 2, 58, 8, 8, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  const hl = doc.splitTextToSize(data.headline, W - M * 2 - 24)
  doc.text(hl, M + 12, y + 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(220, 255, 235)
  doc.text(data.subheadline || '', M + 12, y + 46)
  y += 72

  // ── HAVE / MISSING ─────────────────────────────────
  const colW = (W - M * 2 - 12) / 2

  // Have column
  doc.setFillColor(...CREAM)
  doc.roundedRect(M, y, colW, Math.max(data.haveItems.length * 22 + 36, 80), 6, 6, 'F')
  doc.setFillColor(...GREEN)
  doc.roundedRect(M, y, colW, 24, 6, 6, 'F')
  doc.roundedRect(M, y + 18, colW, 6, 0, 0, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('✓  LO QUE YA TIENES', M + 10, y + 16)

  let itemY = y + 36
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const haveToShow = data.isPaid ? data.haveItems : data.haveItems.slice(0, 3)
  haveToShow.forEach(item => {
    doc.setTextColor(...GREEN)
    doc.text('✓', M + 8, itemY)
    doc.setTextColor(...NAVY)
    const lines = doc.splitTextToSize(item, colW - 28)
    doc.text(lines, M + 20, itemY)
    itemY += lines.length * 13 + 4
  })

  // Missing column
  const colX = M + colW + 12
  doc.setFillColor(...CREAM)
  doc.roundedRect(colX, y, colW, Math.max(data.missingItems.length * 22 + 36, 80), 6, 6, 'F')
  doc.setFillColor(...GOLD)
  doc.roundedRect(colX, y, colW, 24, 6, 6, 'F')
  doc.roundedRect(colX, y + 18, colW, 6, 0, 0, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('!  LO QUE TE FALTA', colX + 10, y + 16)

  let missY = y + 36
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const missToShow = data.isPaid ? data.missingItems : data.missingItems.slice(0, 3)
  missToShow.forEach(item => {
    doc.setTextColor(...GOLD)
    doc.text('!', colX + 8, missY)
    doc.setTextColor(...NAVY)
    const lines = doc.splitTextToSize(item, colW - 28)
    doc.text(lines, colX + 18, missY)
    missY += lines.length * 13 + 4
  })

  y += Math.max(itemY - y + 16, missY - y + 16, 96)

  // ── STEPS ──────────────────────────────────────────
  y += 12
  doc.setFillColor(...NAVY)
  doc.roundedRect(M, y, W - M * 2, 28, 6, 6, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('HAZLO ASI — PASOS EN ORDEN PARA CERRAR EL TRAMITE', M + 12, y + 18)
  y += 36

  const stepsToShow = data.isPaid ? data.steps : data.steps.slice(0, 3)
  stepsToShow.forEach((step, i) => {
    // Check if need new page
    if (y > 700) {
      doc.addPage()
      y = 40
    }

    // Circle
    doc.setFillColor(...GREEN)
    doc.circle(M + 12, y + 10, 10, 'F')
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`${i + 1}`, M + 12 - (i >= 9 ? 4 : 3), y + 14)

    // Step text
    doc.setTextColor(...NAVY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    const lines = doc.splitTextToSize(step, W - M * 2 - 32)
    doc.text(lines, M + 28, y + 14)

    y += lines.length * 14 + 12
  })

  if (!data.isPaid) {
    // Locked steps notice
    y += 8
    doc.setFillColor(245, 241, 235)
    doc.roundedRect(M, y, W - M * 2, 36, 6, 6, 'F')
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.text(`+ ${data.steps.length - 3} pasos mas disponibles en la guia completa — hazloasiya.com/guia ($19)`, M + 12, y + 22)
    y += 48
  }

  // ── DISCLAIMER ─────────────────────────────────────
  y += 12
  doc.setFillColor(...CREAM)
  doc.roundedRect(M, y, W - M * 2, 52, 6, 6, 'F')
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(2)
  doc.line(M, y, M, y + 52)
  doc.setLineWidth(1)
  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('AVISO IMPORTANTE', M + 12, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text('Este documento fue generado por HazloAsíYa.com con fines informativos. No constituye asesoria', M + 12, y + 26)
  doc.text('legal, migratoria o fiscal. Verifique los requisitos actuales en los sitios oficiales del gobierno.', M + 12, y + 38)

  // ── FOOTER ─────────────────────────────────────────
  const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFillColor(...NAVY)
    doc.rect(0, 762, W, 30, 'F')
    // Mini logo mark
    doc.setFillColor(...GREEN)
    doc.roundedRect(M, 769, 14, 14, 3, 3, 'F')
    doc.setDrawColor(...WHITE)
    doc.setLineWidth(1.2)
    doc.setLineCap('round')
    doc.line(M + 3, 779, M + 7, 772)
    doc.line(M + 7, 772, M + 11, 779)
    doc.line(M + 7, 772, M + 7, 780)
    doc.setTextColor(100, 140, 135)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('HazloAsíYa.com  ·  Haz tus tramites sin errores  ·  No es asesoria legal', M + 18, 781)
    doc.setTextColor(...GRAY)
    const pg = `Pag. ${p} / ${pageCount}`
    doc.text(pg, W - M - doc.getTextWidth(pg), 781)
  }

  doc.save(`HazloAsiYa_${data.funnelName.replace(/\s+/g, '_')}_${Date.now()}.pdf`)
}
