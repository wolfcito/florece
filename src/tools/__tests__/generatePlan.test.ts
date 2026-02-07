import { describe, it, expect } from 'vitest';
import { generatePlan } from '../generatePlan';

describe('generatePlan', () => {
  const mockContext = {
    userId: 'test_user',
    caseId: 'test_case',
  };

  describe('Happy path', () => {
    it('should generate a 7-day plan with correct structure', async () => {
      const input = {
        productDescription: 'Tamales caseros',
        targetMarket: 'Oficinas en zona centro',
        availableHoursPerDay: 4,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      if (result.success) {
        const plan = result.data!;

        // Verify plan ID format
        expect(plan.planId).toMatch(/^plan_\d+_test_case$/);

        // Verify horizon
        expect(plan.horizon).toBe('7days');

        // Verify goals exist
        expect(plan.goals).toBeInstanceOf(Array);
        expect(plan.goals.length).toBeGreaterThan(0);

        // Verify 7 days
        expect(plan.days).toBeInstanceOf(Array);
        expect(plan.days).toHaveLength(7);

        // Verify each day structure
        plan.days.forEach((day, index) => {
          expect(day.day).toBe(index + 1);
          expect(day.focus).toBeTruthy();
          expect(day.actions).toBeInstanceOf(Array);
          expect(day.actions.length).toBeGreaterThan(0);

          // Verify action structure
          day.actions.forEach((action) => {
            expect(action.title).toBeTruthy();
            expect(action.description).toBeTruthy();
            expect(action.estimatedHours).toBeGreaterThan(0);
            expect(action.priority).toMatch(/^(high|medium|low)$/);
          });
        });

        // Verify total estimated hours
        expect(plan.totalEstimatedHours).toBe(input.availableHoursPerDay * 7);
      }
    });

    it('should handle different available hours', async () => {
      const input = {
        productDescription: 'Servicio de consultoría',
        targetMarket: 'Empresas tech',
        availableHoursPerDay: 2,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.totalEstimatedHours).toBe(14); // 2 * 7
      }
    });

    it('should handle full-time availability', async () => {
      const input = {
        productDescription: 'Startup',
        targetMarket: 'Consumidores',
        availableHoursPerDay: 8,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.totalEstimatedHours).toBe(56); // 8 * 7
      }
    });
  });

  describe('Plan content validation', () => {
    it('should include realistic actions for each day', async () => {
      const input = {
        productDescription: 'E-commerce',
        targetMarket: 'Millennials',
        availableHoursPerDay: 6,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        const plan = result.data!;

        // Day 1 should focus on Research & Validation
        expect(plan.days[0].focus).toContain('Research & Validation');

        // Each day should have 1-5 actions (reasonable for MVP)
        plan.days.forEach((day) => {
          expect(day.actions.length).toBeGreaterThanOrEqual(1);
          expect(day.actions.length).toBeLessThanOrEqual(5);
        });

        // Total actions across week should be reasonable
        const totalActions = plan.days.reduce((sum, day) => sum + day.actions.length, 0);
        expect(totalActions).toBeGreaterThanOrEqual(7);
        expect(totalActions).toBeLessThanOrEqual(30);
      }
    });

    it('should include high priority actions in early days', async () => {
      const input = {
        productDescription: 'SaaS product',
        targetMarket: 'SMBs',
        availableHoursPerDay: 5,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(true);
      if (result.success) {
        const day1Actions = result.data!.days[0].actions;
        const highPriorityCount = day1Actions.filter((a) => a.priority === 'high').length;

        // Day 1 should have at least one high priority action
        expect(highPriorityCount).toBeGreaterThan(0);
      }
    });
  });

  describe('Input validation', () => {
    it('should return error for empty productDescription', async () => {
      const input = {
        productDescription: '',
        targetMarket: 'Test market',
        availableHoursPerDay: 4,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for empty targetMarket', async () => {
      const input = {
        productDescription: 'Test product',
        targetMarket: '',
        availableHoursPerDay: 4,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for zero hours', async () => {
      const input = {
        productDescription: 'Test product',
        targetMarket: 'Test market',
        availableHoursPerDay: 0,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });

    it('should return error for negative hours', async () => {
      const input = {
        productDescription: 'Test product',
        targetMarket: 'Test market',
        availableHoursPerDay: -5,
      };

      const result = await generatePlan(input, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_INPUT');
    });
  });
});
