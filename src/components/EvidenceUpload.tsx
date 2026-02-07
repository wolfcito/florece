'use client';

import { useState, useRef } from 'react';

interface EvidenceUploadProps {
  actionId: string;
  actionDescription: string;
  onUploadComplete: () => void;
}

type FileType = 'image' | 'audio' | 'document';
type UploadStatus = 'idle' | 'uploading' | 'verifying' | 'success' | 'error';

export default function EvidenceUpload({
  actionId,
  actionDescription,
  onUploadComplete,
}: EvidenceUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    confidence: number;
    reasoning: string;
    suggestions?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es muy grande. Máximo 10MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFileType(detectFileType(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileType) return;

    try {
      setUploadStatus('uploading');
      setError(null);

      // Step 1: Get signed upload URL
      const uploadResponse = await fetch('/api/upload-evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_token', // TODO: Use real auth token
        },
        body: JSON.stringify({
          actionId,
          caseId: 'mock_case_id', // TODO: Use real case ID
          fileType,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const uploadData = await uploadResponse.json();
      const { uploadUrl, evidenceId, fileUrl } = uploadData;

      // Step 2: Upload file to Firebase Storage
      const uploadFileResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadFileResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Verify evidence
      setUploadStatus('verifying');

      const verifyResponse = await fetch('/api/verify-evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_token', // TODO: Use real auth token
        },
        body: JSON.stringify({
          actionId,
          evidenceId,
          fileUrl,
          fileType,
          actionDescription,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify evidence');
      }

      const verifyData = await verifyResponse.json();

      setVerificationResult(verifyData);
      setUploadStatus('success');

      // If verified, complete the action
      if (verifyData.verified) {
        setTimeout(() => {
          onUploadComplete();
        }, 2000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
      setUploadStatus('error');
    }
  };

  const handleRetry = () => {
    setSelectedFile(null);
    setFileType(null);
    setUploadStatus('idle');
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* File input */}
      {uploadStatus === 'idle' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors text-center"
            >
              <div className="space-y-3">
                <div className="text-5xl">📎</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Selecciona un archivo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Foto, audio o documento (máx. 10MB)
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {fileType === 'image' && '🖼️'}
                  {fileType === 'audio' && '🎤'}
                  {fileType === 'document' && '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleUpload}
                className="w-full py-3 px-6 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
              >
                Subir y verificar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Uploading state */}
      {uploadStatus === 'uploading' && (
        <div className="text-center py-12 space-y-4">
          <div className="text-5xl animate-bounce">📤</div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Subiendo archivo...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Esto puede tomar unos segundos
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Verifying state */}
      {uploadStatus === 'verifying' && (
        <div className="text-center py-12 space-y-4">
          <div className="text-5xl animate-pulse">🔍</div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Verificando evidencia...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Nuestra IA está analizando tu evidencia
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Success state */}
      {uploadStatus === 'success' && verificationResult && (
        <div
          className={`rounded-xl p-6 ${
            verificationResult.verified
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">
              {verificationResult.verified ? '✅' : '⚠️'}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p
                  className={`text-lg font-semibold ${
                    verificationResult.verified
                      ? 'text-emerald-900 dark:text-emerald-100'
                      : 'text-yellow-900 dark:text-yellow-100'
                  }`}
                >
                  {verificationResult.verified
                    ? '¡Evidencia verificada!'
                    : 'Evidencia necesita revisión'}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    verificationResult.verified
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  Confianza: {(verificationResult.confidence * 100).toFixed(0)}%
                </p>
              </div>

              <p
                className={
                  verificationResult.verified
                    ? 'text-emerald-800 dark:text-emerald-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }
              >
                {verificationResult.reasoning}
              </p>

              {!verificationResult.verified && verificationResult.suggestions && (
                <div className="space-y-2">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Sugerencias:
                  </p>
                  <ul className="space-y-1">
                    {verificationResult.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200"
                      >
                        <span className="text-yellow-600 dark:text-yellow-400">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleRetry}
                    className="mt-4 px-6 py-2 text-sm font-semibold text-yellow-900 dark:text-yellow-100 bg-yellow-200 dark:bg-yellow-800 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {(error || uploadStatus === 'error') && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">❌</div>
            <div className="flex-1 space-y-3">
              <p className="text-lg font-semibold text-red-900 dark:text-red-100">
                Error al subir evidencia
              </p>
              <p className="text-red-800 dark:text-red-200">
                {error || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 text-sm font-semibold text-red-900 dark:text-red-100 bg-red-200 dark:bg-red-800 rounded-full hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
