import { describe, it, expect } from 'vitest';
import { publishVenture } from '../publishVenture';

describe('publishVenture', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  describe('Happy path', () => {
    it('should return published URL containing caseId', async () => {
      const input = {
        caseId: 'case_abc_123',
        productName: 'Tamales Don Pedro',
        description: 'Delicious homemade tamales',
        imageUrls: ['https://example.com/image.jpg'],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.publishedUrl).toContain('case_abc_123');
        expect(result.data!.publishedUrl).toContain('florece.app/ventures/');
      }
    });

    it('should return shareable text containing product name', async () => {
      const input = {
        caseId: 'case_xyz',
        productName: 'EcoClean Services',
        description: 'Eco-friendly cleaning solutions',
        imageUrls: [],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.shareableText).toContain('EcoClean Services');
        expect(result.data!.shareableText).toContain('Eco-friendly cleaning solutions');
      }
    });

    it('should handle venture with no images', async () => {
      const input = {
        caseId: 'case_no_img',
        productName: 'Digital Consulting',
        description: 'Tech consulting for startups',
        imageUrls: [],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.publishedUrl).toBeTruthy();
        expect(result.data!.shareableText).toBeTruthy();
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for missing caseId', async () => {
      const input = {
        caseId: '',
        productName: 'Test Product',
        description: 'Test description',
        imageUrls: [],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing productName', async () => {
      const input = {
        caseId: 'case_123',
        productName: '',
        description: 'Test description',
        imageUrls: [],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing description', async () => {
      const input = {
        caseId: 'case_123',
        productName: 'Test Product',
        description: '',
        imageUrls: [],
      };

      const result = await publishVenture(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });
});
