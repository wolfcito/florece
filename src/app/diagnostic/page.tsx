'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '@/components/VoiceRecorder';

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'recording' | 'processing'>('intro');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleStartDiagnostic = () => {
    setStep('recording');
  };

  const handleRecordingComplete = async (blob: Blob) => {
    setAudioBlob(blob);
    setStep('processing');

    try {
      // TODO: Send audio to backend for processing
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response - redirect to plan view
      const mockPlanId = 'plan_' + Date.now();
      router.push(`/plan/${mockPlanId}`);
    } catch (error) {
      console.error('Error processing audio:', error);
      // TODO: Show error state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              Diagnóstico de tu idea
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Cuéntanos sobre tu idea de negocio
            </p>
          </div>

          {/* Content based on step */}
          {step === 'intro' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Qué vamos a hacer?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  En los próximos 3-5 minutos, vamos a explorar tu idea de negocio.
                  Habla naturalmente sobre:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ¿Qué producto o servicio quieres ofrecer?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ¿A quién se lo quieres vender?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ¿Cuánto tiempo puedes dedicarle cada día?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">4.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ¿Cuánto dinero puedes invertir inicialmente?
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartDiagnostic}
                  className="w-full py-4 px-6 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  🎤 Comenzar a grabar
                </button>
              </div>
            </div>
          )}

          {step === 'recording' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}

          {step === 'processing' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center space-y-6">
              <div className="animate-pulse">
                <div className="text-6xl mb-4">🌱</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Analizando tu idea...
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Estamos generando tu plan personalizado de 7 días
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
