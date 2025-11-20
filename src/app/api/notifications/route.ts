import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { supabase } from '@/lib/supabase'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function GET() {
  try {
    // Buscar agendamentos para amanhã
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (name, email)
      `)
      .eq('date', dateStr)
      .eq('status', 'pending')

    if (error) throw error

    for (const appointment of appointments) {
      const msg = {
        to: appointment.customers.email,
        from: 'noreply@lkunhas.com', // Substituir por email real
        subject: 'Lembrete: Seu agendamento amanhã',
        text: `Olá ${appointment.customers.name}, lembre-se do seu agendamento para manicure/pedicure amanhã às ${appointment.time}. Estamos ansiosas para cuidar de você!`,
      }
      await sgMail.send(msg)
    }

    return NextResponse.json({ success: true, sent: appointments.length })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Erro ao enviar notificações' }, { status: 500 })
  }
}