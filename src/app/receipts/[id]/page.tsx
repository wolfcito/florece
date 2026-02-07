'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Receipt {
  receiptId: string;
  planId: string;
  userId: string;
  generatedAt: string;
  completionRate: number;
  totalActions: number;
  completedActions: number;
  totalHoursInvested: number;
  motivationalMessage: string;
  nextSteps: string[];
  achievements: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export default function ReceiptPage() {
  const params = useParams();
  const receiptId = params.id as string;

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch receipt from API
    // Mock data for now
    const mockReceipt: Receipt = {
      receiptId,
      planId: 'plan_123',
      userId: 'user_123',
      generatedAt: new Date().toISOString(),
      completionRate: 85,
      totalActions: 14,
      completedActions: 12,
      totalHoursInvested: 22,
      motivationalMessage:
        '¡Increíble progreso! Has completado el 85% de tu plan. Estás muy cerca de validar tu idea de negocio. Los próximos pasos son cruciales para cerrar esta primera fase.',
      nextSteps: [
        'Completa las 2 acciones pendientes del día 7',
        'Revisa los resultados y métricas obtenidas',
        'Decide si continuas, pivotas o pruebas otra idea',
        'Si continuas, genera un plan para la semana 2',
      ],
      achievements: [
        {
          icon: '🎯',
          title: 'Validación de mercado',
          description: 'Hablaste con 10+ clientes potenciales',
        },
        {
          icon: '🚀',
          title: 'MVP creado',
          description: 'Construiste una versión mínima viable',
        },
        {
          icon: '💰',
          title: 'Primeras ventas',
          description: 'Lograste cerrar 3 ventas exitosamente',
        },
        {
          icon: '📈',
          title: 'Aprendizaje continuo',
          description: 'Iteraste basándote en feedback real',
        },
      ],
    };

    setTimeout(() => {
      setReceipt(mockReceipt);
      setLoading(false);
    }, 500);
  }, [receiptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generando tu recibo...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-600 dark:text-red-400">Recibo no encontrado</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 text-white bg-emerald-600 rounded-full hover:bg-emerald-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const completionPercent = Math.round(receipt.completionRate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-7xl">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            ¡Felicitaciones!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Tu recibo de progreso - Semana 1
          </p>
        </div>

        {/* Main receipt card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Completion banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium opacity-90">Progreso general</span>
              <span className="text-3xl font-bold">{completionPercent}%</span>
            </div>
            <div className="w-full bg-emerald-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {receipt.completedActions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Acciones completadas
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {receipt.totalHoursInvested}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Horas invertidas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">7</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Días trabajados</p>
            </div>
          </div>

          {/* Motivational message */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {receipt.motivationalMessage}
            </p>
          </div>

          {/* Achievements */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              🏆 Logros obtenidos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {receipt.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              📋 Próximos pasos
            </h2>
            <ul className="space-y-3">
              {receipt.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/plan/${receipt.planId}`}
            className="flex-1 py-4 px-6 text-center text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Ver mi plan completo
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 px-6 text-center text-lg font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors"
          >
            📥 Descargar recibo
          </button>
        </div>

        {/* Share section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Orgulloso de tu progreso?</h2>
          <p className="mb-6 opacity-90">Comparte tu logro con tu red</p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              🐦 Twitter
            </button>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              💼 LinkedIn
            </button>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              📱 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
