'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, Clock, CheckCircle2, AlertCircle, Settings } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
})

type FormData = z.infer<typeof schema>

interface AvailableSlot {
  time: string
  available: boolean
}

export default function Agendamento() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [success, setSuccess] = useState(false)
  const [configError, setConfigError] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const watchedDate = watch('date')
  const watchedTime = watch('time')

  // Horários disponíveis (9h às 18h)
  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ]

  useEffect(() => {
    if (watchedDate) {
      checkAvailability(watchedDate)
    } else {
      setAvailableSlots([])
    }
  }, [watchedDate])

  const checkAvailability = async (date: string) => {
    setLoadingSlots(true)
    setConfigError(false)
    try {
      const response = await fetch(`/api/agendamento/availability?date=${date}`)
      const data = await response.json()
      
      if (!response.ok && response.status === 500) {
        setConfigError(true)
        setAvailableSlots([])
        return
      }
      
      const slots = allTimeSlots.map(time => ({
        time,
        available: !data.bookedSlots.includes(time)
      }))
      
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error)
      setConfigError(true)
      setAvailableSlots([])
    }
    setLoadingSlots(false)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setSuccess(false)
    setMessage('')
    setConfigError(false)
    
    try {
      const response = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage(result.message)
        setSuccess(true)
        // Resetar formulário
        reset()
        setAvailableSlots([])
      } else {
        setMessage(result.error || 'Erro ao agendar. Tente novamente.')
        setSuccess(false)
        
        // Verificar se é erro de configuração
        if (result.error.includes('não configurado')) {
          setConfigError(true)
        }
      }
    } catch (error) {
      console.error('Erro ao agendar:', error)
      setMessage('Erro ao conectar com o servidor. Verifique sua conexão.')
      setSuccess(false)
    }
    
    setLoading(false)
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Agende seu Horário
          </h1>
          <p className="text-gray-600">Escolha o melhor dia e horário para você</p>
        </div>

        {/* Alerta de Configuração */}
        {configError && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border-2 border-orange-200 flex items-start gap-3">
            <Settings className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Sistema de Agendamento Não Configurado</h3>
              <p className="text-sm text-orange-800 mb-3">
                Para usar o sistema de agendamento, você precisa conectar sua conta Supabase.
              </p>
              <div className="space-y-2 text-sm text-orange-800">
                <p className="font-medium">Como configurar:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Vá em <strong>Configurações do Projeto</strong></li>
                  <li>Clique em <strong>Integrações</strong></li>
                  <li>Conecte sua conta <strong>Supabase</strong></li>
                  <li>Volte aqui e recarregue a página</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input 
                  {...register('name')} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  placeholder="Seu nome"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  {...register('email')} 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone/WhatsApp
                </label>
                <input 
                  {...register('phone')} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data
                </label>
                <input 
                  {...register('date')} 
                  type="date" 
                  min={minDate}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  onChange={(e) => {
                    setValue('date', e.target.value)
                    setValue('time', '') // Limpar horário ao mudar data
                  }}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
              </div>

              {watchedDate && watchedTime && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horário Selecionado
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-pink-300 bg-pink-50">
                    <Clock className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold text-pink-700">
                      {watchedTime}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}

              <button 
                type="submit" 
                disabled={loading || !watchedTime || configError}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${success ? 'text-green-800' : 'text-red-800'}`}>
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Horários Disponíveis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-pink-600" />
              Horários Disponíveis
            </h2>

            {configError ? (
              <div className="text-center py-12 text-orange-600">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sistema não configurado</p>
                <p className="text-sm mt-2">Configure o Supabase para ver horários</p>
              </div>
            ) : !watchedDate ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Selecione uma data primeiro</p>
                <p className="text-sm mt-2">Os horários disponíveis aparecerão aqui</p>
              </div>
            ) : loadingSlots ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                <p className="text-gray-500 mt-3">Carregando horários...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setValue('time', slot.time)}
                      className={`py-3 px-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        watchedTime === slot.time
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
                          : slot.available
                          ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-400 hover:bg-pink-50 hover:scale-105'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                      <span className="text-gray-600">Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded"></div>
                      <span className="text-gray-600">Ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded"></div>
                      <span className="text-gray-600">Selecionado</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Nenhum horário disponível</p>
                <p className="text-sm mt-2">Tente selecionar outra data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
