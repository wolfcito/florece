import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createActions } from '../createActions';

// Mock Firebase Admin
const mockSet = vi.fn();
const mockCommit = vi.fn();
const mockDoc = vi.fn(() => ({ id: `action_${Math.random().toString(36).slice(2, 8)}`, set: mockSet }));
const mockCollection = vi.fn(() => ({ doc: mockDoc }));
const mockBatch = vi.fn(() => ({ set: mockSet, commit: mockCommit }));

vi.mock('@/lib/firebase/admin', () => ({
  getFirebaseAdmin: () => ({
    db: {
      collection: mockCollection,
      batch: mockBatch,
    },
  }),
}));

describe('createActions', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCommit.mockResolvedValue(undefined);
  });

  describe('Happy path', () => {
    it('should create actions from multi-day plan', async () => {
      const input = {
        planId: 'plan_123',
        caseId: 'case_abc',
        days: [
          {
            day: 1,
            actions: [
              { title: 'Research market', description: 'Talk to customers', estimatedHours: 2 },
              { title: 'List prospects', description: 'Create a list of 20', estimatedHours: 1 },
            ],
          },
          {
            day: 2,
            actions: [
              { title: 'Build MVP', description: 'Create prototype', estimatedHours: 3 },
            ],
          },
        ],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.count).toBe(3);
        expect(result.data!.actionIds).toHaveLength(3);
      }
      expect(mockBatch).toHaveBeenCalledOnce();
      expect(mockSet).toHaveBeenCalledTimes(3);
      expect(mockCommit).toHaveBeenCalledOnce();
    });

    it('should create a single action', async () => {
      const input = {
        planId: 'plan_456',
        caseId: 'case_def',
        days: [
          {
            day: 1,
            actions: [
              { title: 'One thing', description: 'Do one thing', estimatedHours: 1 },
            ],
          },
        ],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.count).toBe(1);
        expect(result.data!.actionIds).toHaveLength(1);
      }
    });

    it('should set correct action data in Firestore', async () => {
      const input = {
        planId: 'plan_789',
        caseId: 'case_ghi',
        days: [
          {
            day: 3,
            actions: [
              { title: 'Test action', description: 'Test desc', estimatedHours: 2 },
            ],
          },
        ],
      };

      await createActions(input, mockContext);

      expect(mockSet).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          planId: 'plan_789',
          caseId: 'case_ghi',
          day: 3,
          title: 'Test action',
          description: 'Test desc',
          status: 'pending',
          estimatedHours: 2,
        })
      );
    });
  });

  describe('Input validation', () => {
    it('should return error for missing planId', async () => {
      const input = {
        planId: '',
        caseId: 'case_abc',
        days: [{ day: 1, actions: [{ title: 'x', description: 'y', estimatedHours: 1 }] }],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing caseId', async () => {
      const input = {
        planId: 'plan_123',
        caseId: '',
        days: [{ day: 1, actions: [{ title: 'x', description: 'y', estimatedHours: 1 }] }],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for empty days array', async () => {
      const input = {
        planId: 'plan_123',
        caseId: 'case_abc',
        days: [],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });

  describe('Error handling', () => {
    it('should return DATABASE_ERROR when batch commit fails', async () => {
      mockCommit.mockRejectedValue(new Error('Firestore write failed'));

      const input = {
        planId: 'plan_123',
        caseId: 'case_abc',
        days: [
          {
            day: 1,
            actions: [{ title: 'x', description: 'y', estimatedHours: 1 }],
          },
        ],
      };

      const result = await createActions(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('DATABASE_ERROR');
      expect(result.error?.message).toContain('Firestore write failed');
    });
  });
});
