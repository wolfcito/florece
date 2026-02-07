'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EvidenceUpload from '@/components/EvidenceUpload';

interface Action {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: string;
  completed: boolean;
  day: number;
  planId: string;
  tips?: string[];
  evidenceRequired: boolean;
}

export default function ActionPage() {
  const params = useParams();
  const router = useRouter();
  const actionId = params.id as string;

  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);

  useEffect(() => {
    // TODO: Fetch action from API
    // Mock data for now
    const mockAction: Action = {
      id: actionId,
      title: 'Identificar y listar 20 clientes potenciales',
      description:
        'Crea una lista de personas o negocios específicos que coincidan con tu mercado objetivo. No te limites a descripciones genéricas - necesitas nombres reales y formas de contactarlos.',
      estimatedHours: 2,
      priority: 'high',
      completed: false,
      day: 1,
      planId: 'plan_123',
      tips: [
        'Usa redes sociales para encontrar personas que hablen de problemas que tu producto resuelve',
        'Pregunta a amigos y familiares si conocen a alguien que encaje en tu mercado',
        'Visita lugares físicos donde tu cliente ideal pasa tiempo',
        'No te preocupes por ser perfecto - es mejor una lista imperfecta que ninguna lista',
      ],
      evidenceRequired: true,
    };

    setTimeout(() => {
      setAction(mockAction);
      setLoading(false);
    }, 500);
  }, [actionId]);

  const handleMarkComplete = () => {
    if (action?.evidenceRequired) {
      setShowEvidenceUpload(true);
    } else {
      // TODO: Mark as complete via API
      if (action) {
        setAction({ ...action, completed: true });
        setTimeout(() => {
          router.push(`/plan/${action.planId}`);
        }, 1000);
      }
    }
  };

  const handleEvidenceUploaded = () => {
    // TODO: Update action status via API
    if (action) {
      setAction({ ...action, completed: true });
      setTimeout(() => {
        router.push(`/plan/${action.planId}`);
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando acción...</p>
        </div>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-600 dark:text-red-400">Acción no encontrada</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href={`/plan/${action.planId}`}
            className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al plan
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Status badge */}
        {action.completed && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                ¡Acción completada!
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Excelente trabajo. Sigue así.
              </p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Day & Priority */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
              Día {action.day}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                action.priority === 'high'
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
              }`}
            >
              {action.priority === 'high' ? 'Alta' : 'Media'} prioridad
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
              ⏱ {action.estimatedHours}h estimadas
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {action.title}
          </h1>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300">{action.description}</p>
          </div>

          {/* Tips section */}
          {action.tips && action.tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <span>💡</span>
                Tips para completar esta acción
              </h2>
              <ul className="space-y-2">
                {action.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-blue-800 dark:text-blue-200"
                  >
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence upload section */}
          {showEvidenceUpload && !action.completed ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Sube tu evidencia
              </h2>
              <EvidenceUpload
                actionId={action.id}
                actionDescription={action.description}
                onUploadComplete={handleEvidenceUploaded}
              />
            </div>
          ) : (
            !action.completed && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                  onClick={handleMarkComplete}
                  className="w-full py-4 px-6 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  {action.evidenceRequired
                    ? '📸 Subir evidencia y marcar como completada'
                    : '✓ Marcar como completada'}
                </button>
                {action.evidenceRequired && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3">
                    Necesitamos una foto, audio o documento como evidencia
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
