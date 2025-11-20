import Link from 'next/link'
import { Calendar, Sparkles, Heart, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header com Logo */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2b72e54c-8e5a-4024-8dd5-e69b65d9300f.jpg" 
            alt="Espaço LK - Luana Kwiatkowski" 
            className="h-16 w-auto"
          />
          <Link 
            href="/agendamento"
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-6 py-2.5 rounded-full font-medium hover:from-pink-500 hover:to-rose-500 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Agendar Agora
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Título Principal */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Beleza e Cuidado
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
                para suas Unhas
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Agende seu horário de forma prática e receba mensagens especiais de carinho. 
              Cuidamos de você com profissionalismo e atenção.
            </p>
          </div>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              href="/agendamento"
              className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-500 hover:to-rose-500 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Fazer Agendamento
            </Link>
          </div>

          {/* Diferenciais */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mensagens Personalizadas
              </h3>
              <p className="text-gray-600 text-sm">
                Receba mensagens de carinho criadas por IA especialmente para você
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lembretes Automáticos
              </h3>
              <p className="text-gray-600 text-sm">
                Receba notificações um dia antes do seu agendamento
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Atendimento com Carinho
              </h3>
              <p className="text-gray-600 text-sm">
                Cuidado profissional com atenção especial para cada cliente
              </p>
            </div>
          </div>

          {/* Seção de Confiança */}
          <div className="pt-12 pb-8">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 rounded-3xl border border-pink-100">
              <p className="text-gray-700 text-lg font-medium mb-2">
                ✨ Mais de 500 clientes satisfeitas
              </p>
              <p className="text-gray-600">
                Junte-se às nossas clientes que já experimentam o melhor em cuidados com as unhas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-100 bg-white/60 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p className="text-sm">
            © 2024 Espaço LK - Luana Kwiatkowski. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
