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
        expect(result.data.unitMargin).toBe(30); // 50 - 20
        expect(result.data.marginPercentage).toBe(60); // (30/50) * 100
        expect(result.data.monthlyRevenue).toBe(5000); // 50 * 100
        expect(result.data.monthlyProfit).toBe(3000); // 30 * 100
        expect(result.data.breakEvenUnits).toBe(0); // No fixed costs in this simplified version
        expect(result.data.viable).toBe(true);
        expect(result.data.feedback).toContain('viable');
      }
    });

    it('should handle zero fixed costs', async () => {
      const input = {
        productType: 'Servicio digital',
        estimatedCost: 0,
        proposedPrice: 100,
        monthlyVolume: 50,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unitMargin).toBe(100);
        expect(result.data.marginPercentage).toBe(100);
        expect(result.data.monthlyRevenue).toBe(5000);
        expect(result.data.monthlyProfit).toBe(5000);
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
        expect(result.data.unitMargin).toBe(-10);
        expect(result.data.marginPercentage).toBe(-20); // (-10/50) * 100
        expect(result.data.monthlyProfit).toBe(-1000);
        expect(result.data.viable).toBe(false);
        expect(result.data.feedback).toContain('no es viable');
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
        expect(result.data.unitMargin).toBe(0);
        expect(result.data.marginPercentage).toBe(0);
        expect(result.data.monthlyProfit).toBe(0);
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
        expect(result.data.monthlyRevenue).toBe(100);
        expect(result.data.monthlyProfit).toBe(80);
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
        expect(result.data.monthlyRevenue).toBe(20000);
        expect(result.data.monthlyProfit).toBe(10000);
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for missing productType', async () => {
      const input = {
        productType: '',
        estimatedCost: 20,
        proposedPrice: 50,
        monthlyVolume: 100,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

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

    it('should return error for zero or negative volume', async () => {
      const input = {
        productType: 'Test',
        estimatedCost: 20,
        proposedPrice: 50,
        monthlyVolume: 0,
      };

      const result = await computeUnitEconomics(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });
});
