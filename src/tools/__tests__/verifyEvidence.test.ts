import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyEvidence } from '../verifyEvidence';

// Mock Firebase Admin
const mockDownload = vi.fn();
const mockExists = vi.fn();
const mockGetMetadata = vi.fn();
const mockFile = vi.fn(() => ({
  exists: mockExists,
  getMetadata: mockGetMetadata,
  download: mockDownload,
}));
const mockBucket = vi.fn(() => ({ file: mockFile }));

vi.mock('@/lib/firebase/admin', () => ({
  getFirebaseAdmin: () => ({
    storage: {
      bucket: mockBucket,
    },
  }),
}));

// Mock Gemini AI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  })),
}));

// Mock env
vi.mock('@/lib/env', () => ({
  getServerEnv: () => 'fake-key',
}));

describe('verifyEvidence', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
    mockExists.mockResolvedValue([true]);
    mockDownload.mockResolvedValue([Buffer.from('fake-data')]);
  });

  describe('Image verification', () => {
    it('should verify image evidence successfully', async () => {
      mockGetMetadata.mockResolvedValue([{ contentType: 'image/jpeg' }]);
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            verified: true,
            confidence: 0.9,
            reasoning: 'La imagen muestra evidencia clara de la acción completada.',
          }),
        },
      });

      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'gs://my-bucket/evidence/photo.jpg',
        fileType: 'image' as const,
        actionDescription: 'Take a photo of the market stall',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.verified).toBe(true);
        expect(result.data!.confidence).toBe(0.9);
        expect(result.data!.reasoning).toBeTruthy();
      }
    });

    it('should reject unrelated image evidence', async () => {
      mockGetMetadata.mockResolvedValue([{ contentType: 'image/png' }]);
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            verified: false,
            confidence: 0.2,
            reasoning: 'La imagen no muestra relación con la acción descrita.',
            suggestions: ['Upload a photo showing the completed action'],
          }),
        },
      });

      const input = {
        actionId: 'action_2',
        evidenceId: 'ev_2',
        fileUrl: 'gs://my-bucket/evidence/unrelated.png',
        fileType: 'image' as const,
        actionDescription: 'Interview 3 potential customers',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.verified).toBe(false);
        expect(result.data!.suggestions).toBeDefined();
      }
    });
  });

  describe('Audio verification', () => {
    it('should verify audio evidence successfully', async () => {
      mockGetMetadata.mockResolvedValue([{ contentType: 'audio/webm' }]);
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            verified: true,
            confidence: 0.85,
            reasoning: 'El audio contiene una conversación de entrevista con un cliente potencial.',
          }),
        },
      });

      const input = {
        actionId: 'action_3',
        evidenceId: 'ev_3',
        fileUrl: 'gs://my-bucket/evidence/interview.webm',
        fileType: 'audio' as const,
        actionDescription: 'Record customer interview',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.verified).toBe(true);
        expect(result.data!.confidence).toBe(0.85);
      }
    });
  });

  describe('Document fallback', () => {
    it('should accept documents with moderate confidence', async () => {
      mockGetMetadata.mockResolvedValue([{ contentType: 'application/pdf' }]);

      const input = {
        actionId: 'action_4',
        evidenceId: 'ev_4',
        fileUrl: 'gs://my-bucket/evidence/report.pdf',
        fileType: 'document' as const,
        actionDescription: 'Create pricing proposal',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.verified).toBe(true);
        expect(result.data!.confidence).toBe(0.7);
        expect(result.data!.reasoning).toContain('Document uploaded');
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for missing actionId', async () => {
      const input = {
        actionId: '',
        evidenceId: 'ev_1',
        fileUrl: 'gs://bucket/file.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing evidenceId', async () => {
      const input = {
        actionId: 'action_1',
        evidenceId: '',
        fileUrl: 'gs://bucket/file.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing fileUrl', async () => {
      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: '',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing actionDescription', async () => {
      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'gs://bucket/file.jpg',
        fileType: 'image' as const,
        actionDescription: '',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for invalid gs:// URL format', async () => {
      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'https://example.com/file.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
      expect(result.error?.message).toContain('gs://');
    });
  });

  describe('Error handling', () => {
    it('should return error when file not found in storage', async () => {
      mockExists.mockResolvedValue([false]);
      mockGetMetadata.mockResolvedValue([{ contentType: 'image/jpeg' }]);

      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'gs://my-bucket/evidence/missing.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(result.error?.message).toContain('not found');
    });

    it('should return error when Gemini API fails', async () => {
      mockGetMetadata.mockResolvedValue([{ contentType: 'image/jpeg' }]);
      mockGenerateContent.mockRejectedValue(new Error('Gemini API rate limit'));

      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'gs://my-bucket/evidence/photo.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(result.error?.message).toContain('Gemini API rate limit');
    });

    it('should return error when GEMINI_API_KEY is missing', async () => {
      delete process.env.GEMINI_API_KEY;

      const input = {
        actionId: 'action_1',
        evidenceId: 'ev_1',
        fileUrl: 'gs://my-bucket/evidence/photo.jpg',
        fileType: 'image' as const,
        actionDescription: 'Some action',
      };

      const result = await verifyEvidence(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(result.error?.message).toContain('GEMINI_API_KEY');
    });
  });
});
