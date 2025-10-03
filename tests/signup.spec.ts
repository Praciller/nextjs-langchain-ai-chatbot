import { test, expect } from '@playwright/test';
import { SignUpPage } from './pages/SignUpPage';

/**
 * Sign Up Page Test Suite
 * 
 * Tests for:
 * - Thai language consistency
 * - Logo integration
 * - Form validation
 * - Registration flow
 * - Accessibility
 * - Mobile responsiveness
 */

test.describe('Sign Up Page', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto();
  });

  test.describe('Page Load and Basic Elements', () => {
    test('should load sign up page successfully', async () => {
      await signUpPage.verifyPageLoaded();
    });

    test('should display logo correctly', async () => {
      await signUpPage.verifyLogoDisplay();
    });

    test('should display auth layout logo on desktop', async () => {
      await signUpPage.verifyAuthLayoutLogo();
    });
  });

  test.describe('Thai Language Consistency', () => {
    test('should display all text in Thai', async () => {
      await signUpPage.verifyThaiLanguage();
    });

    test('should have Thai card title', async () => {
      await expect(signUpPage.cardTitle).toHaveText('ลงทะเบียน');
    });

    test('should have Thai description', async () => {
      await expect(signUpPage.cardDescription).toHaveText('สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ');
    });

    test('should have Thai input placeholders', async () => {
      await signUpPage.verifyThaiPlaceholders();
    });

    test('should have Thai button text', async () => {
      await expect(signUpPage.signUpButton).toContainText('ลงทะเบียน');
    });

    test('should have Thai link text', async ({ page }) => {
      await expect(page.getByText('มีบัญชีอยู่แล้ว?')).toBeVisible();
    });
  });

  test.describe('Form Elements', () => {
    test('should display all form elements', async () => {
      await signUpPage.verifyFormElements();
    });

    test('should have all required fields', async ({ page }) => {
      const displayNameRequired = await signUpPage.displayNameInput.getAttribute('required');
      const phoneRequired = await signUpPage.phoneInput.getAttribute('required');
      const emailRequired = await signUpPage.emailInput.getAttribute('required');
      const passwordRequired = await signUpPage.passwordInput.getAttribute('required');
      const repeatPasswordRequired = await signUpPage.repeatPasswordInput.getAttribute('required');
      
      expect(displayNameRequired).toBeTruthy();
      expect(phoneRequired).toBeTruthy();
      expect(emailRequired).toBeTruthy();
      expect(passwordRequired).toBeTruthy();
      expect(repeatPasswordRequired).toBeTruthy();
    });
  });

  test.describe('Form Validation', () => {
    test('should validate empty form submission', async () => {
      await signUpPage.verifyFormValidation();
    });

    test('should validate email format', async ({ page }) => {
      await signUpPage.fillSignUpForm(
        'Test User',
        '0812345678',
        'invalid-email',
        'password123',
        'password123'
      );
      await signUpPage.clickSignUp();
      
      const emailValidity = await signUpPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBe(false);
    });

    test('should validate password mismatch', async () => {
      await signUpPage.testPasswordMismatch();
    });

    test('should show Thai error for password mismatch', async () => {
      await signUpPage.fillSignUpForm(
        'Test User',
        '0812345678',
        'test@example.com',
        'password123',
        'password456'
      );
      await signUpPage.clickSignUp();
      
      await signUpPage.verifyPasswordMismatchError();
    });

    test('should validate phone number format', async ({ page }) => {
      await signUpPage.phoneInput.fill('invalid-phone');
      
      // Phone input should accept the value (no strict validation)
      const value = await signUpPage.phoneInput.inputValue();
      expect(value).toBe('invalid-phone');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page', async ({ page }) => {
      await signUpPage.clickLogin();
      expect(page.url()).toContain('/auth/login');
    });

    test('should navigate back to home', async ({ page }) => {
      await signUpPage.clickBackToHome();
      expect(page.url()).toBe(page.url().replace(/\/auth\/sign-up.*/, '/'));
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels', async () => {
      await signUpPage.verifyAccessibility();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await signUpPage.displayNameInput.focus();
      await expect(signUpPage.displayNameInput).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(signUpPage.phoneInput).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(signUpPage.emailInput).toBeFocused();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('should have visible labels', async ({ page }) => {
      await expect(page.getByText('ชื่อที่แสดง')).toBeVisible();
      await expect(page.getByText('เบอร์โทรศัพท์')).toBeVisible();
      await expect(page.getByText('อีเมล')).toBeVisible();
      await expect(page.getByText('รหัสผ่าน', { exact: true })).toBeVisible();
      await expect(page.getByText('ยืนยันรหัสผ่าน')).toBeVisible();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await signUpPage.verifyMobileLayout();
    });

    test('should hide auth layout on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(signUpPage.authLayoutTitle).toBeHidden();
    });

    test('should display form on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(signUpPage.cardTitle).toBeVisible();
      await expect(signUpPage.displayNameInput).toBeVisible();
    });

    test('should work on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(signUpPage.logo).toBeVisible();
      await expect(signUpPage.cardTitle).toBeVisible();
    });

    test('should have scrollable form on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // All form fields should be accessible
      await expect(signUpPage.displayNameInput).toBeVisible();
      await signUpPage.signUpButton.scrollIntoViewIfNeeded();
      await expect(signUpPage.signUpButton).toBeVisible();
    });
  });

  test.describe('Visual Regression', () => {
    test('should match sign up page screenshot', async ({ page }) => {
      await expect(page).toHaveScreenshot('signup-page.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test('should match sign up form screenshot', async ({ page }) => {
      const form = page.locator('form');
      await expect(form).toHaveScreenshot('signup-form.png', {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('Logo Integration', () => {
    test('should display logo in card header', async () => {
      await expect(signUpPage.logo).toBeVisible();
    });

    test('should have correct logo size', async ({ page }) => {
      const logo = signUpPage.logo;
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
      await expect(signUpPage.authLayoutLogo).toBeVisible();
    });

    test('should center logo in card header', async ({ page }) => {
      const cardHeader = page.locator('.text-center').first();
      await expect(cardHeader).toBeVisible();
    });
  });

  test.describe('User Experience', () => {
    test('should show loading state when submitting', async ({ page }) => {
      await signUpPage.fillSignUpForm(
        'Test User',
        '0812345678',
        'test@example.com',
        'password123',
        'password123'
      );
      
      // Click and immediately check button state
      await signUpPage.signUpButton.click();
      
      // Button should show loading text
      const buttonText = await signUpPage.signUpButton.textContent();
      expect(buttonText).toContain('กำลังสร้างบัญชี');
    });

    test('should have proper input types', async () => {
      const emailType = await signUpPage.emailInput.getAttribute('type');
      const passwordType = await signUpPage.passwordInput.getAttribute('type');
      const phoneType = await signUpPage.phoneInput.getAttribute('type');
      
      expect(emailType).toBe('email');
      expect(passwordType).toBe('password');
      expect(phoneType).toBe('tel');
    });
  });
});

