import { describe, it, expect } from 'vitest';
import { recommendSuppliers } from '../recommendSuppliers';

describe('recommendSuppliers', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  describe('Happy path', () => {
    it('should recommend MercadoLibre and Alibaba for physical products', async () => {
      const input = {
        productType: 'physical product',
        location: 'Mexico City',
        materials: ['cotton', 'thread'],
        budget: 1000,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        const names = result.data!.suppliers.map((s) => s.name);
        expect(names).toContain('MercadoLibre');
        expect(names).toContain('Alibaba');
      }
    });

    it('should recommend Canva for service-based products', async () => {
      const input = {
        productType: 'service',
        location: 'Buenos Aires',
        materials: [],
        budget: 500,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        const names = result.data!.suppliers.map((s) => s.name);
        expect(names).toContain('Canva');
      }
    });

    it('should return empty suppliers for unrecognized product type', async () => {
      const input = {
        productType: 'blockchain NFT',
        location: 'Lima',
        materials: [],
        budget: 2000,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.suppliers).toHaveLength(0);
      }
    });

    it('should calculate estimated cost based on budget', async () => {
      const input = {
        productType: 'physical product',
        location: 'Bogota',
        materials: ['wood'],
        budget: 5000,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        const mercadoLibre = result.data!.suppliers.find((s) => s.name === 'MercadoLibre');
        expect(mercadoLibre?.estimatedCost).toBe(1500); // 5000 * 0.3
        const alibaba = result.data!.suppliers.find((s) => s.name === 'Alibaba');
        expect(alibaba?.estimatedCost).toBe(1000); // 5000 * 0.2
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for missing productType', async () => {
      const input = {
        productType: '',
        location: 'Mexico City',
        materials: [],
        budget: 1000,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for missing location', async () => {
      const input = {
        productType: 'physical product',
        location: '',
        materials: [],
        budget: 1000,
      };

      const result = await recommendSuppliers(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });
});
