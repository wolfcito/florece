import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createReceipt } from '../createReceipt';

// Mock Firebase Admin
const mockSet = vi.fn();
const mockGet = vi.fn();
const mockWhere = vi.fn(() => ({ get: mockGet }));
const mockReceiptDoc = vi.fn(() => ({ id: 'receipt_123', set: mockSet }));

vi.mock('@/lib/firebase/admin', () => ({
  getFirebaseAdmin: () => ({
    db: {
      collection: (name: string) => {
        if (name === 'actions') {
          return { where: mockWhere };
        }
        if (name === 'receipts') {
          return { doc: mockReceiptDoc };
        }
        return {};
      },
    },
  }),
}));

describe('createReceipt', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSet.mockResolvedValue(undefined);
  });

  describe('Happy path - 100% completion', () => {
    it('should return Amazing message for 100% completion', async () => {
      mockGet.mockResolvedValue({ size: 5 });

      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: ['a1', 'a2', 'a3', 'a4', 'a5'],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.receiptId).toBe('receipt_123');
        expect(result.data!.completedActions).toBe(5);
        expect(result.data!.totalActions).toBe(5);
        expect(result.data!.completionRate).toBe(1);
        expect(result.data!.message).toContain('Amazing');
      }
    });
  });

  describe('Happy path - 80%+ completion', () => {
    it('should return Great job message for 80%+ completion', async () => {
      mockGet.mockResolvedValue({ size: 10 });

      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.completionRate).toBe(0.8);
        expect(result.data!.message).toContain('Great job');
      }
    });
  });

  describe('Happy path - 50%+ completion', () => {
    it('should return halfway message for 50%+ completion', async () => {
      mockGet.mockResolvedValue({ size: 10 });

      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.completionRate).toBe(0.6);
        expect(result.data!.message).toContain('halfway');
      }
    });
  });

  describe('Happy path - <50% completion', () => {
    it('should return encouraging message for <50% completion', async () => {
      mockGet.mockResolvedValue({ size: 10 });

      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: ['a1', 'a2'],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.completionRate).toBe(0.2);
        expect(result.data!.message).toContain('Every step');
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for missing caseId', async () => {
      const input = {
        caseId: '',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: [],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing userId', async () => {
      const input = {
        caseId: 'case_abc',
        userId: '',
        planId: 'plan_456',
        completedActionIds: [],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing planId', async () => {
      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: '',
        completedActionIds: [],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });

  describe('Error handling', () => {
    it('should return DATABASE_ERROR when Firestore fails', async () => {
      mockGet.mockRejectedValue(new Error('Firestore read failed'));

      const input = {
        caseId: 'case_abc',
        userId: 'user_123',
        planId: 'plan_456',
        completedActionIds: ['a1'],
      };

      const result = await createReceipt(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('DATABASE_ERROR');
      expect(result.error?.message).toContain('Firestore read failed');
    });
  });
});
