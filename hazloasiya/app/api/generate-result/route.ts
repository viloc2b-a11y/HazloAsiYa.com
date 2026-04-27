import { NextRequest, NextResponse } from 'next/server'
import { generateFunnelResult } from '@/lib/claude'
import { createClient } from '@/lib/supabase/server'
import { FunnelId } from '@/data/funnels'

export async function POST(req: NextRequest) {
  try {
    const { funnelId, formData } = await req.json()

    const result = await generateFunnelResult(funnelId as FunnelId, formData)

    // Save to Supabase if user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('documents').insert({
        user_id:   user.id,
        funnel:    funnelId,
        form_data: formData,
        result,
      })

      await supabase.from('events').insert({
        user_id: user.id,
        event:   'form_completed',
        funnel:  funnelId,
        data:    { eligible: result.eligible },
      })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    console.error('Generate result error:', err)
    // Return fallback static result on Claude API failure
    return NextResponse.json({
      eligible:    true,
      headline:    'Hazlo así: aquí está tu plan exacto',
      subheadline: 'Basado en tu información personal',
      haveItems:   ['Tu información fue registrada correctamente'],
      missingItems:['Verifica los requisitos con la agencia correspondiente'],
      steps:       ['Revisa los requisitos en el sitio oficial','Reúne todos los documentos indicados','Presenta tu solicitud en persona o en línea'],
    })
  }
}
