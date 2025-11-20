import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, date, time } = await request.json()

    // Validar dados recebidos
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ 
        success: false, 
        error: 'Todos os campos são obrigatórios.' 
      }, { status: 400 })
    }

    // Verificar se o Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sistema de agendamento não configurado. Entre em contato com o administrador.' 
      }, { status: 500 })
    }

    // Verificar se o horário já está ocupado
    const { data: existingAppointments, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)

    if (checkError) {
      console.error('Erro ao verificar disponibilidade:', checkError)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao verificar disponibilidade do horário. Tente novamente.' 
      }, { status: 500 })
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Este horário já está ocupado. Por favor, escolha outro horário.' 
      }, { status: 400 })
    }

    // Inserir ou atualizar cliente
    const { data: existingCustomer, error: customerCheckError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    let customerId: string

    if (existingCustomer) {
      // Atualizar informações do cliente se já existir
      const { error: updateError } = await supabase
        .from('customers')
        .update({ name, phone })
        .eq('id', existingCustomer.id)

      if (updateError) {
        console.error('Erro ao atualizar cliente:', updateError)
        return NextResponse.json({ 
          success: false, 
          error: 'Erro ao processar dados do cliente. Tente novamente.' 
        }, { status: 500 })
      }

      customerId = existingCustomer.id
    } else {
      // Criar novo cliente
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert({ name, email, phone })
        .select('id')
        .single()

      if (newCustomerError || !newCustomer) {
        console.error('Erro ao criar cliente:', newCustomerError)
        return NextResponse.json({ 
          success: false, 
          error: 'Erro ao cadastrar cliente. Tente novamente.' 
        }, { status: 500 })
      }

      customerId = newCustomer.id
    }

    // Inserir agendamento
    const { error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        customer_id: customerId,
        date,
        time,
        status: 'confirmed'
      })

    if (appointmentError) {
      console.error('Erro ao criar agendamento:', appointmentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao criar agendamento. Tente novamente.' 
      }, { status: 500 })
    }

    // Gerar mensagem de elogio personalizada com IA
    let message = `Obrigada por agendar conosco, ${name}! Seu horário está confirmado para ${new Date(date).toLocaleDateString('pt-BR')} às ${time}. Enviaremos um lembrete um dia antes. Até breve! 💅✨`

    try {
      if (process.env.OPENAI_API_KEY) {
        const prompt = `Crie uma mensagem calorosa, carinhosa e elogiosa para ${name} que acabou de agendar um horário no Espaço LK para fazer as unhas no dia ${new Date(date).toLocaleDateString('pt-BR')} às ${time}. A mensagem deve:
        - Agradecer pela confiança
        - Fazer um elogio sincero e personalizado
        - Transmitir carinho e acolhimento
        - Ser breve (máximo 3 frases)
        - Ter um tom profissional mas afetuoso
        - Mencionar que enviaremos um lembrete um dia antes`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        })

        message = completion.choices[0].message.content || message
      }
    } catch (aiError) {
      console.error('Erro ao gerar mensagem com IA:', aiError)
      // Continua com a mensagem padrão
    }

    // Agendar notificação para um dia antes
    try {
      const appointmentDate = new Date(date)
      const notificationDate = new Date(appointmentDate)
      notificationDate.setDate(notificationDate.getDate() - 1)

      await supabase
        .from('notifications')
        .insert({
          customer_id: customerId,
          appointment_date: date,
          appointment_time: time,
          notification_date: notificationDate.toISOString().split('T')[0],
          sent: false
        })
    } catch (notificationError) {
      console.error('Erro ao criar notificação:', notificationError)
      // Não falha o agendamento se a notificação falhar
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Erro ao agendar:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro inesperado ao processar agendamento. Tente novamente.' 
    }, { status: 500 })
  }
}
