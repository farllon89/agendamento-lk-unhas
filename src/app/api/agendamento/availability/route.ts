import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Data é obrigatória' }, { status: 400 })
    }

    // Buscar todos os horários já agendados para a data específica
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)

    if (error) throw error

    // Extrair apenas os horários ocupados
    const bookedSlots = appointments?.map(apt => apt.time) || []

    return NextResponse.json({ bookedSlots })
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return NextResponse.json({ 
      error: 'Erro ao verificar disponibilidade' 
    }, { status: 500 })
  }
}
