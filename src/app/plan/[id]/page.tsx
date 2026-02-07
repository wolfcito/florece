'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Action {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: string;
  completed: boolean;
}

interface Day {
  day: number;
  focus: string;
  actions: Action[];
}

interface Plan {
  planId: string;
  horizon: string;
  goals: string[];
  days: Day[];
  totalEstimatedHours: number;
}

export default function PlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    // TODO: Fetch plan from API
    // Mock data for now
    const mockPlan: Plan = {
      planId,
      horizon: '7days',
      goals: [
        'Validar demanda hablando con 10 clientes potenciales',
        'Crear una versión mínima viable del producto/servicio',
        'Intentar hacer las primeras 3 ventas',
        'Aprender e iterar basándose en feedback',
      ],
      days: [
        {
          day: 1,
          focus: 'Investigación y Validación',
          actions: [
            {
              id: 'action_1',
              title: 'Identificar y listar 20 clientes potenciales',
              description:
                'Crea una lista de personas o negocios específicos que coincidan con tu mercado objetivo',
              estimatedHours: 2,
              priority: 'high',
              completed: false,
            },
            {
              id: 'action_2',
              title: 'Entrevistar 3 clientes potenciales',
              description:
                'Habla con 3 personas de tu lista, entiende sus necesidades y disposición a pagar',
              estimatedHours: 2,
              priority: 'high',
              completed: false,
            },
          ],
        },
        {
          day: 2,
          focus: 'Diseño del MVP',
          actions: [
            {
              id: 'action_3',
              title: 'Definir alcance del MVP',
              description:
                'Lista las características mínimas absolutas necesarias para resolver el problema central',
              estimatedHours: 1,
              priority: 'high',
              completed: false,
            },
          ],
        },
        // More days...
      ],
      totalEstimatedHours: 28,
    };

    setTimeout(() => {
      setPlan(mockPlan);
      setLoading(false);
    }, 1000);
  }, [planId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando tu plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-600 dark:text-red-400">Plan no encontrado</p>
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

  const currentDay = plan.days.find((d) => d.day === selectedDay);
  const completedActions = plan.days.flatMap((d) => d.actions).filter((a) => a.completed).length;
  const totalActions = plan.days.flatMap((d) => d.actions).length;
  const progressPercent = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Tu Plan de 7 Días
            </h1>
            <Link
              href="/"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ← Inicio
            </Link>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progreso general</span>
              <span>
                {completedActions} de {totalActions} acciones
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            🎯 Objetivos de esta semana
          </h2>
          <ul className="space-y-2">
            {plan.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 mt-1">✓</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {plan.days.map((day) => {
            const dayCompleted = day.actions.every((a) => a.completed);
            return (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedDay === day.day
                    ? 'bg-emerald-600 text-white'
                    : dayCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Día {day.day}
                {dayCompleted && ' ✓'}
              </button>
            );
          })}
        </div>

        {/* Current day details */}
        {currentDay && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Día {currentDay.day}: {currentDay.focus}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentDay.actions.length} acción
                {currentDay.actions.length !== 1 ? 'es' : ''} para hoy
              </p>
            </div>

            {/* Actions list */}
            <div className="space-y-3">
              {currentDay.actions.map((action) => (
                <Link
                  key={action.id}
                  href={`/actions/${action.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        action.completed
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {action.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          action.completed
                            ? 'text-gray-500 dark:text-gray-500 line-through'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {action.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <span>⏱ {action.estimatedHours}h estimadas</span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            action.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {action.priority === 'high' ? 'Alta' : 'Media'} prioridad
                        </span>
                      </div>
                    </div>

                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
