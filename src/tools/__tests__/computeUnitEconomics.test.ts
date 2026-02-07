import { describe, it, expect } from 'vitest';
import { computeUnitEconomics } from '../computeUnitEconomics';

describe('computeUnitEconomics', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  describe('Happy path', () => {
    it('should calculate unit economics correctly for positive margin', async () => {
      const input = {
        productType: 'Tamales caseros',
        estimatedCost: 20,
        proposedPrice: 50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      if (result.success) {
        expect(result.data!.margin).toBeCloseTo(0.6); // (50-20)/50
        expect(result.data!.monthlyRevenue).toBe(5000); // 50 * 100
        expect(result.data!.monthlyCost).toBe(2000); // 20 * 100
        expect(result.data!.monthlyProfit).toBe(3000); // 5000 - 2000
        expect(result.data!.breakEvenUnits).toBeCloseTo(0.6667, 3); // 20/(50-20)
        expect(result.data!.recommendation).toContain('Strong margin');
      }
    });

    it('should handle zero cost (digital service)', async () => {
      const input = {
        productType: 'Servicio digital',
        estimatedCost: 0,
        proposedPrice: 100,
        monthlyVolume: 50,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.margin).toBe(1); // (100-0)/100
        expect(result.data!.monthlyRevenue).toBe(5000);
        expect(result.data!.monthlyCost).toBe(0);
        expect(result.data!.monthlyProfit).toBe(5000);
        expect(result.data!.breakEvenUnits).toBe(0);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle negative margin (cost > price)', async () => {
      const input = {
        productType: 'Producto con pérdida',
        estimatedCost: 60,
        proposedPrice: 50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.margin).toBeCloseTo(-0.2); // (50-60)/50
        expect(result.data!.monthlyProfit).toBe(-1000);
        expect(result.data!.recommendation).toContain('Negative margin');
      }
    });

    it('should handle zero margin (cost = price)', async () => {
      const input = {
        productType: 'Producto sin ganancia',
        estimatedCost: 50,
        proposedPrice: 50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.margin).toBe(0);
        expect(result.data!.monthlyProfit).toBe(0);
      }
    });

    it('should handle very low volume', async () => {
      const input = {
        productType: 'Producto nicho',
        estimatedCost: 20,
        proposedPrice: 100,
        monthlyVolume: 1,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.monthlyRevenue).toBe(100);
        expect(result.data!.monthlyProfit).toBe(80);
      }
    });

    it('should handle very high volume', async () => {
      const input = {
        productType: 'Producto masivo',
        estimatedCost: 1,
        proposedPrice: 2,
        monthlyVolume: 10000,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.monthlyRevenue).toBe(20000);
        expect(result.data!.monthlyProfit).toBe(10000);
      }
    });

    it('should return low margin recommendation for margin under 20%', async () => {
      const input = {
        productType: 'Low margin product',
        estimatedCost: 85,
        proposedPrice: 100,
        monthlyVolume: 10,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.margin).toBeCloseTo(0.15);
        expect(result.data!.recommendation).toContain('Low margin');
      }
    });

    it('should return healthy margin recommendation for margin 20-40%', async () => {
      const input = {
        productType: 'Healthy margin product',
        estimatedCost: 70,
        proposedPrice: 100,
        monthlyVolume: 10,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.margin).toBeCloseTo(0.3);
        expect(result.data!.recommendation).toContain('Healthy margin');
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for negative cost', async () => {
      const input = {
        productType: 'Test',
        estimatedCost: -10,
        proposedPrice: 50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for negative price', async () => {
      const input = {
        productType: 'Test',
        estimatedCost: 20,
        proposedPrice: -50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for negative volume', async () => {
      const input = {
        productType: 'Test',
        estimatedCost: 20,
        proposedPrice: 50,
        monthlyVolume: -1,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for zero price', async () => {
      const input = {
        productType: 'Test',
        estimatedCost: 20,
        proposedPrice: 0,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });
});
