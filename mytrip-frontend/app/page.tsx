import Link from 'next/link';
import ScrollAnimation from './components/ScrollAnimation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🗺️</span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MyTrip
              </h1>
            </div>
            <nav className="flex gap-2 sm:gap-4">
              <Link 
                href="/criar-roteiro"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Criar Roteiro</span>
                <span className="sm:hidden">Criar</span>
              </Link>
              <Link 
                href="/meus-roteiros"
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Meus Roteiros</span>
                <span className="sm:hidden">Roteiros</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <ScrollAnimation direction="fade">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Planeie a sua viagem perfeita
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">pela Europa</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Roteiros personalizados criados por IA para mais de 20 países europeus. 
              Escolha o destino e o tempo disponível, e criaremos um itinerário detalhado 
              com horários, atrações, restaurantes e experiências locais autênticas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/criar-roteiro"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                🚀 Começar Agora
              </Link>
              <a
                href="#como-funciona"
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors font-semibold text-lg"
              >
                Como Funciona?
              </a>
            </div>
          </div>
        </ScrollAnimation>

        {/* Features Section */}
        <div id="como-funciona" className="mt-24 grid md:grid-cols-3 gap-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Escolha a Região
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha entre 23 países europeus e centenas de destinos: de Lisboa a Santorini, de Paris a Reykjavik.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={200}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Horários Detalhados
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Roteiros com horários específicos (8h-19h), duração de visitas, sugestões de restaurantes e preços reais.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={300}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Orçamento Personalizado
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Defina o seu orçamento diário e receba sugestões de atrações e restaurantes ajustadas ao valor que pretende gastar.
              </p>
            </div>
          </ScrollAnimation>
        </div>

        {/* CTA Section */}
        <ScrollAnimation direction="fade" delay={100}>
          <div className="mt-24 bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para explorar a Europa?
            </h3>
            <p className="text-xl mb-8 text-indigo-100">
              Crie o seu roteiro personalizado com IA em qualquer país europeu - grátis!
            </p>
            <Link
              href="/criar-roteiro"
              className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              Criar Roteiro Grátis →
            </Link>
          </div>
        </ScrollAnimation>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About */}
            <ScrollAnimation direction="up" delay={100}>
              <div>
                <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  🗺️ MyTrip
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  O melhor gerador de roteiros de viagem para Portugal. Planeie a sua aventura perfeita com inteligência artificial.
                </p>
              </div>
            </ScrollAnimation>

            {/* Features */}
            <ScrollAnimation direction="up" delay={200}>
              <div>
                <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Funcionalidades
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>🤖 IA Inteligente</li>
                  <li>📍 Roteiros Personalizados</li>
                  <li>🍽️ Restaurantes Locais</li>
                  <li>🎨 Atrações Culturais</li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Contact */}
            <ScrollAnimation direction="up" delay={300}>
              <div>
                <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Contacto
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://www.linkedin.com/in/miguel-sousa-264629134/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      msousa200@gmail.com
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation direction="fade" delay={400}>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; 2025 MyTrip. Todos os direitos reservados.</p>
            </div>
          </ScrollAnimation>
        </div>
      </footer>
    </div>
  );
}
