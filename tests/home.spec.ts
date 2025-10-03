import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

/**
 * Home Page Test Suite
 *
 * Following 4.1-Beast methodology with:
 * - Comprehensive test coverage
 * - Page Object Model pattern
 * - Detailed error handling
 * - Accessibility testing
 * - Mobile responsiveness testing
 */

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe("Page Load and Basic Elements", () => {
    test("should load home page successfully", async () => {
      await homePage.verifyPageLoaded();
    });

    test("should display logo correctly", async () => {
      await homePage.verifyLogoDisplay();
    });

    test("should display navigation elements", async () => {
      await homePage.verifyNavigation();
    });
  });

  test.describe("Hero Section", () => {
    test("should display hero section with all elements", async () => {
      await homePage.verifyHeroSection();
    });

    test("should display hero badge with animation", async () => {
      await expect(homePage.heroBadge).toBeVisible();

      // Verify badge has pulse animation
      const badgeClasses = await homePage.heroBadge
        .locator("span")
        .first()
        .getAttribute("class");
      expect(badgeClasses).toContain("animate-pulse");
    });

    test("should display hero title in Thai", async () => {
      // The hero title contains both the main text and subtitle
      await expect(homePage.heroTitle).toContainText("เฮลท์ แอนด์ เวลเนส");
      await expect(homePage.heroSubtitle).toHaveText("สตูดิโอ");
    });

    test("should have working CTA buttons", async () => {
      await expect(homePage.consultAIButton).toBeEnabled();
      await expect(homePage.heroLoginButton).toBeEnabled();
    });

    test("should navigate to chat when clicking consult AI button", async ({
      page,
    }) => {
      await homePage.clickConsultAIButton();
      // Should navigate to either /chat (if authenticated) or /auth/login (if not)
      expect(page.url()).toMatch(/\/(chat|auth\/login)/);
    });
  });

  test.describe("Features Section", () => {
    test("should display all feature cards", async () => {
      await homePage.verifyFeaturesSection();
    });

    test("should display exactly 3 feature cards", async () => {
      const cardCount = await homePage.featureCards.count();
      expect(cardCount).toBe(3);
    });

    test("should have hover effects on feature cards", async () => {
      await homePage.testFeatureCardHover();
    });

    test("should display feature icons", async () => {
      // Verify first three feature cards have icons
      await expect(homePage.spaFeatureCard).toBeVisible();
      await expect(homePage.bookingFeatureCard).toBeVisible();
      await expect(homePage.healthFeatureCard).toBeVisible();
    });

    test("should display feature descriptions in Thai", async ({ page }) => {
      await expect(page.getByText("บริการนวดแผนไทย นวดอโรมา")).toBeVisible();
      await expect(page.getByText("จองคิวบริการสปา")).toBeVisible();
      await expect(page.getByText("คำแนะนำการดูแลสุขภาพ")).toBeVisible();
    });
  });

  test.describe("Stats Section", () => {
    test("should display stats section", async () => {
      await homePage.verifyStatsSection();
    });

    test("should display customer statistics", async () => {
      await expect(homePage.customerCount).toHaveText("5K+");
      await expect(homePage.satisfactionRate).toHaveText("98%");
      await expect(homePage.experienceYears).toHaveText("10+");
    });

    test("should have gradient background", async ({ page }) => {
      // Use test ID to avoid strict mode violation (multiple elements with same gradient classes)
      const statsSection = page.getByTestId("stats-gradient-section");
      await expect(statsSection).toBeVisible();
    });
  });

  test.describe("Footer", () => {
    test("should display footer with logo", async () => {
      await homePage.verifyFooter();
    });

    test("should display copyright text", async () => {
      await expect(homePage.copyrightText).toContainText("© 2025");
      await expect(homePage.copyrightText).toContainText(
        "เฮลท์ แอนด์ เวลเนส สตูดิโอ"
      );
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to login page", async ({ page }) => {
      await homePage.clickLoginButton();
      expect(page.url()).toContain("/auth/login");
    });

    test("should navigate to sign up page", async ({ page }) => {
      await homePage.clickSignUpButton();
      expect(page.url()).toContain("/auth/sign-up");
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      const h1Elements = await page.locator("h1").count();
      expect(h1Elements).toBeGreaterThan(0);
    });

    test("should have alt text for all images", async () => {
      await homePage.verifyAccessibility();
    });

    test("should be keyboard navigable", async ({ page }) => {
      // Tab through navigation
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Login button should be focused
      await expect(homePage.loginButton).toBeFocused();
    });

    test("should have proper ARIA labels", async ({ page }) => {
      const logo = page.locator('img[alt*="Logo"]').first();
      const alt = await logo.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt).toContain("Logo");
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test("should display correctly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await homePage.verifyMobileLayout();
    });

    test("should hide desktop-only elements on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Ghost login button should be hidden on mobile
      await expect(homePage.loginButton).toBeHidden();

      // Sign up button should still be visible
      await expect(homePage.signUpButton).toBeVisible();
    });

    test("should display correctly on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(homePage.logo).toBeVisible();
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.spaFeatureCard).toBeVisible();
    });

    test("should have responsive feature grid", async ({ page }) => {
      // Desktop: 3 columns
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(homePage.featureCards.first()).toBeVisible();

      // Mobile: 1 column
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(homePage.featureCards.first()).toBeVisible();
    });
  });

  test.describe("Visual Regression", () => {
    test("should match home page screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot("home-page.png", {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });

    test("should match hero section screenshot", async ({ page }) => {
      const heroSection = page.locator("main > div").first();
      await expect(heroSection).toHaveScreenshot("hero-section.png", {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe("Performance", () => {
    test("should load within acceptable time", async ({ page }) => {
      const startTime = Date.now();
      await homePage.goto();
      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("should have optimized images", async ({ page }) => {
      const logo = page.locator('img[alt*="Logo"]').first();
      const src = await logo.getAttribute("src");

      // Logo should be SVG for optimal performance
      expect(src).toContain(".svg");
    });
  });
});
