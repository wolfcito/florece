import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl font-bold text-emerald-600 dark:text-emerald-400">
              Florece
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 font-light">
              Tu micro-emprendimiento en 7 días
            </p>
          </div>

          {/* Value Proposition */}
          <div className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ¿Tienes una idea de negocio pero no sabes por dónde empezar?
              Florece te guía paso a paso para validar tu idea, crear un plan de acción
              y generar tus primeras ventas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <div className="text-3xl">🎯</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Plan Personalizado
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generamos un plan de 7 días adaptado a tu idea y tiempo disponible
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-3xl">🎤</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Audio-First
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Habla naturalmente, sin formularios complicados
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-3xl">✅</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Seguimiento Real
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completa acciones y recibe feedback inmediato
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Link
              href="/diagnostic"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Comenzar mi diagnóstico
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Solo toma 5 minutos • Completamente gratuito
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>
          Hecho con 💚 para emprendedores en Latam
        </p>
      </footer>
    </div>
  );
}
