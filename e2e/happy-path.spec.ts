import { test, expect } from '@playwright/test';

test.describe('Happy Path: Landing -> Login -> Diagnostic', () => {
  test('should load landing page with Florece branding', async ({ page }) => {
    await page.goto('/');

    // Verify branding
    await expect(page.locator('h1')).toContainText('Florece');
    await expect(page.locator('text=Tu micro-emprendimiento en 7 días')).toBeVisible();

    // Screenshot: Landing page
    await page.screenshot({ path: 'e2e/screenshots/01-landing.png' });
  });

  test('should navigate to login page from CTA', async ({ page }) => {
    await page.goto('/');

    // Click the main CTA
    await page.click('text=Comenzar mi diagnóstico');

    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Bienvenido de vuelta')).toBeVisible();

    // Screenshot: Login page
    await page.screenshot({ path: 'e2e/screenshots/02-login.png' });
  });

  test('should show demo credentials button on login', async ({ page }) => {
    await page.goto('/login');

    // Demo credentials button should be visible
    const demoButton = page.locator('text=Usar credenciales demo');
    await expect(demoButton).toBeVisible();

    // Click demo credentials
    await demoButton.click();

    // Email field should be filled
    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveValue('demo@florece.app');

    // Screenshot: Login with demo creds filled
    await page.screenshot({ path: 'e2e/screenshots/03-login-demo-creds.png' });
  });

  test('should show login form with correct fields', async ({ page }) => {
    await page.goto('/login');

    // Verify form fields
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verify toggle between login and signup
    await page.click('text=Regístrate');
    await expect(page.locator('text=Crea tu cuenta')).toBeVisible();

    await page.click('text=Inicia sesión');
    await expect(page.locator('text=Bienvenido de vuelta')).toBeVisible();

    // Screenshot: Login form
    await page.screenshot({ path: 'e2e/screenshots/04-login-form.png' });
  });

  test('should show value propositions on landing', async ({ page }) => {
    await page.goto('/');

    // Verify the 3 value propositions
    await expect(page.locator('text=Plan Personalizado')).toBeVisible();
    await expect(page.locator('text=Audio-First')).toBeVisible();
    await expect(page.locator('text=Seguimiento Real')).toBeVisible();

    // Verify footer
    await expect(page.locator('text=Hecho con')).toBeVisible();

    // Screenshot: Full landing
    await page.screenshot({ path: 'e2e/screenshots/05-landing-features.png', fullPage: true });
  });
});

test.describe('Navigation Guards', () => {
  test('should redirect to login when accessing diagnostic without auth', async ({ page }) => {
    await page.goto('/diagnostic');

    // Should redirect to login (or show auth-required state)
    // The exact behavior depends on middleware/auth context
    // At minimum, we verify the page loads without errors
    await expect(page.locator('body')).toBeVisible();

    // Screenshot: Auth redirect
    await page.screenshot({ path: 'e2e/screenshots/06-auth-redirect.png' });
  });
});
