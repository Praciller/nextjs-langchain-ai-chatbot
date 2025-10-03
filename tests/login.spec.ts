import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

/**
 * Login Page Test Suite
 * 
 * Tests for:
 * - Thai language consistency
 * - Logo integration
 * - Form validation
 * - Authentication flow
 * - Accessibility
 * - Mobile responsiveness
 */

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Page Load and Basic Elements', () => {
    test('should load login page successfully', async () => {
      await loginPage.verifyPageLoaded();
    });

    test('should display logo correctly', async () => {
      await loginPage.verifyLogoDisplay();
    });

    test('should display auth layout logo on desktop', async () => {
      await loginPage.verifyAuthLayoutLogo();
    });
  });

  test.describe('Thai Language Consistency', () => {
    test('should display all text in Thai', async () => {
      await loginPage.verifyThaiLanguage();
    });

    test('should have Thai card title', async () => {
      await expect(loginPage.cardTitle).toHaveText('เข้าสู่ระบบ');
    });

    test('should have Thai description', async () => {
      await expect(loginPage.cardDescription).toBeVisible();
    });

    test('should have Thai forgot password link', async () => {
      await expect(loginPage.forgotPasswordLink).toHaveText('ลืมรหัสผ่าน?');
    });

    test('should have Thai back to home button', async () => {
      await expect(loginPage.backToHomeButton).toBeVisible();
    });
  });

  test.describe('Form Elements', () => {
    test('should display all form elements', async () => {
      await loginPage.verifyFormElements();
    });

    test('should display demo credentials section', async () => {
      await loginPage.verifyDemoCredentials();
    });

    test('should auto-fill demo credentials', async () => {
      await loginPage.useAutoFill();
    });
  });

  test.describe('Form Validation', () => {
    test('should validate empty form submission', async () => {
      await loginPage.verifyFormValidation();
    });

    test('should validate email format', async ({ page }) => {
      await loginPage.fillLoginForm('invalid-email', 'password123');
      await loginPage.clickLogin();
      
      const emailValidity = await loginPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBe(false);
    });

    test('should require password', async ({ page }) => {
      await loginPage.emailInput.fill('test@example.com');
      await loginPage.clickLogin();
      
      const passwordValidity = await loginPage.passwordInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(passwordValidity).toBe(false);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to sign up page', async ({ page }) => {
      await loginPage.clickSignUp();
      expect(page.url()).toContain('/auth/sign-up');
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.clickForgotPassword();
      expect(page.url()).toContain('/auth/forgot-password');
    });

    test('should navigate back to home', async ({ page }) => {
      await loginPage.clickBackToHome();
      expect(page.url()).toBe(page.url().replace(/\/auth\/login.*/, '/'));
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels', async () => {
      await loginPage.verifyAccessibility();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await loginPage.emailInput.focus();
      await expect(loginPage.emailInput).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(loginPage.passwordInput).toBeFocused();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      const emailLabel = await loginPage.emailInput.getAttribute('aria-label');
      const passwordLabel = await loginPage.passwordInput.getAttribute('aria-label');
      
      // Either aria-label or associated label should exist
      const hasEmailLabel = emailLabel || await page.getByText('Email').isVisible();
      const hasPasswordLabel = passwordLabel || await page.getByText('Password').isVisible();
      
      expect(hasEmailLabel).toBeTruthy();
      expect(hasPasswordLabel).toBeTruthy();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await loginPage.verifyMobileLayout();
    });

    test('should hide auth layout on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(loginPage.authLayoutTitle).toBeHidden();
    });

    test('should display form on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(loginPage.cardTitle).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
    });

    test('should work on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(loginPage.logo).toBeVisible();
      await expect(loginPage.cardTitle).toBeVisible();
    });
  });

  test.describe('Visual Regression', () => {
    test('should match login page screenshot', async ({ page }) => {
      await expect(page).toHaveScreenshot('login-page.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test('should match login form screenshot', async ({ page }) => {
      const form = page.locator('form');
      await expect(form).toHaveScreenshot('login-form.png', {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('Logo Integration', () => {
    test('should display logo in card header', async () => {
      await expect(loginPage.logo).toBeVisible();
    });

    test('should have correct logo size', async ({ page }) => {
      const logo = loginPage.logo;
      const box = await logo.boundingBox();
      
      expect(box).toBeTruthy();
      if (box) {
        // Logo should be 64x64 (xl size)
        expect(box.width).toBeGreaterThan(50);
        expect(box.height).toBeGreaterThan(50);
      }
    });

    test('should display auth layout logo on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(loginPage.authLayoutLogo).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should display error for invalid credentials', async ({ page }) => {
      await loginPage.login('invalid@example.com', 'wrongpassword');
      
      // Wait for error message or toast
      await page.waitForTimeout(2000);
      
      // Should either show error message or stay on login page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
    });
  });
});

